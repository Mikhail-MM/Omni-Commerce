import React, { Component } from 'react'

class Algo extends Component {
	constructor(props){
		super(props)
		this.state = {

		}
	}
	
	generate7KeyPasswordResetConfirmationCode() {

    const arrayOfSeven = [1, 2, 3, 4, 5, 6, 7]

    const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']

    const letterOrNumber = arrayOfSeven.map(currentPos => {
        // return pseudorandom number between 0-100
        const oneToOneHundred = Math.floor(Math.random() * Math.floor(101))
            if (oneToOneHundred < 50) { return "char" }
            else if (oneToOneHundred >= 50) { return "num" }        
    })

    const resetKey = letterOrNumber.map(numOrChar => {
        // return pseudorandom number between 0-51 and return a-z-A-Z
        if (numOrChar === "char") {
            const index = Math.floor(Math.random() * Math.floor(52))                
              return alphabet[index]
        }
        // return pseudorandom number 0-9
        if(numOrChar === "num") { 
            return Math.floor(Math.random() * Math.floor(10)) 
        }
    })

        return resetKey
	}
	
	render() {
		return (
			<div>{this.generate7KeyPasswordResetConfirmationCode()}</div>
		)
	}
}

export default Algo