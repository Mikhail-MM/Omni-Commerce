
import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'

const initialState = { isAuthenticated: false}

const authReducer = (state = initialState, action) => {
	switch(action.type){
	case ('USER_AUTHENTICATED'): { 
		console.log(action.userInfo);
		console.log(action.userInfo.token);
		return Object.assign({}, state, {
			isAuthenticated: true,
			token: action.userInfo.token,
			// userPermissions: action.userInfo.userPermissions,
			// instanceType: action.userInfo.instanceType
			}
		)
	}
	case ('INVALID_CREDENTIALS'): { 
		return Object.assign({}, state, {
			isAuthenticated:false
			}
		) 
	}

	case ('LOG_OUT'): { 
		return initialState 
	}
	case ('RECEIVE_LOGGED_USERS'): {
		return Object.assign({}, state, {
			loggedInUsers: action.loggedUsers.loggedInUsers
			}
		)
	}
	default:
			return state
	}
}
// We are getting some kind of Undefined array under menuItems in MenuItems reducer
// For some reason we are having MENUS return a StoreConfig Item
const menuItemsReducer = (state = {isInvalidated: false, isFetching: false}, action) => {
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
	default:
		return state
	}	
}

const ticketTrackingReducer = (state = {isInvalidated: false, isFetching: false}, action) => {
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

const salesReportReducer = (state = {}, action) => {
	switch(action.type){
		case('RECEIVE_SALES_REPORT'):
			return Object.assign({}, state, {
				activeSalesReport: action.salesReport
			})
		default: 
			return state
	}
}

const loadingSpinnerReducer = (state = { isLoading: false }, action ) => {
	switch(action.type) {
		case('DISPATCH_LOADING_SPINNER'):
			return Object.assign({}, state, {
				isLoading: true
			})
		case('FINISH_LOADING'):
			return Object.assign({}, {
				isLoading: false
			})
		default:
			return state
	}
}

const errorNotificationsReducer = (state = { hasError: false }, action) => {
	switch(action.type) {
		case('NOTIFY_CLIENT_ERROR_PRESENT'):
			return Object.assign({}, state, {
				hasError: true,
				errorText: action.errorText
			})
		case('CLEAR_ERROR'):
			return Object.assign({}, state, {
				hasError: false,
				errorText: ""
			})
		default: 
			return state
	}
}
const rootReducer = combineReducers({
	authReducer,
	menuItemsReducer,
	ticketTrackingReducer,
	salesReportReducer,
	loadingSpinnerReducer,
	routerReducer
})

export default rootReducer



/*

// Actions

function authSuccess () {
	type:'USER_AUTHENTICATED'
	userInfo

} 

function authFail () {
	type: 'INVALID_CREDENTIALS'

}

function instantiateUser () {
	
} 

function loginUser () {
	// Begin Dispatch Chain as THUNK
}


*/