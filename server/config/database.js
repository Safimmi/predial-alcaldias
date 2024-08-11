const mongoose = require('mongoose');

const DB_URL = process.env.MONGO_URL;

mongoose.connect(DB_URL)
  .then(() => {
    console.log(`
      ┌─────────────────────────────┐
      │ 🗄️  Connected to DB!         │ 
      ├─────────────────────────────│
      │ Database: MongoDB           │
      │ DB Status: OK               │
      └─────────────────────────────┘`);
  })
  .catch((error) => {
    console.error(`
      ┌─────────────────────────────┐
      │ ❌ DB Connection Error!     │
      ├─────────────────────────────│
      │ Database: MongoDB           │
      │ DB Status: Error            │
      └─────────────────────────────┘
    `, error);
  });

module.exports = mongoose.connection;
