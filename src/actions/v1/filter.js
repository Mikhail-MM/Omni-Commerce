export function filterStoreResults(tagName) {
	return {
		type: 'RECEIVE_FILTER_INPUT',
		tag: tagName
	}
}