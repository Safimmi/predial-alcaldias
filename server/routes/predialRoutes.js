const express = require('express');
const predialController = require('../controllers/predialController');

const authMiddleware = require('../middlewares/authMiddleware');
const setPublicMiddleware = require('../middlewares/setPublicMiddleware');


const router = express.Router();

router.get('/:id', authMiddleware, predialController.getPredialById);
router.get('/public/:id', setPublicMiddleware, predialController.getPublicPredialById);

module.exports = router;
