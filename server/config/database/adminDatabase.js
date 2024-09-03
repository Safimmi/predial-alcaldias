const mongoose = require('mongoose');

const tenantSchema = require('../../schemas/tenantSchema');
const DatabaseError = require('../../errors/databaseError');

const { ADMIN } = require('../../constants/databaseTypes');

const BASE_DB_URI = process.env.BASE_DB_URI;
const ADMIN_DB_NAME = process.env.ADMIN_DB_NAME;

const connectDb = async () => {
  try {
    const adminDbUri = `${BASE_DB_URI}${ADMIN_DB_NAME}`;
    const db = await mongoose.createConnection(adminDbUri).asPromise();

    if (db.readyState !== 1) {
      throw new Error('Failed to establish connection to DB');
    }

    //* Models
    db.model('tenant', tenantSchema, 'tenants');

    console.log(`
      ┌─────────────────────────────┐
      │ 🗄️  Connected to ${ADMIN} DB!   │ 
      ├─────────────────────────────│
      │ Database: ${db.name}        
      │ Ready State: ${db.readyState}
      │ Models: ${db.modelNames()}
      └─────────────────────────────┘`);

    return db;
  } catch (error) {
    throw new DatabaseError(ADMIN, ADMIN_DB_NAME, error);
  }
};

module.exports = {
  connectDb
};
