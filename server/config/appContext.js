const path = require('path');
const { toTitleCase } = require('../utils/utils');

const CONFIG_PATH = path.resolve(__dirname, "../../config");
const APP_CTX = {};

const hasContext = (contextName) => {
  return Object.hasOwn(APP_CTX, contextName);
};

const getContext = (contextName) => {
  if (hasContext(contextName)) {
    return APP_CTX[contextName];
  }
  return undefined;
};

const getPublicImagePath = (ctx) => {
  const subdomain = ctx.subdomain.toLowerCase().split('-');
  const municipality = `/${subdomain[0]}`;
  const department = subdomain[1] ? `/${subdomain[1]}` : '';
  return `/images${department}${municipality}`;
};

const getConfigPath = (ctx) => {
  const subdomain = ctx.subdomain.toLowerCase().split('-');
  const municipality = subdomain[0];
  const department = subdomain[1] ? subdomain[1] : '';
  return path.join(CONFIG_PATH, department, municipality);
};

const formatAndValidateContext = (ctx) => {
  ctx.municipality = ctx.municipality ? toTitleCase(ctx.municipality) : '';
  ctx.department = ctx.department ? toTitleCase(ctx.department) : '';
  ctx.entity = ctx.entity ? ctx.entity : '';
};

const addContext = (contextName, context) => {
  if (!hasContext(contextName)) {
    formatAndValidateContext(context);
    APP_CTX[contextName] = {
      ...context,
      configPath: getConfigPath(context),
      imagePath: getPublicImagePath(context)
    };
  }
};

module.exports = {
  getContext,
  addContext
};
