export function showError(errorText) {
	return {
		type:'NOTIFY_CLIENT_ERROR_PRESENT',
		errorText
	}
}

export function clearError() {
	return {
		// typically dispatched when user acknowledges and closes the error modal
		type:'CLEAR_ERROR'
	}
}