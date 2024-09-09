class DatabaseError extends Error {
  constructor(dbType, dbName, error) {
    super(`An error occurred while connecting to the ${dbType} DB`);
    this.name = 'DatabaseError';
    this.wrappedError = error;
    this.dbType = dbType;
    this.dbName = dbName;
    this.log();
  }

  log() {
    console.error(`
      ┌────────────────────────────────┐
      │ ❌ ${this.dbType} DB Connection Error!
      ├────────────────────────────────│
      │ Database: ${this.dbName}
      └────────────────────────────────┘
    `);
  }
}

module.exports = DatabaseError;
