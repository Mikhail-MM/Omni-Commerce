import React, { Component } from 'react'
import  '../styles/OmniTerminal.css'

class OmniTerminal extends Component {

	render() {
		return(
			<div className='page-wrapper'>
				<div className='omni-terminal__centered-rectangle' >
					<div className='row-1-big'>
						<div className='mainframe-container'>
							<div className='graph' >
							</div>
							<div className='row__statistics'>
							</div>

						</div> 
						<div className='foursquare-container'>
							<div className='row__buttons'>
								<div className='button'>
									Clock In
								</div>
								<div className='button' >
									Clock Out
								</div>
							</div>
							<div className='row__buttons'>
								<div className='button'>
									Add New Item
								</div>
								<div className='button' >
									Modify Items
								</div>
							</div>
						</div>
					</div>
					<div className='row-2'>
						<div className='button__lower' >
							New Transaction
						</div>
						<div className='button__lower'>
							View Transactions
						</div>
						<div className='button__lower'>
							Generate Sales Report
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default OmniTerminal