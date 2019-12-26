import React, { Component } from 'react'
import { createStore, applyMiddleware} from 'redux'
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import Loadable from 'react-loadable'
import { Route, Switch } from 'react-router-dom'
import { ConnectedRouter, routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import rootReducer from '../reducers/reducers'

import MediaQuery from 'react-responsive'

import TerminalActionScreen from './terminal/TerminalActionScreen'
import TerminalActionMobile from './terminal/responsive/TerminalActionMobile'


import RegistrationPicker from './forms/RegistrationPicker'

import Marketing from './Marketing'

// Load CSS from lazy-loaded Components
import './styles/EssosMarket.css';

import GlobalAuthProvider from './v2/GlobalAuthProvider';
import FullPageLoader from './v2/FullPageLoader'


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

const LoadableComponents = {
	EssosMarket: Loadable({
		loader: () => import('./EssosMarket'),
		loading: () => <FullPageLoader />
	}),
	OmniTerminal: Loadable({
		loader: () => import('./terminal/OmniTerminal'),
		loading: () => <FullPageLoader />,
	}),
	AdminTerminal: Loadable({
		loader: () => import('./terminal/admin/AdminTerminal'),
		loading: () => <FullPageLoader />,
	}),
	UserPage: Loadable({
		loader: () => import('./essos/UserPage'),
		loading: () => <FullPageLoader />,
	}),
	EssosCartCheckout: Loadable({
		loader: () => import('./EssosCartCheckout'),
		loading: () => <FullPageLoader />,
	}),
	AuthenticationForm: Loadable({
		loader: () => import('./forms/registration/AuthenticationForm'),
		loading: () => <FullPageLoader />,
	})

}

export default class Root extends Component {
	render() {
		return (
			<Provider store={store}>
				<GlobalAuthProvider >
					<ConnectedRouter history={history}>
						<Switch>
							
							<Route exact path='/' component={Marketing} />
							<Route exact path='/essos' component={LoadableComponents.EssosMarket} />
							<Route exact path='/essos/login' render={() => <LoadableComponents.AuthenticationForm login loginEssos /> } />
							<Route exact path='/omni/login' render={() => <LoadableComponents.AuthenticationForm login loginOmni /> } />
							<Route exact path='/register' component={RegistrationPicker} />
							<Route exact path='/register/omni' render={() => <LoadableComponents.AuthenticationForm regpathOmniMaster/>} />
							<Route exact path='/register/essos' render={() => <LoadableComponents.AuthenticationForm regpathEssos/>} />

							<Route exact path='/omni/terminal' component={LoadableComponents.OmniTerminal} />
							<Route exact path='/omni/terminal/modifyItems' render={(props) => <TerminalActionScreen {...props} modify /> } /> 
							<Route exact path='/omni/terminal/tickets/:id' component={(props) => {
								return (
									<React.Fragment>
										<MediaQuery minWidth={2} maxWidth={798}>
											<TerminalActionMobile {...props}/>
										</MediaQuery> 
										<MediaQuery minWidth={799}>
											<TerminalActionScreen {...props}/>
										</MediaQuery>
									</React.Fragment>
								)
							}} />
							<Route exact path='/essos/user/:id' component={LoadableComponents.UserPage} />
							<Route exact path='/essos/profile/' render={(props) => <LoadableComponents.UserPage {...props} selfProfileView /> } />
							<Route exact path='/essos/mycart' component={LoadableComponents.EssosCartCheckout} />
							<Route exact path='/admin' component={LoadableComponents.AdminTerminal} />

						</Switch>
					</ConnectedRouter>
				</GlobalAuthProvider >
			</Provider>
		)
	}
}


