import React, { Component } from 'react'
import { connect } from 'react-redux'

class TicketLedger extends Component {
	constructor(props) {
		super(props)
		this.state = {
			// no local state, yet
			// Store Redux State to hydrate table
		}
	// bindings
	}

	render() {
		return(
		<div className="Table-Ledger-Component-Wrapper">
		<table>
		 <thead>
		  <tr>
		   <th scope="col"> Remove </th>
		   <th scope="col"> Addon </th>
		   <th scope="col"> Item </th>
		   <th scope="col"> Price </th>
		  </tr>
		 </thead>
		 <tbody>
		  <tr>
		   <td><button>Remove</button></td>
		   <td><button>AddOn</button></td>
		   <td>Burgher</td>
		   <td>$5.44</td>
		  </tr>
		  <tr>
		   <td><button>Remove</button></td>
		   <td><button>AddOn</button></td>
		   <td>Pezza</td>
		   <td>$5.55</td>
		  </tr>		 
		 </tbody>
		 <tfoot>
		  <tr>
		   <td colspan="3">SubTotal</td>
		   <td>$12.34 </td>
		  </tr>
		  <tr>
		   <td colspan="3">Tax</td>
		   <td>$1.46</td>
		  </tr>
		  <tr>
		   <td colspan="3">Discount</td>
		   <td>$-2.00</td>
		  </tr>
		  <tr>
		   <td colspan="3">Total</td>
		   <td>$623.49</td>
		  </tr>
		 </tfoot>
		</table>
		</div>
		)
	}
}

export default connect()(TicketLedger)