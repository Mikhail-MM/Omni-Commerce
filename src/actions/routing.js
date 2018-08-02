import { push } from 'react-router-redux'

export function routeUserAfterLogin(accountType) {
	return dispatch => { 
		if ( accountType === "Child" || accountType === "Terminal" ) {
			dispatch(push('/omni/terminal'))
		}
		else if ( accountType === "Master" ) { 
			dispatch(push('/admin'))
		}
		else if ( accountType === "Essos") { 
			dispatch(push('/essos'))
		}
	}
}

export function routeToNode(event, node) {
	dispatch(push(node))
}