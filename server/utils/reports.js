const fs = require('fs');
const path = require('path');
const { PDFDocument, TextAlignment, StandardFonts } = require('pdf-lib');

const ReportError = require('../errors/reportError');

const { CONFIG_PATH } = require('../config/config');
const { SINGLE_TEXT, MULTIPLE_TEXT, BARCODE } = require('../constants/reportFieldTypes');
const { DEFAULT_FONT_SIZE, DEFAULT_ALIGNMENT } = require('../constants/reportFieldDefaultFormat');

const { generateBarcode } = require('./barcode');

//* Utils

async function saveFilledReport(pdfBytes) {
  const OUTPUT_FORM_URL = path.join(CONFIG_PATH, "/receipt-form-filled.pdf");
  await fs.promises.writeFile(OUTPUT_FORM_URL, pdfBytes);
}

async function loadEmbededFonts(pdfDoc) {
  // HACK: pdf-lib does not support native text decoration
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  return {
    regular,
    bold
  };
}

function applyTextFormat(field, fieldMap) {
  const fontSize = fieldMap.fontSize ? fieldMap.fontSize : DEFAULT_FONT_SIZE;
  const alignment = fieldMap.alignment && Object.hasOwn(TextAlignment, fieldMap.alignment)
    ? TextAlignment[fieldMap.alignment]
    : TextAlignment[DEFAULT_ALIGNMENT];

  field.setFontSize(fontSize);
  field.setAlignment(alignment);
}

function applyTextFonts(field, fieldMap, fonts) {
  const isBold = fieldMap.isBold;
  const font = isBold ? fonts.bold : fonts.regular;

  field.updateAppearances(font);
}

function fillMultipleTextField(field, fieldMap, data) {
  const map = fieldMap.map;
  let text = '';
  data[map].forEach(item => {
    item = `${item}\n`;
    text = `${text}${item}`;
  });

  field.enableMultiline();
  field.setText(text);
}

function fillSingleTextField(field, fieldMap, data) {
  const map = fieldMap.map;
  field.setText(data[map][0]);
}

function validateMap(field, fieldMap, data) {
  if (!Object.hasOwn(fieldMap, 'fieldType')) {
    throw new Error(`Missing \"fieldType\" property in field ${field}`);
  }

  if (!Object.hasOwn(fieldMap, 'map')) {
    throw new Error(`Missing \"map\" property in field ${field}`);
  }

  const hasData = data[fieldMap.map] !== undefined;
  if (!hasData) {
    throw new Error(`The mapped value "${fieldMap.map}" in field ${field} does not exist in the DB schema`);
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

    const fonts = await loadEmbededFonts(pdfDoc);

    for (const key of Object.keys(formMap)) {
      const fieldMap = formMap[key];
      validateMap(key, fieldMap, data);

      let field = null;

      switch (fieldMap.fieldType) {
        case SINGLE_TEXT:
          field = form.getTextField(key);
          fillSingleTextField(field, fieldMap, data);
          applyTextFormat(field, fieldMap);
          applyTextFonts(field, fieldMap, fonts);
          break;
        case MULTIPLE_TEXT:
          field = form.getTextField(key);
          fillMultipleTextField(field, fieldMap, data);
          applyTextFormat(field, fieldMap);
          applyTextFonts(field, fieldMap, fonts);
          break;
        case BARCODE:
          field = form.getButton(key);
          const barcode = await generateBarcode(data[fieldMap.map][0]);
          const barcodeImage = await pdfDoc.embedPng(barcode);
          field.setImage(barcodeImage);
          break;
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
