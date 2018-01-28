export function startLoading() {
	return { type: 'DISPATCH_LOADING_SPINNER' }
}

export function stopLoading() {
	return { type: 'FINISH_LOADING' }
}