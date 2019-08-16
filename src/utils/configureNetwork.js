export const resolveRootURI = () => {
	switch(true) {
		case(process.env.NODE_ENV === "development"):
			return "http://localhost:3001";
		case(process.env.NODE_ENV === "production"):
		default:
			return "https://still-beach-13809.herokuapp.com"
	}
}

export const configureCORS = () => {
	switch(true) {
		case(process.env.NODE_ENV === "development"):
			// Communicate between Local Frontend Port (3000 - React App)
			// 	&& API Instance (Port 3001 - Pos-Api.js)
			return "cors";
		case(process.env.NODE_ENV === "production"):
		default:
			// Production Build serves HTTP + JS Bundle and serves API reqests on same port.
			return "no-cors"
	}
}