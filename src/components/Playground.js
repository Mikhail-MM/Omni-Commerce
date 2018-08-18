import React, { Component } from 'react'

import './styles/playground.css'

class Playground extends Component {
	state = {
		active: false
	}

	render() {
		return(
			<div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}} >
				<div className={(this.state.active) ? 'jumanji active' : 'jumanji'} style={{ width: '400px', height: '25px',}} onClick={() => this.setState({active: !this.state.active})}>
					<input className={(!this.state.active) ? 'underlineMe' : 'underlineMe active'} type='text' style={{width: '100%', height: '100%'}} />
				</div>
			</div>
		)
	}
}

export default Playground