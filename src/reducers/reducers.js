import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'

const stateMap = {
	authReducer: {

	}
}
const authReducer = (state = stateMap.authReducer, action) => {
	switch(action.type){
	case ('USER_AUTHENTICATED'): { 
		console.log(action.userInfo);
		console.log(action.userInfo.token);
		return Object.assign({}, state, {
			isAuthenticated: true,
			instanceType: action.userInfo.accountType,
			token: action.userInfo.token,
			hasError: false
			}
		)
	}
	case ('INVALID_CREDENTIALS'): { 
		return Object.assign({}, state, {
			isAuthenticated:false,
			hasError: true,
			errorText: action.errorText,
			}
		) 
	}
	case ('LOG_OUT'): { 
		return stateMap.authReducer 
	}
	default: 
		return state
	}
}

const rootReducer = combineReducers({
	authReducer,
	routerReducer
})

export default rootReducer
