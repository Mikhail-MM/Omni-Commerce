export function initiateSearch(term) {
	return {
		type: 'INITIATE_SEARCH',
		searchTerm: term
	}
}

export function clearSearch() {
	return {
		type: 'CLEAR_SEARCH_TERMS'
	}
}