const express = require('express');
const router = express.Router();
const { getTips, getTipById } = require('../controllers/tipController');

router.get('/', getTips);
router.get('/:tipId', getTipById);

module.exports = router;
