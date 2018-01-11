import React, { Component } from 'react'
import { connect } from 'react-redux'

class TouchPad extends Component {
	constructor(props) {
		super(props)
		this.state = {
			// no local state, yet
			// Store Redux State to hydrate table
		}
	// bindings
	}

	render() {
		return(
		<div className="TouchPad-Component-Wrapper">
		 
		 <nav>
		 {"We are going to paginate here. Could use links, nested routes."}
		 </nav>
		 
		 <div className="Menu-Items-TouchPad-Container">
		  <div className="Menu-Item-NEEDS-KEY">
		   <div className="Menu-Item-Image">
		    Image Goes here
		   </div>
		  Burger
		  </div>
		  <div className="Menu-Item-Button-NEEDS-KEY">
		   <div className="Menu-Item-Image">
		    Image Goes here
		   </div>
		  Pizza
		  </div>
		 </div>

		 
		 <footer className="Pagination-Navigation-Container">
		  <nav> 
		   {"Pagination Circles Here"}
		  </nav>
		 
		 </footer>
		</div>
		)
	}
}

export default connect()(TouchPad)