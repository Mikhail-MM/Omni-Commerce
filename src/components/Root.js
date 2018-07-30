import React, { Component } from 'react'
import { compose, createStore, applyMiddleware} from 'redux'
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import { Route, Switch, Redirect } from 'react-router-dom'
import { ConnectedRouter, routerMiddleware, push } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import rootReducer from '../reducers/reducers'



import LoginForm from './v1/LoginForm'
import RegisterForm from './v1/RegisterForm'
import OnlineMerchantRegistrationForm from './v1/OnlineMerchantRegistrationForm'
import Terminal from './v1/Terminal'
import OnlineMerchantDashboard from './v1/OnlineMerchantDashboard'
import AdminTerminal from './v1/AdminTerminal'
import MyStoreHomepage from './v1/MyStoreHomepage'
import TerminalActionScreenMockup from './v1/TerminalActionScreenMockup'
import PurchaseOrderViewScreen from './v1/PurchaseOrderViewScreen'
import ShippingOrderViewScreen from './v1/ShippingOrderViewScreen'
import Splash from './v1/Splash'

import CardMockup from './v1/CardMockup'


import EssosMarket from './EssosMarket'
import OmniSplash from './OmniSplash'

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
                 		<Route exact path="/essos" component={EssosMarket} />

					</Switch>
				</ConnectedRouter>
			</Provider>
		)
	}
}


