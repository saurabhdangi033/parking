const Parking = require('../models/Parking');

// Get all parking data
exports.getParking = async (req, res) => {
  try {
    const parkingData = await Parking.find();
    res.json(parkingData); // Send the array with parking data
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Save or update parking data
exports.saveParking = async (req, res) => {
  const { floors } = req.body;

  try {
    // Validate that 'floors' exists and is an array
    if (!floors || !Array.isArray(floors)) {
      return res.status(400).json({ message: 'Invalid parking data' });
    }

    // Validate that each floor has a 'floor' field
    for (let i = 0; i < floors.length; i++) {
      if (!floors[i].floor) {
        return res.status(400).json({ message: `Floor field is required for floor ${i + 1}` });
      }
    }

    // Check if parking data exists and update, else create new
    let parkingData = await Parking.findOne();
    if (parkingData) {
      parkingData.floors = floors;
      parkingData = await parkingData.save();
    } else {
      parkingData = new Parking({ floors });
      await parkingData.save();
    }

    res.json(parkingData);
  } catch (error) {
    console.error('Error saving parking data:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};


// Park a vehicle
exports.parkVehicle = async (req, res) => {
  const { vehicleType } = req.body;

  try {
    let parkingData = await Parking.findOne();
    if (!parkingData) {
      return res.status(404).json({ message: 'Parking data not found' });
    }

    const floor = parkingData.floors.find(floor => floor.vehicles.length < 5);

    if (!floor) {
      return res.status(400).json({ message: 'No parking space available on any floor' });
    }

    const ticket = uuidv4();
    floor.vehicles.push({ type: vehicleType, ticket });

    await parkingData.save();

    res.json({
      message: `${vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)} is parked on Floor ${floor.floor} with Ticket ID: ${ticket}`,
      parkingData,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Unpark a vehicle
exports.unparkVehicle = async (req, res) => {
  const { ticketID } = req.body;

  try {
    let parkingData = await Parking.findOne();
    if (!parkingData) {
      return res.status(404).json({ message: 'Parking data not found' });
    }

    let vehicleFound = false;
    parkingData.floors = parkingData.floors.map(floor => {
      const filteredVehicles = floor.vehicles.filter(vehicle => {
        if (vehicle.ticket === ticketID) {
          vehicleFound = true;
        }
        return vehicle.ticket !== ticketID;
      });
      return { ...floor, vehicles: filteredVehicles };
    });

    if (vehicleFound) {
      await parkingData.save();
      res.json({ message: `Vehicle with Ticket ID: ${ticketID} is unparked.`, parkingData });
    } else {
      res.status(400).json({ message: 'Invalid Ticket ID' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
