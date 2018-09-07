import React, { Component } from 'react'
import { connect} from 'react-redux'
import './styles/OmniSplash.css'

import { routeToNode } from '../actions/routing'
import { seedOmniDatabase, seedEssosMarketplace, seedEssosJumbotron } from '../actions/seed'

const mapDispatchToProps = (dispatch) => ({
	route: (node) => dispatch(routeToNode(node)),
	seedOmniDatabase: () => dispatch(seedOmniDatabase()),
	seedEssosMarketplace: () => dispatch(seedEssosMarketplace()),
	seedEssosJumbotron: () => dispatch(seedEssosJumbotron())
})

class OmniSplash extends Component {

	render() { 
		return(
			<div className="splash-page-wrapper">
				<div className="centered-box" >
					<button onClick={event => this.props.route('/essos')} className="splash-button"> Essos Marketplace </button>
					<button onClick={event => this.props.route('/register')} className="splash-button"> Register </button>
					<button onClick={event => this.props.route('/essos/login')} className="splash-button"> Essos Login </button>
					<button onClick={event => this.props.route('/omni/login')} className="splash-button"> Omni Login </button>
					<button onClick={event => this.props.route('/omni/terminal')} className="splash-button"> View Terminal </button>
					<button onClick={event => this.props.route('/omni/terminal/tickets')} className="splash-button"> View Terminal Action Screen </button>
					<button onClick={event => this.props.route('/essos/user/:id')} className="splash-button"> User Page </button>
					<button onClick={event => this.props.route('/admin')} className="splash-button"> Admin Page </button>
					<button onClick={event => this.props.seedOmniDatabase()}> Seed Omni Database </button>
					<button onClick={event => this.props.seedEssosMarketplace()}> Seed Essos Database </button>
					<button onClick={event => this.props.seedEssosJumbotron()}> Seed EssosJumbotron Database </button>
				</div>
			</div>
		)
	}
}

export default connect(null, mapDispatchToProps)(OmniSplash)

