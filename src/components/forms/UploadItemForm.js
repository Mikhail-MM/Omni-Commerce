import React, { Component } from 'react';
import { connect } from 'react-redux';

import '../styles/UploadItemForm.css'

import { modifyOmniTerminalItem, createNewMenuItem } from '../../actions/terminalItems'
import { updateMarketplaceItem, postEssosItem } from '../../actions/marketplace'

const initialState = {
	itemName: '',
	itemPrice: '',
	imageSource: null,
	category: '',
	tags: [],
	newImageFlag: false,
	selectedFile: null,
}

const mapStateToProps = state => {
	const { token } = state.authReducer
	return { token }
}
const mapDispatchToProps = dispatch => ({
	modifyOmniItem: (token, itemID, data, imageHandler) => {
		dispatch(modifyOmniTerminalItem(token, itemID, data, imageHandler))
	},
	modifyEssosItem: (token, itemID, data, imageHandler) => {
		dispatch(updateMarketplaceItem(token, itemID, data, imageHandler))
	},
	uploadOmniItem: (token, data, imageFile) => {
		dispatch(createNewMenuItem(token, data, imageFile))
	},
	uploadEssosItem: (token, data, imageFile) => {
		dispatch(postEssosItem(token, data, imageFile))
	},
})

class UploadItemForm extends Component {
	state = initialState

	componentDidMount() {
		//const { itemName, itemPrice, category, imageURL, numberInStock, tags } = this.props.modifyItemAttributes
		console.log(this.props)
		
		if (this.props.action === 'modify') {
			switch(this.props.module) {
				case('Omni'):
					return this.setState({
						itemName: this.props.modifyItemAttributes.itemName,
						itemPrice: this.props.modifyItemAttributes.itemPrice,
						category: this.props.modifyItemAttributes.category,
						imageSource: this.props.modifyItemAttributes.imageURL, 
					})
				case('Essos'):
					return this.setState({
						itemName: this.props.modifyItemAttributes.itemName,
						itemPrice: this.props.modifyItemAttributes. itemPrice,
						numberInStock: this.props.modifyItemAttributes.numberInStock,
						imageSource: this.props.modifyItemAttributes.imageURL,
						tags: this.props.modifyItemAttributes.tags
					})
			}
		}
	}
	
	handleChange = (key, value) => {
		this.setState([key]: value)
	}

	handleTagChange(tagName){
		if (!this.state.tags.includes(tagName)) {
			this.setState({
				tags: this.state.tags.concat([tagName])	
			})
		}
		if (this.state.tags.includes(tagName)) {
			this.setState({
				tags: this.state.tags.filter(item => item !== tagName)
			})
		}
		
	}

	imageSelectedHandler = (event) => {
		this.setState({
			imageSource: event.target.files[0],
			newImage: true
		})
	}


	handleSubmit = (event) => {
		event.preventDefault()
		const { token } = this.props
		switch(this.props.module) {
			case('Omni'): {
				switch(this.props.action){
					case('modify'):
						return this.handleOmniModification(token)
					case('upload'):
						return this.handleOmniUpload(token)
				}
			}
			case('Essos'): {
				switch(this.props.action) {
					case('modify'):
						return this.handleEssosModification(token)
					case('upload'):
						return this.handleEssosUpload(token)
				}
			}
		}

	}



	handleOmniModification = (token) => {
		const { itemName, itemPrice, category, imageSource, newImageFlag } = this.state
		const { _id } = this.props.modifyItemAttributes
		const data = {
			itemName,
			itemPrice,
			category
		}
		const imageHandler = {
			newImageFlag,
			imageSource
		}
		this.props.modifyOmniItem(token, _id, data, imageHandler)
	}

	handleOmniUpload = (token) => {
		if (this.state.imageSource === null) return console.log("Please upload an image.")
		const { itemName, itemPrice, category, imageSource } = this.state
		const data = {
			itemName,
			itemPrice,
			category
		}
		this.props.uploadOmniItem(token, data, imageSource)
	}

