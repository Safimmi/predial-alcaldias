const mongoose = require('mongoose');

// TODO: Define DB data model ~ and define mongoose schema
const predialSchema = mongoose.Schema({
  ficha: { type: [String] },
  ficha_2: { type: [String], alias: 'fichaCorta' },
  propietario: { type: [String] },
  factura_1: { type: [String], alias: 'factura' },
  llave: { type: [String] },
  area: { type: [String], alias: 'areaHa' },
  metros: { type: [String], alias: 'areaMts' },
  construido: { type: [String] },
  matricula: { type: [String] },
  estrato: { type: [String] },
  fecha_facturacion: { type: [String], alias: 'fechaFacturacion' },
  pago_desde: { type: [String], alias: 'pagoDesde' },
  hasta: { type: [String], alias: 'pagoHasta' },
  concepto: { type: [String], alias: 'capitalConcepto' },
  referencia: { type: [String] },
  num_barra_1: { type: [String], alias: 'codigoBarras' },
});

const Predial = mongoose.model('predial', predialSchema, 'natagaima_final_ok');

module.exports = Predial;
