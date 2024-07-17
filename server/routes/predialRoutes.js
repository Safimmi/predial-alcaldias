const express = require('express');
const predialController = require('../controllers/predialController');

const authMiddleware = require('../middlewares/authMiddleware');
const setPublicMiddleware = require('../middlewares/setPublicMiddleware');
const validatePredialId = require('../middlewares/validatePredialId');


const router = express.Router();

router.get('/:id', authMiddleware, validatePredialId, predialController.getPredialById);
router.get('/public/:id', setPublicMiddleware, validatePredialId, predialController.getPublicPredialById);

module.exports = router;
