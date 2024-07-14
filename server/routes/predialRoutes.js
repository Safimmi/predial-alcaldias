const express = require('express');
const {
  getPredialById,
  getPublicPredialById
} = require('../controllers/predialController');

const router = express.Router();

router.get('/:id', getPredialById);
router.get('/public/:id', getPublicPredialById);

module.exports = router;
