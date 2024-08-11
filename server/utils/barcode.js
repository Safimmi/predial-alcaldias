const { toBuffer: bwipjs } = require('bwip-js');

async function generateBarcode(barcodeNumber) {
  return await bwipjs({
    bcid: 'code128',
    text: barcodeNumber,
    scale: 3,
    height: 22,
    includetext: true,
    textxalign: 'center',
    textyoffset: 5
  });
}

module.exports = {
  generateBarcode
};
