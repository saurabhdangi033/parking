import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import './Services.css';

const ParkingCard = () => {
  const slots = {
    car: 10,
    motorcycle: 10,
    bicycle: 10,
  };

  const [vehicleType, setVehicleType] = useState("");
  const [parkedVehicles, setParkedVehicles] = useState({
    car: [],
    motorcycle: [],
    bicycle: [],
  });
  const [ticketIdInput, setTicketIdInput] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get("/vehicles");
        const vehicles = res.data;
        const updatedVehicles = {
          car: vehicles.filter(v => v.vehicleType === "car"),
          motorcycle: vehicles.filter(v => v.vehicleType === "motorcycle"),
          bicycle: vehicles.filter(v => v.vehicleType === "bicycle"),
        };
        setParkedVehicles(updatedVehicles);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  const handleParkVehicle = async () => {
    if (!vehicleType) {
      showModal("Please select a vehicle type!");
      return;
    }

    if (parkedVehicles[vehicleType].length >= slots[vehicleType]) {
      showModal(`No parking slots available for ${vehicleType}s.`);
      return;
    }

    const ticketId = uuidv4();

    try {
      const res = await axios.post("https://parking-backend-amber.vercel.app/park", {
        vehicleType,
        ticketId,
      });

      setParkedVehicles((prevVehicles) => ({
        ...prevVehicles,
        [vehicleType]: [...prevVehicles[vehicleType], res.data],
      }));

      showModal(
        <div className="ticket-card">
          <p>Vehicle parked successfully.</p>
          <p><strong>Ticket ID: {ticketId}</strong></p>
        </div>
      );
      setVehicleType("");
    } catch (error) {
      showModal("Error parking vehicle!");
      console.error(error);
    }
  };

  const handleUnparkVehicle = async () => {
    if (!ticketIdInput) {
      showModal("Please enter a ticket ID!");
      return;
    }

    try {
      const res = await axios.post("https://parking-backend-amber.vercel.app/unpark", {
        ticketId: ticketIdInput,
      });

      if (res.data.message) {
        setParkedVehicles((prevVehicles) => {
          const updatedVehicles = { ...prevVehicles };
          for (let type in updatedVehicles) {
            updatedVehicles[type] = updatedVehicles[type].filter(
              (vehicle) => vehicle.ticketId !== ticketIdInput
            );
          }
          return updatedVehicles;
        });

        showModal(
          <div className="ticket-card">
            <p>{res.data.message}</p>
            <p><strong>Unparked Ticket ID: {ticketIdInput}</strong></p>
          </div>
        );
      }
    } catch (error) {
      showModal("Invalid Ticket ID or Server Error!");
      console.error(error);
    }

    setTicketIdInput("");
  };

  const showModal = (message) => {
    setModalContent(message);
    setIsModalOpen(true);
    setTimeout(() => setIsModalOpen(false), 3000);
  };

  return (
    <div className="parking-card-container">
      <h2>Parking Management System</h2>

      <div className="input-group">
        <label>Vehicle Type: </label>
        <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
          <option value="">Select Vehicle Type</option>
          <option value="car">Car</option>
          <option value="motorcycle">Motorcycle</option>
          <option value="bicycle">Bicycle</option>
        </select>
      </div>

      <button className="park-btn" onClick={handleParkVehicle}>
        Park Vehicle
      </button>

      <h3>Parking Slots</h3>

      <div className="slots-section">
        {Object.keys(slots).map((type) => (
          <div key={type}>
            <h4>{type.charAt(0).toUpperCase() + type.slice(1)} Slots ({slots[type]} total)</h4>
            <div className="slots-grid">
              {[...Array(slots[type])].map((_, index) => {
                const parkedVehicle = parkedVehicles[type][index];
                return (
                  <div
                    key={index}
                    className={`slot ${type}-slot ${parkedVehicle ? "booked" : "available"}`}
                  >
                    {parkedVehicle ? (
                      <>
                        <p>Vehicle: {parkedVehicle.vehicleType}</p>
                        <p>Ticket ID: {parkedVehicle.ticketId}</p>
                      </>
                    ) : (
                      <p>Slot {index + 1}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="unpark-section">
        <label>Ticket ID: </label>
        <input
          type="text"
          value={ticketIdInput}
          onChange={(e) => setTicketIdInput(e.target.value)}
          placeholder="Enter Ticket ID"
        />
        <button className="unpark-btn" onClick={handleUnparkVehicle}>
          Unpark Vehicle
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            {modalContent}
          </div>
        </div>
      )}
    </div>
  );
};

export default ParkingCard;
