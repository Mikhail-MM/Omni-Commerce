export function throwError(errorMessage) { 
	throw new Error(errorMessage) 
}

export function showGlobalError(errorText) {
	return {
		type:'NOTIFY_CLIENT_ERROR_PRESENT',
		errorText
	}
}

export function clearBlobalError() {
	return {
		// typically dispatched when user acknowledges and closes the error modal
		type:'CLEAR_ERROR'
	}
}