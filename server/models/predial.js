const mongoose = require('mongoose');

// TODO: Define DB data model ~ and define mongoose schema
const predialSchema = mongoose.Schema({
  ficha: { type: [String] },
  ficha_2: { type: [String], alias: 'fichaCorta' },
  propietario: { type: [String] },
  cc_propietario: { type: [String], alias: 'propietarioId' },
  factura_1: { type: [String], alias: 'factura' },
  llave: { type: [String] },
  area: { type: [String], alias: 'areaHa' },
  metros: { type: [String], alias: 'areaMts' },
  construido: { type: [String] },
  matricula: { type: [String] },
  estrato: { type: [String] },
  fecha_facturacion: { type: [String], alias: 'fechaFacturacion' },


  debe_desde: { type: [String], alias: 'debeDesde' },
  pago_desde: { type: [String], alias: 'pagoDesde' },
  hasta: { type: [String], alias: 'pagoHasta' },


  concepto: { type: [String], alias: 'capitalConcepto' },
  ano_2: { type: [String], alias: 'capitalPeriodo' },
  impuesto: { type: [String], alias: 'capitalImpuesto' },
  desc_1: { type: [String], alias: 'capitalDesc1' },
  porcentaje_desc_1: { type: [String], alias: 'capitalPorDesc1' },
  desc_2: { type: [String], alias: 'capitalDesc2' },
  porcentaje_desc_2: { type: [String], alias: 'capitalPorDesc2' },
  desc_3: { type: [String], alias: 'capitalDesc3' },
  porcentaje_desc_3: { type: [String], alias: 'capitalPorDesc3' },


  pago_1: { type: [String], alias: 'pago1' },
  pago_2: { type: [String], alias: 'pago2' },
  pago_3: { type: [String], alias: 'pago3' },
  fecha_pago_1: { type: [String], alias: 'fechaPago1' },
  fecha_pago_2: { type: [String], alias: 'fechaPago2' },
  fecha_pago_3: { type: [String], alias: 'fechaPago3' },


  referencia: { type: [String] },
  num_barra_1: { type: [String], alias: 'codigoBarras1' },
  num_barra_2: { type: [String], alias: 'codigoBarras2' },
  num_barra_3: { type: [String], alias: 'codigoBarras3' },
});

const Predial = mongoose.model('predial', predialSchema, 'natagaima_final_ok');

module.exports = Predial;
