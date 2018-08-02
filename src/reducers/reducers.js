import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'

const stateMap = {
	authReducer: {
		isAuthenticated: false,
	},
	terminalItemsReducer: {
		isInvalidated: false,
		isFetching: false,
	},
	ticketTrackingReducer: {
		isInvalidated: false,
		isFetching: false,		
	},
	employeeReducer: { 
		loggedInUsers: [ 'Terminal' ] 
	},
	modalReducer: {
		modalType: null,
		modalProps: {}
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

const modalReducer = (state = stateMap.modalReducer, action) => {
	switch(action.type){
		case('SHOW_MODAL'):
			return {
				modalType: action.modalType,
				modalProps: action.modalProps
			}
		case('HIDE_MODAL'):
			return stateMap.modalReducer
		default:
			return state
	}
}


const terminalItemsReducer = (state = stateMap.terminalItemsReducer, action) => {
	switch (action.type){
	case('RECEIVE_MENU_ITEMS'):
		return Object.assign({}, state, {
			isInvalidated: false,
			isFetching: false,
			menuItems: action.categorizedMenuItems
		})
	case('SET_VISIBLE_CATEGORY'):
		return Object.assign({}, state, {
			visibleCategory: action.visibleCategory
		})
	case('FOCUS_MENU_ITEM'):
		return Object.assign({}, state, {
			itemInFocus: action.menuItem
		})
	default:
		return state
	}	
}

const ticketTrackingReducer = (state = state.ticketTrackingReducer, action) => {
	switch(action.type){
	case('RECEIVE_TICKETS'):
		return Object.assign({}, state, {
			isInvalidated: false,
			isFetching: false,
			tickets: action.categorizedTicketsByStatus
		})
	case('RECEIVE_CURRENT_TICKET'):
		return Object.assign({}, state, {
			activeTicket: action.ticket
		})
	default:
		return state
	}
}


const employeeReducer = (state = stateMap.employeeReducer, action) => {
	switch(action.type){
	case ('RECEIVE_LOGGED_USERS'): {
		return Object.assign({}, state, {
			loggedInUsers: action.loggedUsers.loggedInUsers
			}
		)
	}
	case ('RECEIVE_ALL_EMPLOYEES'): {
		return Object.assign({}, state, {
			employees: action.employees
		})
	}
	default:
		return state
	}
}




const rootReducer = combineReducers({
	authReducer,
	modalReducer,
	terminalItemsReducer,
	ticketTrackingReducer,
	employeeReducer,
	routerReducer
})

export default rootReducer
