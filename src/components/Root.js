import React, { Component } from 'react'
import { createStore, applyMiddleware} from 'redux'
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import { Route, Switch } from 'react-router-dom'
import { ConnectedRouter, routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import rootReducer from '../reducers/reducers'

import EssosMarket from './EssosMarket'
import OmniSplash from './OmniSplash'
import RegistrationPicker from './forms/RegistrationPicker'

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
						
                  		<Route exact path='/' component={OmniSplash} />
                 		<Route exact path='/essos' component={EssosMarket} />
                 		<Route exact path='/register' component={RegistrationPicker} />

					</Switch>
				</ConnectedRouter>
			</Provider>
		)
	}
}


