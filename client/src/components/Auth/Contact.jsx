import './Contact.css'
import React from 'react';

function Contact() {
  return (
    <div id="contact" data-aos="fade">
      <img id="con-img" src="/img7.jpg" alt="Contact Banner" />

      <div id="con-note" data-aos="zoom-in">
        <h1 id="contact-us">Contact Us</h1>
      </div>

      <div id="cng-note" data-aos="fade-up">
        <h5 id="note">
          Home <i className="ri-arrow-right-s-line"></i> Contact Us
        </h5>
      </div>

      <div className="parent">
        <div className="text">
          <p><br /><br />Feel free to reach us.</p>
          <p>
            We are all ears for your f'eat'back and queries.
            Contact us now, and <br />we will get back to you.
          </p>

          <h5>Our Addresses</h5>
          <p>34, Karl Marx Sarani, Kidderpore,<br /> Kolkata</p>
          <p>
            9, Kazi Nazrul Islam Avenue<br />Kaikhali Crossing,
            <br />Kolkata- 700052
          </p>

          <h5>Follow Us</h5>
          <div className="social-buttons">
            <button className="butt" aria-label="Facebook">
              <i className="ri-facebook-box-fill"></i>
            </button>
            <button className="butt" aria-label="Twitter">
              <i className="ri-twitter-fill"></i>
            </button>
            <button className="butt" aria-label="Instagram">
              <i className="ri-instagram-fill"></i>
            </button>
          </div>

          <div className="email-call">
            <h5>Email Id:</h5>
            <p>info@hungryheaven.in</p>
            <h5><br />Call Us Now</h5>
            <p>
              +91 9476438623 <br />
              +91 9883490865 <br />
              +033 4804 9142 <br />
              +91 99039 80011
            </p>
          </div>
        </div>

        <div className="opening-time">
          <img id="con-img2" src="/1img.png" alt="Opening Time" />
        </div>
      </div>

      
      
    </div>
  );
}

export default Contact;
