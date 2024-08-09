const fs = require('fs');
const path = require('path');
const { PDFDocument, TextAlignment, StandardFonts } = require('pdf-lib');

const ReportError = require('../errors/reportError');
const { generateBarcode } = require('./barcode');

const { CONFIG_PATH } = require('../config/config');
const { ONE_LINE, MULTI_LINE, BARCODE } = require('../constants/reportFieldTypes');
const { DEFAULT_FONT_SIZE, DEFAULT_ALIGNMENT } = require('../constants/reportFieldDefaultFormat');

let FONTS = null;

//* Utils

async function saveFilledReport(pdfBytes) {
  const OUTPUT_FORM_URL = path.join(CONFIG_PATH, "/receipt-form-filled.pdf");
  await fs.promises.writeFile(OUTPUT_FORM_URL, pdfBytes);
}

function truncateText(text, font, fontSize, fieldSize) {
  let truncatedText = '';
  let currentWidth = 0;

  for (const char of text) {
    const charWidth = font.widthOfTextAtSize(char, fontSize);
    if (currentWidth + charWidth > fieldSize) {
      break;
    }
    truncatedText += char;
    currentWidth += charWidth;
  }

  return truncatedText;
}

//* Format

async function loadEmbededFonts(pdfDoc) {
  // HACK: pdf-lib does not support native text decoration
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  return {
    regular,
    bold
  };
}

function getFont(fieldMap) {
  const isBold = fieldMap.isBold;
  return isBold ? FONTS.bold : FONTS.regular;
}

function getFontSize(fieldMap) {
  return fieldMap.fontSize ? fieldMap.fontSize : DEFAULT_FONT_SIZE;
}

function applyTextFormat(field, fieldMap) {
  const font = getFont(fieldMap);
  const fontSize = getFontSize(fieldMap);
  const alignment = fieldMap.alignment && Object.hasOwn(TextAlignment, fieldMap.alignment)
    ? TextAlignment[fieldMap.alignment]
    : TextAlignment[DEFAULT_ALIGNMENT];

  field.updateAppearances(font);
  field.setFontSize(fontSize);
  field.setAlignment(alignment);
}

//* Fill

function fillMultiLineTextField(field, fieldMap, data) {
  const map = fieldMap.map;
  const isTruncated = fieldMap.isTruncated;
  const fieldSize = isTruncated && fieldMap.fieldSize ? fieldMap.fieldSize : null;
  const font = getFont(fieldMap);
  const fontSize = getFontSize(fieldMap);

  let text = '';

  data[map].forEach(item => {
    item = isTruncated && fieldSize
      ? `${truncateText(item, font, fontSize, fieldSize)}\n`
      : `${item}\n`;
    text = `${text}${item}`;
  });

  field.enableMultiline();
  field.setText(text);
}

function fillOneLineTextField(field, fieldMap, data) {
  const map = fieldMap.map;
  field.setText(data[map][0]);
}

function fillField(key, fieldMap, fillFieldCallback) {
  const hasMultipleFields = fieldMap.hasMultipleFields;
  const fieldMapBase = fieldMap.map;
  const numberOfFields = hasMultipleFields && fieldMap.numberOfFields && !isNaN(fieldMap.numberOfFields)
    ? fieldMap.numberOfFields
    : 1;

  for (let i = 1; i <= numberOfFields; i++) {
    let fieldName = hasMultipleFields ? `${key}_${i}` : key;
    fieldMap.map = hasMultipleFields ? `${fieldMapBase}${i}` : fieldMapBase;
    fillFieldCallback(fieldName);
  }
}

//* Validations

function validateMappedField(field, fieldMap, data) {
  const hasData = data[fieldMap.map] !== undefined;
  if (!hasData) {
    throw new Error(`The mapped value "${fieldMap.map}" in field ${field} does not exist in the DB schema`);
  }
}

function validateMapStructure(field, fieldMap) {
  if (!Object.hasOwn(fieldMap, 'fieldType')) {
    throw new Error(`Missing \"fieldType\" property in field ${field}`);
  }

  if (!Object.hasOwn(fieldMap, 'map')) {
    throw new Error(`Missing \"map\" property in field ${field}`);
  }
}

//* Reports

async function generateReceipt(data) {
  try {
    const RECEIPT_FORM_URL = path.join(CONFIG_PATH, "/receipt-form.pdf");
    const RECEIPT_FORM_MAP_URL = path.join(CONFIG_PATH, "/receipt-form-map.json");

    const formFile = await fs.promises.readFile(RECEIPT_FORM_URL);
    const pdfDoc = await PDFDocument.load(formFile);
    const form = pdfDoc.getForm();

    const formMapFile = await fs.promises.readFile(RECEIPT_FORM_MAP_URL);
    const formMap = JSON.parse(formMapFile);

    FONTS = await loadEmbededFonts(pdfDoc);

    for (const key of Object.keys(formMap)) {
      const fieldMap = formMap[key];
      validateMapStructure(key, fieldMap);

      switch (fieldMap.fieldType) {
        case ONE_LINE: {
          fillField(
            key,
            fieldMap,
            (key) => {
              validateMappedField(key, fieldMap, data);
              let field = form.getTextField(key);
              fillOneLineTextField(field, fieldMap, data);
              applyTextFormat(field, fieldMap);
            }
          );
          break;
        }
        case MULTI_LINE: {
          fillField(
            key,
            fieldMap,
            (key) => {
              validateMappedField(key, fieldMap, data);
              let field = form.getTextField(key);
              fillMultiLineTextField(field, fieldMap, data);
              applyTextFormat(field, fieldMap);
            }
          );
          break;
        }
        case BARCODE: {
          // TODO: Allow hasMultipleFields for barcode type 
          validateMappedField(key, fieldMap, data);
          let field = form.getButton(key);
          const barcode = await generateBarcode(data[fieldMap.map][0]);
          const barcodeImage = await pdfDoc.embedPng(barcode);
          field.setImage(barcodeImage);
          break;
        }
        default:
          throw new Error(`The type specified for the field ${key} is not valid`);
      }
    }

    form.flatten();
    const pdfBytes = await pdfDoc.save();

    if (process.env.NODE_ENV === "development") {
      saveFilledReport(pdfBytes);
    }
    return pdfBytes;
  } catch (error) {
    const reportError = new ReportError(error.message, error);
    console.error("❌📄 REPORT ERROR\n", reportError);
    throw reportError;
  }
}

module.exports = {
  generateReceipt
};
