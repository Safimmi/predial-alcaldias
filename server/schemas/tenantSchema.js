const mongoose = require('mongoose');

const tenantSchema = mongoose.Schema({
  code: {
    type: String,
    unique: true,
  },
  subdomain: {
    type: String,
    required: true,
    unique: true,
  },
  municipality: {
    type: String
  },
  department: {
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
  },
  codeDane: {
    type: String,
    unique: true,
  }
});

module.exports = tenantSchema;
