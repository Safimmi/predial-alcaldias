const express = require('express');
const {
  getPredialById
} = require('../controllers/predialController');

const router = express.Router();

router.get('/:id', getPredialById);

module.exports = router;
