if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');

const database = require('./config/database');
const errorMiddleware = require('./middlewares/errorMiddleware');
const predialRoutes = require('./routes/predialRoutes');

//* App
const app = express();

//*Static Files
app.use(express.static(__dirname + '/../public'));

// TODO: Add auth module
//* Routes 
app.get('/api/', (req, res) => { res.send('API'); });
app.use('/api/predial', predialRoutes);

//* Error Handlers (Middleware)
app.use(errorMiddleware);

//* Server
database.once('open', () => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server started at port ${port}...`);
  });
});
