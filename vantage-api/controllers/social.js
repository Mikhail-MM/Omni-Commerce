const Users = require('../models/schemas/users');
const EssosUser = Users.EssosUser;

module.exports.follow = async (req, res, next) => {
	try {
		const { mode } = req.body
		const authorizedUser = await EssosUser.findById(req.body.client._id)
		const followedUser = await EssosUser.findById(req.params.id)

		let follower, followee
		switch(mode) {
			case('follow'):
				follower = await EssosUser.findOneAndUpdate(
					{_id: req.body.client._id},
					{ $push: { following: { 
						userId: followedUser._id,
						name: `${followedUser.firstName} ${followedUser.lastName}`,
						avatarURL: followedUser.avatarURL,
					}}},
					{upsert: true, new: true},
				)
				followee = await EssosUser.findOneAndUpdate(
					{_id: req.params.id},
					{ $push: { followers: {
						userId: authorizedUser._id,
						name: `${authorizedUser.firstName} ${authorizedUser.lastName}`,
						avatarURL: authorizedUser.avatarURL,
					}}},
					{upsert: true, new: true},
				)
					res.json(follower.following)
					break
			case('unfollow'):
				follower = await EssosUser.findOneAndUpdate(
					{_id: req.body.client._id},
					{ $pull: { following: { userId: req.params.id }}},
					{upsert: true, new: true},
				)
				followee = await EssosUser.findOneAndUpdate(
					{_id: req.params.id},
					{ $pull: { followers: { userId: authorizedUser._id}}},
					{upsert: true, new: true},
				)
					res.json(follower.following)
		}
	} catch(err) { next(err) }
}