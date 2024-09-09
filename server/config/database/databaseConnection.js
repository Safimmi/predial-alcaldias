const DB_CONNECTIONS = {};

const isRegistered = (connectionName) => {
  return Object.hasOwn(DB_CONNECTIONS, connectionName);
};

const registerConnection = (connectionName, connection) => {
  DB_CONNECTIONS[connectionName] = connection;
};

const getConnection = (connectionName) => {
  if (isRegistered) {
    return DB_CONNECTIONS[connectionName];
  }
  return undefined;
};

module.exports = {
  isRegistered,
  getConnection,
  registerConnection
};
