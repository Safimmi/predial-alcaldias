if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');

const database = require('./config/database');
const predialRoutes = require('./routes/predialRoutes');

const errorMiddleware = require('./middlewares/errorMiddleware');
const publicErrorMiddleware = require('./middlewares/publicErrorMiddleware');

//* App
const app = express();

//*Static Files
app.use(express.static(__dirname + '/../public'));

//* Routes 
app.get('/api/', (req, res) => { res.send('API'); });
app.use('/api/predial', predialRoutes);

//* Error Handlers (Middleware)
app.use(publicErrorMiddleware);
app.use(errorMiddleware);

//* Server
database.once('open', () => {
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
