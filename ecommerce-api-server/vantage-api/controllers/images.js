const Image = require('../models/schemas/image')
const fs = require('fs');

module.exports.uploadNewImage = function(req, res, next) {
	try {
		console.log(req.file)
		
		/* 
			// Code for saving raw buffer data into database instead of storing images to disk

		const newModel = new Image({ img: { data: req.file.buffer, contentType: req.file.mimetype }})
		const savedThang = await newModel.save()

		*/

		console.log(req.body)

		if (req.file.fieldname === "marketplaceItems") { req.body.imageURL = '/assets/marketplace-items/' + req.file.filename }
		if (req.file.fieldname === "marketplaceAvatar") { req.body.imageURL = '/assets/marketplace-avatars/' + req.file.filename }

		console.log("Storing image on disk, saving filesystem source URL to DB (Appending to req.body.imageURL")

		console.log(req.body.imageURL)
		console.log(req.body)

	next() 
	} catch(err) { next(err) }

}
