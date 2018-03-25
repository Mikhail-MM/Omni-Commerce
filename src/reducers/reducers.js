
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
		return initialState 
	}
	default: 
		return state
	}
}

const employeeReducer = (state = { loggedInUsers: [ 'Terminal' ] }, action) => {
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
	case('FOCUS_MENU_ITEM'):
		return Object.assign({}, state, {
			itemInFocus: action.menuItem
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

const salesReportReducer = (state = {activeSalesReport: {}}, action) => {
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

const marketplaceBrowserReducer = (state = { allMarketplaces: [], currentMarketplace: {} }, action) => {
	switch(action.type) {
		case('RECEIVE_ALL_MARKETPLACES'):
			return Object.assign({}, state, {
				allMarketplaces: action.allMarketplaces
			})
		case('RECEIVE_CURRENT_MARKETPLACE'):
			return Object.assign({}, state, {
				currentMarketplace: action.currentMarketplace
			})
		default:
			return state
	}
}

// We may have to split marketPlaceItems into two reducers: Receive ALL items and Receive Store Specific Items
// 
const marketplaceItemsReducer = (state = { marketplaceItems: [], currentMarketplaceItem: {} }, action) => {
	switch(action.type) {
		case('RECEIVE_MARKETPLACE_GOODS'):
			return Object.assign({}, state, {
				marketplaceItems: action.items
			})
		case('RECEIVE_CURRENT_ITEM'):
			return Object.assign({}, state, {
				currentMarketplaceItem: action.item
			})
		default: 
			return state
	}
}

const shoppingCartReducer = (state = { shoppingCart: { itemsBought: [] } }, action) => {
	switch(action.type){
		case('RECEIVE_SHOPPING_CART'):
			return Object.assign({}, state, {
				shoppingCart: action.shoppingCart
			})
		case('INVALID_CART_ORDER'):
			return Object.assign({}, state, {
				invalidatedItems: action.invalidatedItems,
				notifyUserOfCartInvalidation: action.notifyUserOfCartInvalidation
			})
		case('DISREGARD_INVALIDATION'):
			return Object.assign({}, state, {
				invalidatedItems: action.invalidatedItems,
				notifyUserOfCartInvalidation: action.notifyUserOfCartInvalidation
			})
		default:
			return state
	}
}

const initialModalState = {
	modalType: null,
	modalProps: {}
}

const modalReducer = (state = initialModalState, action) => {
	switch(action.type){
		case('SHOW_MODAL'):
			return {
				modalType: action.modalType,
				modalProps: action.modalProps
			}
		case('HIDE_MODAL'):
			return initialModalState
		default:
			return state
	}
}

const purchaseOrderReducer = (state = { purchaseOrders: [], salesOrders: [] }, action) => {
	switch(action.type){
		case('RECEIVE_PURCHASE_ORDERS'):
			return {
				purchaseOrders: action.purchaseOrders
			}
		case('RECEIVE_SHIPPING_ORDERS'):
			return {
				shippingOrders: action.shippingOrders
			}
		default:
			return state
	}
}

const initialFilterState = {
			Clothes: false,
			Mens: false,
			Womens: false,
			Tops: false,
			Bottoms: false,
			Accessories: false,
			Shoes: false,
			Art: false,
			Computers: false,
			Electronics: false,
			Appliances: false,
			Cars: false,
			Motorcycles: false,
			Furniture: false,
			selected: []
}
const marketplaceFilterReducer = (state = initialFilterState, action ) => {
	switch(action.type) {
		case('RECEIVE_FILTER_INPUT'):
			let selected;
			
			if (!state.selected.includes(action.tag)) {
				selected = state.selected.concat([action.tag])	
			}
			else if (state.selected.includes(action.tag)) {
				selected = state.selected.filter(tag => tag !== action.tag)
			}
			return {
				...state,
				[action.tag]: !state[action.tag],
				selected
			}
		case('CLEAR_FILTER'):
			return initialFilterState
		default:
			return state
		}
	}

const initialSearchState = { searchTerm: null }

const searchItemsReducer = (state = initialSearchState, action) => {
	switch(action.type) {
		case('INITIATE_SEARCH'):
			return Object.assign({}, state, {
				searchTerm: action.searchTerm
			})
		case('CLEAR_SEARCH_TERMS'):
			return initialSearchState
		default:
			return state
	}
}

const rootReducer = combineReducers({
	authReducer,
	employeeReducer,
	menuItemsReducer,
	ticketTrackingReducer,
	salesReportReducer,
	loadingSpinnerReducer,
	errorNotificationsReducer,
	marketplaceBrowserReducer,
	marketplaceItemsReducer,
	shoppingCartReducer,
	modalReducer,
	purchaseOrderReducer,
	marketplaceFilterReducer,
	searchItemsReducer,
	routerReducer
})

export default rootReducer
