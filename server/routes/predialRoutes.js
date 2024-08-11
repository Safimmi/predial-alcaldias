const express = require('express');
const predialController = require('../controllers/predialController');

const authMiddleware = require('../middlewares/authMiddleware');
const setPublicFlagMiddleware = require('../middlewares/setPublicFlagMiddleware');
const validatePredialId = require('../middlewares/validatePredialId');

const router = express.Router();

router.get(
  '/:id',
  authMiddleware,
  validatePredialId,
  predialController.getPredialById
);

router.get(
  '/public/:id',
  setPublicFlagMiddleware,
  validatePredialId,
  predialController.getPublicPredialById
);

router.get(
  '/public/receipt/:id',
  setPublicFlagMiddleware,
  validatePredialId,
  predialController.getPredialReceipt
);

module.exports = router;
