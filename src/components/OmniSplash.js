import React, { Component } from 'react'
import { connect} from 'react-redux'
import './styles/OmniSplash.css'

import { routeToNode } from '../actions/routing'
import { seedOmniDatabase } from '../actions/seed'

const mapDispatchToProps = (dispatch) => ({
	route: (event, node) => dispatch(routeToNode(event, node)),
	seedOmniDatabase: () => dispatch(seedOmniDatabase())
})

class OmniSplash extends Component {

	render() { 
		return(
			<div className="splash-page-wrapper">
				<div className="centered-box" >
					<button onClick={event => this.props.route(event, '/essos')} className="splash-button"> Essos Marketplace </button>
					<button onClick={event => this.props.route(event, '/register')} className="splash-button"> Register </button>
					<button onClick={event => this.props.route(event, '/essos/login')} className="splash-button"> Essos Login </button>
					<button onClick={event => this.props.route(event, '/omni/login')} className="splash-button"> Omni Login </button>
					<button onClick={event => this.props.route(event, '/omni/terminal')} className="splash-button"> View Terminal </button>
					<button onClick={event => this.props.route(event, '/omni/terminal/tickets')} className="splash-button"> View Terminal Action Screen </button>
					<button onClick={event => this.props.route(event, '/essos/product')} className="splash-button"> Product Page </button>
					<button onClick={event => this.props.route(event, '/essos/user/:id')} className="splash-button"> User Page </button>
					<button onClick={event => this.props.route(event, '/admin')} className="splash-button"> Admin Page </button>
					<button onClick={event => this.props.seedOmniDatabase()}> Seed Database </button>
				</div>
			</div>
		)
	}
}

export default connect(null, mapDispatchToProps)(OmniSplash)

