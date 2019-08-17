import React, { Component } from 'react'

import applyClass from '../../../utils/classes';

import './Logo.css';

const Logo = ({ topofPage }) => {
  return <div className={`marketing-logo-container${applyClass(!topofPage, "collapseMarketLogo")}`} >
    <img alt="" src={'/assets/TRANSLOGOthin.svg'} />
  </div>
}

export default Logo;