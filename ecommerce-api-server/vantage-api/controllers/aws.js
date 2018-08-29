const AWS = require('aws-sdk');
const s3 = new AWS.S3()
const uuid4 = require('uuid/v4');
require('dotenv').config()

module.exports.signS3Request = (req, res, next) => {
	const { fileName, fileType } = req.query

	console.log(fileName, fileType)

	const collisionSafeFileName = `${uuid4().slice(0, 7)}_${fileName}`

	const s3Params = {
		Bucket: process.env.AWS_S3_BUCKET,
		Key: collisionSafeFileName,
		ContentType: fileType, 
		ACL: 'public-read'
	};

	s3.getSignedUrl('putObject', s3Params, (err, data) => {
		if (err) next(err)
			res.json({
				signedRequest: data,
				fileOnBucketurl: `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${collisionSafeFileName}`
			})
	})
}