import React, { Component } from 'react'
import { createStore, applyMiddleware} from 'redux'
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import { Route, Switch } from 'react-router-dom'
import { ConnectedRouter, routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import rootReducer from '../reducers/reducers'

import OmniSplash from './OmniSplash'

import EssosMarket from './EssosMarket'
import UserPage from './essos/UserPage'

import OmniTerminal from './terminal/OmniTerminal'
import TerminalActionScreen from './terminal/TerminalActionScreen'
import AdminTerminal from './terminal/admin/AdminTerminal'



import RegistrationPicker from './forms/RegistrationPicker'
import AuthenticationForm from './forms/registration/AuthenticationForm'


import EssosCartCheckout from './EssosCartCheckout'

import ModalRoot from './ModalRoot'

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
                 		<Route exact path='/essos/login' render={() => <AuthenticationForm login loginEssos /> } />
                 		<Route exact path='/omni/login' render={() => <AuthenticationForm login loginOmni /> } />
                 		<Route exact path='/register' component={RegistrationPicker} />
                 		<Route exact path='/register/omni' render={() => <AuthenticationForm regpathOmniMaster/>} />
                 		<Route exact path='/register/essos' render={() => <AuthenticationForm regpathEssos/>} />

                 		<Route exact path='/omni/terminal' component={OmniTerminal} />
                 		<Route exact path='/omni/terminal/modifyItems' render={(props) => <TerminalActionScreen {...props} modify /> } /> 
                 		<Route exact path='/omni/terminal/tickets' component={TerminalActionScreen} />
                 		<Route exact path='/essos/user/:id' component={UserPage} />
                 		<Route exact path='/essos/profile/' render={(props) => <UserPage {...props} selfProfileView /> } />
                 		<Route exact path='/essos/mycart' component={EssosCartCheckout} />
                 		<Route exact path='/admin' component={AdminTerminal} />

					</Switch>
				</ConnectedRouter>
			</Provider>
		)
	}
}


