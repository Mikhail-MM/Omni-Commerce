export function updateProfileData(token, userID, data, imageHandler, mode) {
	return dispatch => {
		return fetch(`/clients/${userID}`, {
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token,
				'x-user-pathway': mode,
			},
			method: 'PUT',
			body: JSON.stringify(data)
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => {
			if (imageHandler.newImageFlag) {
				return fetch(`/sign-s3?fileName=${imageHandler.imageSource.name}&fileType=${imageHandler.imageSource.type}`, {
					method: 'GET',
				})
				.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
				.then(signedRequestJSON => {
					const { signedRequest, fileOnBucketurl } = signedRequestJSON
					return fetch(signedRequest, {
						headers: {
							'Origin': 'https://still-beach-13809.herokuapp.com/',
						},
						method: 'PUT', 
						body: imageHandler.imageSource,
						mode: 'cors',
					})
					.then(response => {
						if (!response.ok) Promise.reject(response.statusText)
							return fileOnBucketurl
					})
					.then(imageURL => {
						return fetch(`/clients/${userID}`, {
							headers: {
								'Content-Type': 'application/json',
								'x-access-token': token,
								'x-user-pathway': mode,
							},
							method: 'PUT',
							body: JSON.stringify({ avatarURL: imageURL })
						})
						.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
						.then(jsonWithImageURL => {
							console.log('User Data Updated with new Avatar', jsonWithImageURL )
						})
					})
				})
			} else if (!imageHandler.newImageFlag) {
				console.log('User data updated:', json)
			}
		})
		.catch(err => console.log(err))
	}
}