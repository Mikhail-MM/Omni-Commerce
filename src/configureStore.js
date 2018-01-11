// This is now unused

import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import rootReducer from './reducers/reducers'
import createHistory from 'history/createBrowserHistory'


const history = createHistory();

const loggerMiddleware = createLogger()

export default function configureStore(preloadedState) {
	return createStore(
		rootReducer, 
		compose(
			window.devToolsExtension ? window.devToolsExtension() : f => f
		),
		applyMiddleware(
			thunkMiddleware,
			loggerMiddleware,
			routerMiddleware(history)
		)
		)
}

export { history }