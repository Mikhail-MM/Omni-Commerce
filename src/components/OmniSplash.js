import React, { Component } from 'react'
import { connect} from 'react-redux'
import './styles/OmniSplash.css'

import { routeToNode } from '../actions/routing'

import { push } from 'react-router-redux'

const mapDispatchToProps = (dispatch) => ({
	route: (event, node) => routeToNode(dispatch, event, node)
})

class OmniSplash extends Component {

	navigateAway = (url) => {
		const {dispatch} = this.props
		dispatch(push(url)) 
	}

	render() { 
		return(
			<div className="splash-page-wrapper">
				<div className="centered-box" >
					<button onClick={event => this.props.route(event, '/essos')} className="splash-button"> Essos Marketplace </button>
					<button onClick={event => this.props.route(event, '/register')} className="splash-button"> Register </button>
					<button onClick={event => this.props.route(event, '/login')} className="splash-button"> Log In </button>
				</div>
			</div>
		)
	}
}

export default connect(null, mapDispatchToProps)(OmniSplash)