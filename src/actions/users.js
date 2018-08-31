export function updateEssosProfileData(token, userID, data, imageHandler) {
	return dispatch => {
		return fetch(`http://localhost:3001/clients/${userID}`, {
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token,
				'x-user-pathway': 'Essos',
			},
			method: 'PUT',
			mode: 'cors',
			body: JSON.stringify(data)
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => {
			if (imageHandler.newImageFlag) {
				return fetch(`http://localhost:3001/sign-s3?fileName=${imageHandler.imageSource.name}&fileType=${imageHandler.imageSource.type}`, {
					method: 'GET',
					mode: 'cors',
				})
				.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
				.then(signedRequestJSON => {
					const { signedRequest, fileOnBucketurl } = signedRequestJSON
					return fetch(signedRequest, {
						headers: {
							'Origin': 'http://localhost:3000',
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
						return fetch(`http://localhost:3001/clients/${userID}`, {
							headers: {
								'Content-Type': 'application/json',
								'x-access-token': token,
								'x-user-pathway': 'Essos',
							},
							method: 'PUT',
							mode: 'cors',
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