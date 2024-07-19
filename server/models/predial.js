const mongoose = require('mongoose');

// TODO: Define DB data model ~ and define mongoose schema
const predialSchema = mongoose.Schema({
  ficha: { type: [String], required: true },
});

const Predial = mongoose.model('predial', predialSchema, 'natagaima_final_ok');

module.exports = Predial;
