const Image = require('../models/schemas/image')

module.exports.uploadNewImage = function(req, res, next) {
	try {
		
		console.log("reqbody", req.body)
		console.log("reqfile", req.file)
		/* 
			// Code for saving raw buffer data into database instead of storing images to disk

		const newModel = new Image({ img: { data: req.file.buffer, contentType: req.file.mimetype }})
		const savedThang = await newModel.save()

		*/
		const imgSrcJSON = {}
		if (req.file.fieldname === 'marketplaceItems') {
			
			imgSrcJSON.imageURL = '/assets/marketplace-items/' + req.file.filename 
				
				res.json(imgSrcJSON)
		}

		else if (req.file.fieldname === 'marketplaceAvatar') {

			req.body.imageURL = '/assets/marketplace-items/' + req.file.filename
			
				next()
		}
		
	} catch(err) { next(err) }

}
