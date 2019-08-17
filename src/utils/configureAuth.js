import { hostURI } from '../components/config';

export const validateCachedToken = async () => {
    const token = window.localStorage.getItem("x-auth-token");
    const accountType = window.localStorage.getItem("x-account-type");
    try {
        const url = `${hostURI}/authorize/cached`
        const response = await fetch(url, {
            headers:{
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            method: 'GET',
        })
        if (response.ok) {
            console.log("What")
            const validResponse = await response.json();
            const { validToken } = validResponse;
            if (validToken) {
                return {
                    token,
                    accountType
                }
            }
        } else {
            return false
        }
    } catch(err) {
        console.error(err)
        return false;
    }
}