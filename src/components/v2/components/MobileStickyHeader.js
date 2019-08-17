import React, { Component } from 'react';

import applyClass from '../../../utils/classes';

const MobileStickyHeader = ({
  setMobileStickyFeatureBarRef, 
  manageSticky,
  activeFeature,
}) => {
  return <div className={`icon-revealer-container${applyClass(manageSticky, "shrink-sticky")}`} ref={setMobileStickyFeatureBarRef}>
    
    <div className='icon-revealer-row'>
      <div 
        style={(activeFeature === 'ft1') ? {animation: 'hoverme 0.8s infinite ease-out'} : {}} 
        className={`informatic-blurb abs-ico-co1${(manageSticky) ? ' co1-move' : ''}`}
      >
        <div 
          className={`informatic-blurb__icon${(manageSticky) ? ' shrink-icon' : ''}`}>
          <img 
            alt="" 
            src='/assets/omni-splash/icons/payment-method.svg' />
        </div>
        <h4 
          className={`sticky-headers${(manageSticky) ? ' sticky-header-shrink' : ''}`}> 
          Compliant Payments 
        </h4>
        <div className='informatic-blurb__text'>
        </div>
      </div>

      <div 
        style={(activeFeature === 'ft2') ? {animation: 'hoverme 0.8s infinite ease-out'} : {}} 
        className={`informatic-blurb abs-ico-co2${(manageSticky) ? ' co2-move' : ''}`}>
        <div 
          className={`informatic-blurb__icon${(manageSticky) ? ' shrink-icon' : ''}`}>
          <img 
            alt="" 
            src='/assets/omni-splash/icons/online-shop.svg' />
        </div>
        <h4 
          className={`sticky-headers${(manageSticky) ? ' sticky-header-shrink' : ''}`}> 
          Remote Business Management 
        </h4>
        <div className='informatic-blurb__text'>
        </div>
      </div>
      <div 
        style={(activeFeature === 'ft3') ? {animation: 'hoverme 0.8s infinite ease-out'} : {}} 
        className={`informatic-blurb abs-ico-co3${(manageSticky) ? ' co3-move' : ''}`}>
        <div 
          className={`informatic-blurb__icon${(manageSticky) ? ' shrink-icon' : ''}`}>
          <img 
            alt="" 
            src='/assets/omni-splash/icons/stats.svg' />						
        </div>
        <h4 
          className={`sticky-headers${(manageSticky) ? ' sticky-header-shrink' : ''}`}> 
          Metrics and Statistics 
        </h4>
        <div 
          className='informatic-blurb__text'>
        </div>
      </div>
      <div 
        style={(activeFeature === 'ft4') ? {animation: 'hoverme 0.8s infinite ease-out'} : {}} 
        className={`informatic-blurb abs-ico-co4${(manageSticky) ? ' co4-move' : ''}`}>
        <div 
        className={`informatic-blurb__icon${(manageSticky) ? ' shrink-icon' : ''}`}>
          <img 
          alt="" 
          src='/assets/omni-splash/icons/smartphone.svg' />
        </div>
        <h4 
          className={`sticky-headers${(manageSticky) ? ' sticky-header-shrink' : ''}`}> 
          Personal Marketplace </h4>
        <div 
          className='informatic-blurb__text'>
        </div>
      </div>
    </div>
  </div>
}

export default MobileStickyHeader