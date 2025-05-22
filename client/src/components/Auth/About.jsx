import "./About.css"

import React from 'react'

const About = () => {
  return (
    <div className="about-page">
        <div className="about-content">
            <div className="about-content-left">
                <h1><u>ABOUT US</u></h1>
                <p>Welcome To THE HUNGRY HEAVEN....</p>
                <p> Here exceptional dining meets a warm, inviting atmosphere. Our passion for quality ingredients and creative cuisine drives us to deliver a memorable experience with every visit. Whether you're here for a casual meal or a special occasion, our dedicated team is committed to providing outstanding service and delicious dishes that will delight your senses. Join us and discover why THE HUNGRY HEAVEN is a local favorite.</p>
            </div>
            <div className="about-content-right">
                <img src="/about-pic.jpg" alt="" />

            </div>
        </div>
        

    </div>
  )
}

export default About