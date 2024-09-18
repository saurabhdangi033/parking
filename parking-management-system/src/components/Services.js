import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For making API requests
import { v4 as uuidv4 } from 'uuid';
import { Modal, Button } from 'react-bootstrap'; // Importing React Bootstrap components
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './Services.css';

function Services() {
  const [parking, setParking] = useState([]); // State for parking data
  const [vehicleType, setVehicleType] = useState(''); // State for vehicle type
  const [ticketID, setTicketID] = useState(''); // State for ticket ID
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(''); // State for modal message
  const [modalTitle, setModalTitle] = useState(''); // State for modal title

  // Fetch parking data from the backend
  useEffect(() => {
    axios.get('https://parking-red.vercel.app/api/parking/getParking')
      .then(response => {
        if (response.data && response.data.length > 0 && response.data[0].floors) {
          const updatedParking = response.data[0].floors.map(floor => ({
            ...floor,
            vehicles: Array.isArray(floor.vehicles) ? floor.vehicles : [],
          }));
          setParking(updatedParking);
        } else {
          setParking([
            { floor: 1, vehicles: [] },
            { floor: 2, vehicles: [] },
            { floor: 3, vehicles: [] },
          ]);
        }
      })
      .catch(error => {
        console.error('Error fetching parking data:', error);
      });
  }, []);

  // Save parking data to the backend
  const saveParkingData = (updatedParking) => {
    const floorsWithFloorField = updatedParking.map((floor, index) => ({
      floor: floor.floor || index + 1,
      vehicles: floor.vehicles,
    }));

    axios.post('https://parking-red.vercel.app/api/parking/saveParking', { floors: floorsWithFloorField })
      .then(response => console.log('Parking data saved:', response.data))
      .catch(error => console.error('Error saving parking data:', error));
  };

  const handleParkVehicle = (e) => {
    e.preventDefault();
    if (!vehicleType) return;

    const ticket = uuidv4();

    const floorIndex = parking.findIndex(floor =>
      Array.isArray(floor.vehicles) && floor.vehicles.length < 5
    );

    if (floorIndex !== -1) {
      const updatedParking = [...parking];
      updatedParking[floorIndex].vehicles.push({ type: vehicleType, ticket });
      setParking(updatedParking);
      saveParkingData(updatedParking);
      setModalTitle('Vehicle Parked');
      setModalMessage(`Your ${vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)} is parked on Floor ${updatedParking[floorIndex].floor}. Ticket ID: ${ticket}`);
      setShowModal(true);
      setVehicleType('');
    } else {
      setModalTitle('No Space Available');
      setModalMessage('No parking space available on any floor!');
      setShowModal(true);
    }
  };

  const handleUnparkVehicle = (e) => {
    e.preventDefault();
    if (!ticketID) return;

    let vehicleFound = false;
    const updatedParking = parking.map(floor => {
      const filteredVehicles = floor.vehicles.filter(vehicle => {
        if (vehicle.ticket === ticketID) {
          vehicleFound = true;
        }
        return vehicle.ticket !== ticketID;
      });
      return { ...floor, vehicles: filteredVehicles };
    });

    if (vehicleFound) {
      setParking(updatedParking);
      saveParkingData(updatedParking);
      setModalTitle('Vehicle Unparked');
      setModalMessage(`Vehicle with Ticket ID: ${ticketID} has been unparked.`);
      setShowModal(true);
      setTicketID('');
    } else {
      setModalTitle('Invalid Ticket ID');
      setModalMessage('Invalid Ticket ID!');
      setShowModal(true);
    }
  };

  return (
    <div className="services-container">
      <header className="services-header">
        <h1>Parking Management</h1>
        {/* <img 
          src="" 
          alt="Parking Management" 
          className="services-image"
        /> */}
      </header>

      <div className="services-content">
        <div className="services-form-container">
          {/* Form for parking a vehicle */}
          <form onSubmit={handleParkVehicle} className="form park-form">
            <h2>Park a Vehicle</h2>
            <label htmlFor="vehicleType">Vehicle Type:</label>
            <select
              id="vehicleType"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="">Select vehicle type</option>
              <option value="car">Car</option>
              <option value="truck">Truck</option>
              <option value="bike">Bike</option>
            </select>
            <button type="submit" className="btn btn-primary">Park Vehicle</button>
          </form>

          {/* Form for unparking a vehicle */}
          <form onSubmit={handleUnparkVehicle} className="form unpark-form">
            <h2>Unpark a Vehicle</h2>
            <label htmlFor="ticketID">Ticket ID:</label>
            <input
              id="ticketID"
              type="text"
              placeholder="Enter ticket ID"
              value={ticketID}
              onChange={(e) => setTicketID(e.target.value)}
            />
            <button type="submit" className="btn btn-danger">Unpark Vehicle</button>
          </form>
        </div>

        {/* Display parking floors and vehicles */}
        <div className="parking-floors">
          {parking.map((floor, index) => (
            <div key={index} className="parking-floor card">
              <h3>Floor {floor.floor}</h3>
              <div className="vehicles-list">
                {floor.vehicles.length > 0 ? (
                  floor.vehicles.map((vehicle, idx) => (
                    <div key={idx} className="vehicle-card card">
                      <div className="vehicle-info">
                        <p>{vehicle.type.toUpperCase()}</p>
                        <small>Ticket: {vehicle.ticket}</small>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No vehicles parked on this floor.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for notifications */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Services;
