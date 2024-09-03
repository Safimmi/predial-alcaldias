if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');

const databaseManager = require('./config/database/databaseManager');

const pageRoutes = require('./routes/pageRoutes');
const predialRoutes = require('./routes/predialRoutes');

const multiTenantMiddleware = require('./middlewares/multiTenantMiddleware');
const errorMiddleware = require('./middlewares/errorMiddleware');
const publicErrorMiddleware = require('./middlewares/publicErrorMiddleware');

//* App
const app = express();
app.set('view engine', 'ejs');

//* Static Files
app.use(express.static(__dirname + '/../public'));

//* Middlewares
app.use(multiTenantMiddleware);

//* Routes
app.use(pageRoutes);
app.get('/api/', (req, res) => { res.send('API'); });
app.use('/api/predial', predialRoutes);

//* Error Handlers (Middlewares)
app.use(publicErrorMiddleware);
app.use(errorMiddleware);

//* Server
databaseManager.connectAllDb()
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`
        ┌─────────────────────────────┐
        │ 🚀 Server is running!       │
        ├─────────────────────────────┤
        │ Environment: ${process.env.NODE_ENV || 'development'}
        │ Port: ${port}                  │
        └─────────────────────────────┘
      `);
    });
  });
