import { push } from 'react-router-redux'

export function routeUserToModule(accountInfo) {
	console.log(accountInfo)
	const { accountType } = accountInfo

	return dispatch => { 
		if ( accountType === "Employee" || accountType === "Terminal" ) {
			console.log("pushing to terminal") 
			dispatch(push('/terminal'))
		}
		else if ( accountType === "Master" ) { 
			console.log("Pushing to dashboard")
			dispatch(push('/admin'))
		}
		else if ( accountType === "OnlineMerchant") { 
			console.log("pushing to marketplace landing")
			dispatch(push('/marketplace_landing'))
		}
	}
}
