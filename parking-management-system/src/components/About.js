import React from 'react';
import './About.css';
import teamImage from './team.jpg'; // Example image import

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <h1 className="about-title">About Us</h1>
      <p className="about-description">
        We are dedicated to providing top-notch parking management solutions that
        simplify the parking experience. Our team is committed to innovation and
        customer satisfaction.
      </p>

      <div className="about-cards">
        <div className="about-card">
          <img src={teamImage} alt="Our Team" className="card-image" />
          <div className="card-content">
            <h3>Our Team</h3>
            <p>
              A group of talented professionals working together to bring you the best
              parking management solutions.
            </p>
          </div>
        </div>

        <div className="about-card">
          <img src="r.jpg" alt="Our Mission" className="card-image" />
          <div className="card-content">
            <h3>Our Mission</h3>
            <p>
              To innovate and provide reliable parking management systems that cater to
              the needs of users worldwide.
            </p>
          </div>
        </div>

        <div className="about-card">
          <img src="t.jpeg" alt="Our Vision" className="card-image" />
          <div className="card-content">
            <h3>Our Vision</h3>
            <p>
              A world where parking is effortless and fully automated, ensuring a seamless experience for everyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
