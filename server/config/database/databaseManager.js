const adminDatabase = require('./adminDatabase');
const tenantDatabase = require('./tenantDatabase');

const { addContext } = require('../appContext');
const { registerConnection, getConnection } = require('./databaseConnection');

const { findActiveTenants } = require('../../services/tenantService');

const { ADMIN, TENANT } = require('../../constants/databaseTypes');
const DatabaseError = require('../../errors/databaseError');

const connectAdminDb = async () => {
  try {
    const adminDb = await adminDatabase.connectDb();
    registerConnection(ADMIN, adminDb);
  } catch (error) {
    throw error;
  }
};

const connectTenantDb = async (tenant) => {
  try {
    const tenantDbName = tenant.subdomain;
    const tenantDb = await tenantDatabase.connectDb(tenantDbName);
    registerConnection(tenantDbName, tenantDb);
    addContext(tenantDbName, tenant.toObject());
  } catch (error) {
    console.error(error);
  }
};

const connectAllDb = async () => {
  try {
    await connectAdminDb();
    const activeTenants = await findActiveTenants(getConnection(ADMIN));

    for (const tenant of activeTenants) {
      await connectTenantDb(tenant);
    }
  } catch (error) {
    const isTenantDbError = error instanceof DatabaseError && error.dbType == TENANT;
    if (!isTenantDbError) {
      throw error;
    }
  }
};

module.exports = {
  connectAllDb
};
