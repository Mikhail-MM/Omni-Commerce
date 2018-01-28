export function startLoading() {
	return { type: 'DISPATCH_LOADING_SPINNER' }
}

export function stopLoading() {
	return { type: 'FINISH_LOADING' }
}

// can this remain global or will a single load operation pop multiple loading spinners across ALL items? We may need to move this function into each reducer to only have a spinner on pertinent data