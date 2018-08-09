export function pushItemIntoShoppingCart(token, itemId, amountRequested, amountAlreadyInCart) {
	const url = 'http://localhost:3001/storeItem/' + itemId
	console.log("Action Creator to Push Item into Shopping Cart Triggered - Pinging Item on tap in DB")
	console.log("amountRequested:")
	console.log(amountRequested)
	console.log("amountAlreadyInCart")
	console.log(amountAlreadyInCart)
	return dispatch => {
		fetch(url, {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token,
			},
			method: 'GET',
			mode: 'cors'
		})
		.then(response => response.ok ? response.json() : new Error(response.statusText))
		.then(json => {
				console.log("Evaluating how much of item is in stock on server (json.numberInStock:")
				console.log(json.numberInStock)

			if (amountAlreadyInCart + amountRequested > json.numberInStock) {
				console.log("If statement firing: amount already in cart + amount requested exceeds stock")
				console.log("Reconciling to update cart with amount that can be fulfilled")
				const amountThatCanBeFulfilled = json.numberInStock - amountAlreadyInCart
				console.log("amountThatCanBeFulfilled:")
				console.log(amountThatCanBeFulfilled)
				console.log("Determining overflow which is unfulfillable")
				const unfulfillable = amountRequested - amountThatCanBeFulfilled
				console.log("unfulfillable:")
				console.log(unfulfillable)

				if (amountThatCanBeFulfilled > 0) {
					console.log("nested If within an if statement firing: amountThatCanBeFulfilled is greater than 0")
					console.log("This means that we can push some amount of request to cart")
					return fetch('http://localhost:3001/shoppingCart/addItem', {
					headers:{
						'Content-Type': 'application/json',
						'x-access-token': token,
					},
					method: 'PUT',
					mode: 'cors',
					body: JSON.stringify({
						itemName: json.itemName,
						itemPrice: json.itemPrice,
						imageURL: json.imageURL,
						numberRequested: amountThatCanBeFulfilled,
						sellerRef_id: json.sellerRef_id,
						marketplaceRef_id: json.marketplaceRef_id,
						itemRef_id: json._id,
					}),
				})
				.then(response => response.ok ? response.json() : new Error(response.statusText))
				.then(pushedCart => {
					console.log("Updating client's shopping cart with updated version")
					dispatch(receiveShoppingCart(pushedCart))
				const unfulfillableObject = {/* create a new object by bringing down info from original fetched 'json' of item down to here */}
					console.log("Mutating original returned item from DB - attaching a field 'unfulfillableStock' to that json, to represent a version which can't be added to cart - and returning a notice of that item. best to create a whole new object instead of mutating")
					json.unfulfillableStock = unfulfillable
					dispatch(receiveInvalidatedShoppingCartItems(json))

				})
				.catch(err => console.log(err))
				} else if (amountThatCanBeFulfilled <= 0) {
					console.log("nested else if within an if statement runs only run if AmountThatCanBeFulfilled is <= 0")
					console.log("it would be better if we did not mutate the original returned json")
					console.log("json.unfulFillable Stock being set to amountRequested")
					console.log("amountRequested:")
					console.log(amountRequested)
					json.unfulfillableStock = amountRequested
					console.log("json.unfulfillableStock")
					console.log(json.unfulfillableStock)
					console.log("dispatching invalidated cart receipt")
					dispatch(receiveInvalidatedShoppingCartItems(json))

				}

			} else if ( amountAlreadyInCart + amountRequested <= json.numberInStock ){
				console.log("If statmenet running: Item DB is greater than or equal to amount requested + amount already in cart")
				return fetch('http://localhost:3001/shoppingCart/addItem', {
					headers:{
						'Content-Type': 'application/json',
						'x-access-token': token,
					},
					method: 'PUT',
					mode: 'cors',
					body: JSON.stringify({
						itemName: json.itemName,
						itemPrice: json.itemPrice,
						imageURL: json.imageURL,
						numberRequested: amountRequested,
						sellerRef_id: json.sellerRef_id,
						marketplaceRef_id: json.marketplaceRef_id,
						itemRef_id: json._id,
					}),
				})
				.then(response => response.ok ? response.json() : new Error(response.statusText))
				.then(json => dispatch(receiveShoppingCart(json)))
				.catch(err => console.log(err))
			}
		});

	}
}