
import React, { Component } from 'react';
import { connect } from 'react-redux'

import { authSuccess } from '../../actions/auth';
import { validateCachedToken } from "../../utils/configureAuth";

const mapStateToProps = state => {
	const { token, isAuthenticated, instanceType } = state.authReducer

	return { token, isAuthenticated, instanceType }
}

const mapDispatchToProps = dispatch => ({
    validateCachedAuth: (userInfo) => dispatch(authSuccess(userInfo))
})

class GlobalAuthProvider extends Component {
    async componentDidMount() {
        const cachedAuth = await validateCachedToken();
		if (cachedAuth.token) {
			this.props.validateCachedAuth({
				token: cachedAuth.token,
				accountType: cachedAuth.accountType
			})
			this.setState({loadingAuth: false});
		}
    }

    render() {
        return this.props.children
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(GlobalAuthProvider)