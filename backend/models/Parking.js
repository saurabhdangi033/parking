const mongoose = require('mongoose');

const parkingSchema = new mongoose.Schema({
  floors: [
    {
      floor: { type: Number, required: true },
      vehicles: [
        {
          type: { type: String, required: true },
          ticket: { type: String, required: true }
        }
      ]
    }
  ]
});

module.exports = mongoose.model('Parking', parkingSchema);
