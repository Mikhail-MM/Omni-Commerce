import React, { Component } from 'react'

import Logo from './Logo';

import applyClass from '../../../utils/classes';

import './NavBar.css'

const NavBar = ({ topOfPage, manageSticky, route, showModal}) => {
  const routeToMarketplace = () => route('/essos');
  const showRegistrationModal = () => showModal('AUTH_FORM_MODAL', {login: true, loginOmni: true})
  const showModulePicker = () => showModal('REGISTRATION_MODULE_PICKER', {})
  return (
  <div>
    <nav 
      className={`marketing-nav${applyClass(!topOfPage, "collapseNavHeader")}${applyClass(manageSticky, "moveNavHeaderAway")}`}
    >
      <Logo 
        topOfPage={topOfPage}/>
      <div className='right-nav'>
        <a className='splash-link' onClick={routeToMarketplace}> Online Marketplace </a>
        <a className='splash-link' onClick={showModulePicker}> Register </a>
        <a className='splash-link' onClick={showRegistrationModal}> Log In </a> 
      </div>
    </nav>
  </div>
  )
}

export default NavBar