import React, { Component } from 'react'
import './styles/EssosMarket.css';

class EssosMarket extends Component {
	render() {
		return(
			<div className='app-root'>  
	          <header className='app-header'>
	              <div className='logo-container'>
	              </div>
	              <nav className='main-nav'>
	              </nav>
	              <div className='account-control'>
	              </div>
	          </header>
	          
	          <container className='jumbotron'>
	            <img className='jumbotron-greeter' src='./assets/store-splash/greeting4.jpg' />
	            <button className='greeter-button' >
	                Shop Now
	            </button>
	          </container>
	         
	          <section className='featured-items'>
	            <div className='featured-items__header-container' >
	            <h1> Featured Products </h1>
	            </div>
	            <div className='featured-items__slider-container' >
	               <img className='featured-mockup' src='./assets/store-splash/featured-1.jpg'/> 
	               <img className='featured-mockup' src='./assets/store-splash/featured-2-2.jpg'/> 
	               <img className='featured-mockup' src='./assets/store-splash/featured-3.jpg'/> 
	               <img className='featured-mockup' src='./assets/store-splash/featured-4.jpg'/> 
	            </div>
	          </section>

	          <div className='storybook-container' >
	            <img className='feature-set-mockup' src='./assets/store-splash/dutone-3.jpg' />
	            <img className='feature-set-mockup' src='./assets/store-splash/dutone-2.jpg' />
	            <img className='feature-set-mockup' src='./assets/store-splash/dutone-1.jpg' />
	          </div>

	          <div className='search-bar-container'>
	          </div>
	      </div>
		)
	}
}

export default EssosMarket