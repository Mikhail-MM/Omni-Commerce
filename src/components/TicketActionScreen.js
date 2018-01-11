import React, { Component } from 'react'
import { connect } from 'react-redux'
import TicketLedger from './TicketLedger'
import TouchPad from './TouchPad'

class TicketActionScreen extends Component {
	constructor (props) {
		super(props)
		this.state = {
			// Do we need local state
		}
		//bindings
	}


	render() {
		return (
			<div className="Page-Wrapper">
			 	<header className="Logo-Time-Header">
			 	<p> This could be a component</p>
			 	</header>
				
				<div className="Main-Ticket-Editor-Wrapper">
				  <div className="Ledger-Container-Left-35">
					{/* This is the left sidebar that will contain the main table component */}
				    <TicketLedger />
				  </div>

				  <div className="Touchpad-Container-Right-65">
				    {/* This is the right sidebar (More like side-chunk) that will contain the main menu item selector */}
				  	<TouchPad />
				  </div>
				</div>


				<footer className="Useless Footer"> Useless Footer </footer>
			</div>

		)
	}
}

export default connect()(TicketActionScreen)