const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const predialController = require('../controllers/predialController');

const router = express.Router();

router.get('/:id', authMiddleware, predialController.getPredialById);
router.get('/public/:id', predialController.getPublicPredialById);

module.exports = router;
