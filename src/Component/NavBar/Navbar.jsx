import React, { useState, useEffect } from 'react';
import { BiGlobe } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isResponsive, setIsResponsive] = useState(false);

  useEffect(() => {
    window.onscroll = function () {
      scrollFunction();
    };
  }, []);

  const scrollFunction = () => {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
      document.getElementById("myTopnav").style.width = "100%";
      document.getElementById("myTopnav").style.opacity = "0.9";
      document.getElementById("myTopnav").style.backgroundColor = "#fff";
      document.getElementById("header").style.position = "fixed";
      document.getElementById("header").style.opacity = "0.9";
      document.getElementById("header").style.top = "0%";
    } else {
      document.getElementById("myTopnav").style.width = "80%";
      document.getElementById("myTopnav").style.backgroundColor = "#fff";
      document.getElementById("header").style.position = "fixed";
      document.getElementById("header").style.top = "1rem";
    }
  };

  const toggleResponsive = () => {
    setIsResponsive(!isResponsive);
    const x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  };

  return (
    <header className="navbar">
      <header id="header">
        <div className={`topnav ${isResponsive ? 'responsive' : ''}`} id="myTopnav">
          <a id="active" style={{ color:'#061221', textTransform: 'uppercase' }}>
            <BiGlobe style={{ fontSize: '20px', alignContent: 'center', paddingRight: '2px' }} /> Navisphere
          </a>
          <div className="dropdown">
            <button className="dropbtn"> Services
              <i className="fa fa-caret-down"></i>
            </button>
           
          </div>
         
          <a href="#about">About</a>
          <a href="#about"><i className="fa fa-search"></i></a>
          <a href="#about" onClick={toggleResponsive} className="icon">&#9776;</a>
        </div>
      </header>
    </header>
  );
}

export default Navbar;
