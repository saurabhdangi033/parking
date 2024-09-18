import React from 'react';
import './Home.css';
import './Footer.css'; // Import the Footer CSS here
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Carousel CSS

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1>Welcome to Our Parking Management System</h1>
        <p>Efficient and hassle-free parking solutions at your fingertips.</p>
      </section>

      {/* Carousel Section */}
      <section className="carousel-section">
        <Carousel
          autoPlay
          infiniteLoop
          interval={3000}
          showThumbs={false}
          showStatus={false}
          showArrows={false} // Remove the slide arrows
          className="custom-carousel"
        >
          <div>
            <img src="6.jpg" alt="Parking Facility 1" />
          </div>
          <div>
            <img src="55.jpg" alt="Parking Facility 2" />
          </div>
          <div>
            <img src="6.jpg" alt="Parking Facility 3" />
          </div>
        </Carousel>
      </section>

      {/* Rate Card Section */}
      <section className="rate-card-section">
        <h2>Parking Rate Card</h2>
        <div className="rate-card">
          <div className="rate-item">
            <h3>Car</h3>
            <p>$5 per hour</p>
          </div>
          <div className="rate-item">
            <h3>Motorcycle</h3>
            <p>$2 per hour</p>
          </div>
          <div className="rate-item">
            <h3>Bicycle</h3>
            <p>$1 per hour</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us-section">
        <h2>Why Choose Us</h2>
        <div className="reasons">
          <div className="reason-item">
            <h3>Safe & Secure</h3>
            <p>Your vehicle is safe with 24/7 surveillance and security personnel.</p>
          </div>
          <div className="reason-item">
            <h3>Convenient Locations</h3>
            <p>Find our parking spots in convenient locations across the city.</p>
          </div>
          <div className="reason-item">
            <h3>Easy Payment</h3>
            <p>Pay via card or app for a hassle-free experience.</p>
          </div>
        </div>
      </section>

      {/* Footer */}

    </div>
  );
};

export default Home;
