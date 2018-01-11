import React from 'react'

export default function AutoCompleteSuggestionsBox(props) {
	return (
		<ul>
		{props.employers.map(e => <li>{e}</li>)}
		</ul>
	)
} 
