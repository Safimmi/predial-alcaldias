const mongoose = require('mongoose');

const tenantSchema = mongoose.Schema({
  codeDane: {
    type: String,
    unique: true,
  },
  subdomain: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: String
  },
  municipality: {
    type: String
  },
  entity: {
    type: String
  },
  isActive: {
    type: Boolean
  },
  nit: {
    type: String,
    unique: true,
  }
});

module.exports = tenantSchema;
