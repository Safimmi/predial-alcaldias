const { getContext } = require('../config/appContext');
const { isRegistered, getConnection } = require('../config/database/databaseConnection');

const multiTenantMiddleware = (req, res, next) => {
  const tenantName = req.hostname.split('.')[0];

  if (!tenantName || !isRegistered(tenantName)) {
    //TODO: handle non valid subdomains
    //? Return 404
    //? Redirect to 404 
    //? Throw an error 
    return res.status(400).send('Invalid tenant');
  }

  req.tenant = {};
  req.tenant.name = tenantName;
  req.tenant.db = getConnection(tenantName);
  req.tenant.ctx = getContext(tenantName);
  req.tenant.configPath = req.tenant.ctx.configPath;

  next();
};

module.exports = multiTenantMiddleware;
