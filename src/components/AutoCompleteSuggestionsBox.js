import React from 'react'

// We should really move this into our controlled registerform component, so that each item will allow us to do an OnClick to setState of our employee form
export default function AutoCompleteSuggestionsBox(props) {
	return (
		<ul>
		{props.employers.map(e => <li>{e}</li>)}
		</ul>
	)
} 
