const mongoose = require('mongoose');

const predialSchema = require('../../schemas/predialSchema');
const DatabaseError = require('../../errors/databaseError');

const { TENANT } = require('../../constants/databaseTypes');
const { isRegistered } = require('./databaseConnection');

const BASE_DB_URI = process.env.BASE_DB_URI;

const connectDb = async (tenantDbName) => {
  try {
    if (isRegistered(tenantDbName)) {
      throw new Error("Tenant DB name is duplicated");
    }

    if (tenantDbName == undefined) {
      throw new Error("Tenant DB name is undefined");
    }

    const dbUri = `${BASE_DB_URI}${tenantDbName}`;
    const db = await mongoose.createConnection(dbUri).asPromise();

    if (db.readyState !== 1) {
      throw new Error('Failed to establish connection to DB');
    }

    //* Models
    db.model('predial', predialSchema, 'prediales');

    console.log(`
      ┌─────────────────────────────┐
      │ 🗄️  Connected to ${TENANT} DB!  │ 
      ├─────────────────────────────│
      │ Database: ${db.name}        
      │ Ready State: ${db.readyState}
      │ Models: ${db.modelNames()}
      └─────────────────────────────┘`);

    return db;
  } catch (error) {
    throw new DatabaseError(TENANT, tenantDbName, error);
  }
};

module.exports = {
  connectDb
};