	handleEssosModification = (token) => {
		const { itemName, itemPrice, numberInStock, tags, imageSource, newImageFlag } = this.state
		const { _id } = this.props.modifyItemAttributes
		const data = {
			itemName,
			itemPrice,
			numberInStock,
			tags,
		}
		const imageHandler = {
			newImageFlag,
			imageSource
		}
		this.props.modifyEssosItem(token, _id, data, imageHandler)
	}

	handleEssosUpload = (token) => {
		this.props.uploadEssosItem()
	}

	renderTagSelectionMenu = () => {
		// Export tags array to config
		const tags = [
			{ 
				tagname: `Shoes - Male`,
				iconURL: `/assets/icons/box.svg`
			},
			{ 
				tagname: `Shoes - Female`,
				iconURL: `/assets/icons/box.svg`
			},
		]

		return tags.map(tag => {
			if (!this.state.tags.includes(tag)) return (
				<div 
					className='essos-category-tag-label' 
					style={{backgroundColor: 'red'}}
					onClick={ () => this.handleTagChange(tag.tagName) }
				> 
						<div className='tag-icon-container' >
							<img src={tag.iconURL} />
						</div>
						<div>
							{tag.tagName}
						</div>
				</div>
			)
			else if (this.state.tags.includes(tag)) return (
				<div 
					className='essos-category-tag-label' 
					style={{backgroundColor: 'gray'}}
					onClick={ () => this.handleTagChange(tag.tagName) }
				> 
					<div className='tag-icon-container' >
						<img src={tag.iconURL} />
					</div>
					<div>
						{tag.tagName}
					</div>
				</div>
			)
		})
	}

	render() {
		return(
			(this.props.module === 'Omni') ? (
				<form className='omni-item-form-wrapper' onSubmit={(event) => this.handleSubmit(event)}>
					<div className='omni-image-preview-container' >
						<img src={this.state.imageSource} />
					</div>
					<div>
						<input 
							type='file'
							name='menuItems'
							onChange={(event) => this.imageSelectedHandler(event)}
						/>
					</div>
					<div>
						<input 
							type='text'
							value={this.state.itemName}
							onChange={(event) => this.handleChange('itemName', event.target.value)}
						/>
					</div>
					<div>
						<input
							type='text'
							value={this.state.itemPrice}
							onChange={(event) => this.handleChange('itemPrice', event.target.value)}
						/>
					</div>
					<div>
						<input 
							type='text'
							value={this.state.category}
							onChange={(event) => this.handleChange('category', event.target.value)}
						/>
					</div>
					<div>
						<input type='submit' />
					</div>
				</form>
			) : (
				<form className='essos-item-form-wrapper' onSubmit={(event) => this.handleSubmit(event)}>
					<div className='essos-image-upload-column'>
						<div className='essos-image-preview-container'>
							<img src={this.state.imageSource} />
						</div>
						<div>
							<input 
								type='file'
								name='marketplaceItems'
								onChange={(event) => this.imageSelectedHandler(event)}
							/>
						</div>
					</div>
					<div className='essos-product-details-modify-column'>
						<div>
							<input 
								type='text'
								value={this.state.itemName}
								onChange={(event) => this.handleChange('itemName', event.target.value)}
							/>
						</div>
						<div>
							<input 
								type='text'
								value={this.state.itemPrice}
								onChange={(event) => this.handleChange('itemPrice', event.target.value)}
							/>
						</div>
						<div>
							<input 
								type='text'
								value={this.state.numberInStock}
								onChange={(event) => this.handleChange('numberInStock', event.target.value)}
							/>
						</div>
						<div className='tag-selection-input-container'>
							{ this.renderTagSelectionMenu() }
						</div>
					</div>
				</form>

			)
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadItemForm)