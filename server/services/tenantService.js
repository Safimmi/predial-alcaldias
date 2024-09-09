const findActiveTenants = async (db) => {
  const tenantModel = db.models.tenant;
  const query = { isActive: true };
  return await tenantModel.find(query);
};

module.exports = {
  findActiveTenants
};
