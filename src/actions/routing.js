import { push } from 'react-router-redux'

export function routeToNode(dispatch, event, node) {
	dispatch(push(node))
}