const express = require('express');
const {
  getParking,
  saveParking,
  parkVehicle,
  unparkVehicle,
} = require('../controllers/parkingController');

const router = express.Router();

// Routes
router.get('/getParking', getParking);
router.post('/saveParking', saveParking);
router.post('/parkVehicle', parkVehicle);
router.post('/unparkVehicle', unparkVehicle);

module.exports = router;
