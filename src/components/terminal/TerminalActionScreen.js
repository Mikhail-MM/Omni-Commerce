import React, { Component } from 'react'
import '../styles/TerminalActionScreen.css'

class TerminalActionScreen extends Component {
	render() {
		return(
			<div className='action-page-wrapper' >
				<div className='picker-column' >
					<div className='touchpad' >
					</div>
					<div className='category-select-footer' >
					</div>
				</div>
				<div className='ledger'>
					<div className='ledger-header'>
					</div>
					<div className='ledger-body'>
					</div>
					<div className='ledger-footer'>
					</div>
				</div>
			</div>
		)
	}
}

export default TerminalActionScreen