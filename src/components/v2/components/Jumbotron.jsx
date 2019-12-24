import React, { Component } from 'react'
import applyClass from '../../../utils/classes';

import './Jumbotron.css'

const Jumbotron = ({ showModal, route }) => {
  const showModulePicker = () => showModal('REGISTRATION_MODULE_PICKER', {})
  const routeToMarketplace = () => route('/essos')
  return <div className='jumbo-image-container'>

    <img alt="" src='/assets/omni-splash/jumbotron.jpg' />

    <div className='hero-header-1' >
      <span> Running a Business is a </span> 
      <span 
        style={{color: '#FF4734'}}> 
          Challenge 
      </span>
    </div>

    <div className='hero-header-2' >
      <span> We're Here to Help </span >
    </div>

    <div className='hero-header-3' >
      
      <button 
        className='getting-started-button ripple-btn ripple'
        onClick={showModulePicker}
      >
        Get Started
      </button>

      <button className='ripple-btn alt-ripple' onClick={routeToMarketplace}>
        View Marketplace
      </button>

    </div>
  </div>
}

export default Jumbotron;