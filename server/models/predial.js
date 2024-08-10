const mongoose = require('mongoose');

// TODO: Define DB data model ~ and define mongoose schema
const predialSchema = mongoose.Schema({

  //* Contribuyente - Predio

  ficha: { type: [String] },
  ficha_2: { type: [String], alias: 'fichaCorta' },
  propietario: { type: [String] },
  cc_propietario: { type: [String], alias: 'propietarioId' },

  direccion_1: { type: [String], alias: 'direccion1' },
  direccion_2: { type: [String], alias: 'direccion2' },
  direccion_3: { type: [String], alias: 'direccion3' },
  direccion_4: { type: [String], alias: 'direccion4' },

  area: { type: [String], alias: 'areaHa' },
  metros: { type: [String], alias: 'areaMts' },
  construido: { type: [String], alias: 'areaConstruido' },
  matricula: { type: [String] },
  estrato: { type: [String] },

  //* Facturacion

  factura_1: { type: [String], alias: 'factura' },
  llave: { type: [String] },

  fecha_facturacion: { type: [String], alias: 'fechaFactura' },

  debe_desde: { type: [String], alias: 'debeDesde' },
  pago_desde: { type: [String], alias: 'pagoDesde' },
  hasta: { type: [String], alias: 'pagoHasta' },

  //* Capital

  cod_concepto_capital: { type: [String], alias: 'capitalCodigo' },
  concepto_capital: { type: [String], alias: 'capitalConcepto' },
  ano_2: { type: [String], alias: 'capitalPeriodo' },
  impuesto: { type: [String], alias: 'capitalImpuesto' },
  desc_1: { type: [String], alias: 'capitalDescuento1' },
  porcentaje_desc_1: { type: [String], alias: 'capitalPorcentajeDescuento1' },
  desc_2: { type: [String], alias: 'capitalDescuento2' },
  porcentaje_desc_2: { type: [String], alias: 'capitalPorcentajeDescuento2' },
  desc_3: { type: [String], alias: 'capitalDescuento3' },
  porcentaje_desc_3: { type: [String], alias: 'capitalPorcentajeDescuento3' },

  //* Intereses

  cod_concepto_intereses: { type: [String], alias: 'interesesCodigo' },
  concepto_intereses: { type: [String], alias: 'interesesConcepto' },
  ano_3: { type: [String], alias: 'interesesPeriodo' },
  interes_1: { type: [String], alias: 'interesesValor1' },
  rebaja_1: { type: [String], alias: 'interesesRebaja1' },
  porcentaje_rebaja_1: { type: [String], alias: 'interesesPorcentajeRebaja1' },
  interes_2: { type: [String], alias: 'interesesValor2' },
  rebaja_2: { type: [String], alias: 'interesesRebaja2' },
  porcentaje_rebaja_2: { type: [String], alias: 'interesesPorcentajeRebaja2' },
  interes_3: { type: [String], alias: 'interesesValor3' },
  rebaja_3: { type: [String], alias: 'interesesRebaja3' },
  porcentaje_rebaja_3: { type: [String], alias: 'interesesPorcentajeRebaja3' },

  //* Pago

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

const Predial = mongoose.model('predial', predialSchema, 'prediales');

module.exports = Predial;
