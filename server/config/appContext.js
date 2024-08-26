const path = require('path');
const { toUppercaseFirst } = require('../utils/utils');

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

const formatAndValidateContext = (ctx) => {
  ctx.municipality = ctx.municipality ? toUppercaseFirst(ctx.municipality) : '';
  ctx.department = ctx.department ? toUppercaseFirst(ctx.department) : '';
  ctx.entity = ctx.entity ? ctx.entity : '';
};

const addContext = (contextName, context) => {
  if (!hasContext(contextName)) {
    APP_CTX[contextName] = {
      ...context,
      configPath: path.join(CONFIG_PATH, context.subdomain)
    };
    formatAndValidateContext(APP_CTX[contextName]);
  }
};

module.exports = {
  getContext,
  addContext
};
