const Image = require('../models/schemas/image')
const fs = require('fs');

module.exports.uploadNewImage = async function(req, res, next) {
	console.log(req.file)
	const newModel = new Image({ img: { data: req.file.buffer, contentType: req.file.mimetype }})
	const savedThang = await newModel.save()
	console.log(req.body)

	res.send(req.file)

}
