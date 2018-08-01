import React, { Component } from 'react'
import { connect} from 'react-redux'
import './styles/OmniSplash.css'

import { routeToNode } from '../actions/routing'

const mapDispatchToProps = (dispatch) => ({
	route: (event, node) => routeToNode(dispatch, event, node)
})

class OmniSplash extends Component {

	render() { 
		return(
			<div className="splash-page-wrapper">
				<div className="centered-box" >
					<button onClick={event => this.props.route(event, '/essos')} className="splash-button"> Essos Marketplace </button>
					<button onClick={event => this.props.route(event, '/register')} className="splash-button"> Register </button>
					<button onClick={event => this.props.route(event, '/login')} className="splash-button"> Log In </button>
					<button onClick={event => this.props.route(event, '/omni/terminal')} className="splash-button"> View Terminal </button>
					<button onClick={event => this.props.route(event, '/omni/terminal/tickets')} className="splash-button"> View Terminal Action Screen </button>
					<button onClick={event => this.props.route(event, '/essos/product')} className="splash-button"> Product Page </button>
					<button onClick={event => this.props.route(event, '/essos/user')} className="splash-button"> User Page </button>
					<button onClick={event => this.props.route(event, '/admin')} className="splash-button"> Admin Page </button>
				</div>
			</div>
		)
	}
}

export default connect(null, mapDispatchToProps)(OmniSplash)

