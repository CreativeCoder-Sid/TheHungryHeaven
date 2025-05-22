import React from 'react'
import './Footer.css'
const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">

        <div className="footer-content-1">
          <img src="/logo.jpg" alt="" />
          <br />
         
          <p>India Restaurant is known for creating unforgettable food experiences. We believe that food is therapy and try to put up a smile on your face with our culinary skills.</p>
          <div className="footer-social-icons">
          <i className="ri-instagram-fill"></i>
          <i className="ri-facebook-box-fill"></i>
          <i className="ri-twitter-fill"></i>
          </div>

        </div>
        <div >
          <h3>Our Addresses</h3>
          <br />
          <p>34, Kari Marx Sarani,Kidderpore, <br/> Kolkata</p>
          <p></p>
          <p>9, Kazi Nazrul Islam Avenue <br/>Kaikhili Crossing,<br/>Kolkata700052</p>
          
        </div>
        <div className="footer-content-3">
          <h3>Business Hours</h3>
          <br />
          <ul>
            <li>Mon: 11:00 AM - 11:00 PM</li>
            <li>Tue: 11:00 AM - 11:00 PM</li>
            <li>Wed: 11:00 AM - 11:00 PM</li>
            <li>Thu: 11:00 AM - 11:00 PM</li>
            <li>Fri: 11:00 AM - 11:00 PM</li>
            <li>Sat: 11:00 AM - 11:00 PM</li>
            <li>Sun: 11:00 AM - 11:00 PM</li>
          </ul>
        </div>
        <div className="footer-content-4">
          <h3>Contact Details</h3>
          <br />
          <ul>
            <li><i className="ri-phone-fill"></i>+91 8484848484</li>
            <li><i className="ri-phone-fill"></i>+91 8484848484</li>
            <li><i className="ri-phone-fill"></i>+91 8484848484</li>
            <li><i className="ri-phone-fill"></i>+91 8484848484</li>
          </ul>
        </div>


      </div>

      <hr />
      <p className="footer-copyright">© 2024 The Hungry Heaven. | All Rights Reserved.</p>

    </div>
  )
}

export default Footer