import React, { Component } from 'react'
import { compose, createStore, applyMiddleware} from 'redux'
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import { Route, Switch, Redirect } from 'react-router-dom'
import { ConnectedRouter, routerMiddleware, push } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import rootReducer from '../reducers/reducers'


import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import Terminal from './Terminal'
import TicketActionScreen from './TicketActionScreen'

const loggerMiddleware = createLogger()
const history = createHistory()


const store = createStore(
	rootReducer,

	applyMiddleware(
		thunkMiddleware,
		loggerMiddleware,
		routerMiddleware(history)
	)

)

export default class Root extends Component {
	render() {
		return (
		<Provider store={store}>
			<ConnectedRouter history={history}>
				<Switch>
						<Redirect exact="true" from="/" to="/login"/>
						<Route path="/splash" render={() => <div> Marketing Splash </div> } />
						<Route exact path="/login" component={LoginForm} />
						<Route path="/terminal" component={Terminal} />
						<Route exact path="/ticket" component={TicketActionScreen} />
						<Route path="/login/register" component={RegisterForm}/>

				</Switch>
			</ConnectedRouter>
		</Provider>
		)
	}
}


