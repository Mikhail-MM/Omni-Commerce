import { push } from 'connected-react-router'

export function routeToNode(event, node) {
	console.log(event)
	console.log(node)
	return dispatch => {
		dispatch(push(node))
	}
}