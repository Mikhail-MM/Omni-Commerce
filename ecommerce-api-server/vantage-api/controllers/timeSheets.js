const mongoose = require('mongoose');
const Client = require('../models/schemas/client');
const Schemas = require('../models/schemas/timeSheet');
const TimeSheetSchema = Schemas.timeSheetSchema;

module.exports.createNewTimesheet = function(req, res, next) {
	console.log("Creating New Timesheet. Clock In number:")

	console.log(req.body.clockInNumber)

	Client.findOne({
		$and:[{clockInNumber: req.body.clockInNumber },
		{ mongoCollectionKey: req.headers['x-mongo-key'] }], }, '_id', function(err, client) {
		console.log("Found Client For Second Timesheet Function")
		console.log(client)
		return client;
		}).then((client) => {
			const TimeSheet = mongoose.model('TimeSheet', TimeSheetSchema, req.headers['x-mongo-key'] + '_TimeSheets')
			data = {
				user: client._id,
				name: client.firstName,
				timeIn: Date.now(),
				status: "Clocked In"
			}
			const newTimeSheet = new TimeSheet(data);
			newTimeSheet.save(function(err, timeSheet) {
				if (err) return next(err)
				res.send(timeSheet);
			})


		})
}

module.exports.checkForMissedTimesheets = function(req, res, next) {
	console.log("Checking for missed Timesheets. Clock In number:")
	console.log(req.body.clockInNumber)
	Client.findOne({
		$and:[{clockInNumber: req.body.clockInNumber },
		{ mongoCollectionKey: req.headers['x-mongo-key'] }], }, '_id', function(err, client) {
		console.log("Found Client for First Timesheet Function")
		console.log(client)
		return client;
		}).then((client) => {
		const TimeSheet = mongoose.model('TimeSheet', TimeSheetSchema, req.headers['x-mongo-key'] + '_TimeSheets')
		TimeSheet.findOneAndUpdate({user: client._id, status: "Clocked In"}, {timeOut: Date.now(), status: "Clocked Out" }, { new: true }, function(err, updatedMissedTimeSheet) {
			if (!updatedMissedTimeSheet) console.log("No missed clock-outs to update")
			if (err) next(err)
			console.log("Missed Clock-Out Updated - Logged")
			console.log(updatedMissedTimeSheet)
			next();
		})
	})
}

module.exports.clockOutEmployee = function(req, res, next) {
	console.log("Closing Out Timesheet. Clock In number:")
	console.log(req.body.clockInNumber)
	Client.findOne({
		$and:[{clockInNumber: req.body.clockInNumber },
		{ mongoCollectionKey: req.headers['x-mongo-key'] }], }, '_id', function(err, client) {
		console.log("Found Client for Clock Out")
		console.log(client)
		return client;
		}).then((client) => {
		const TimeSheet = mongoose.model('TimeSheet', TimeSheetSchema, req.headers['x-mongo-key'] + '_TimeSheets')
		TimeSheet.findOneAndUpdate({user: client._id, status: "Clocked In"}, {timeOut: Date.now(), status: "Clocked Out" }, { new: true }, function(err, closedTimeSheet) {
			if (!closedTimeSheet) console.log("Could not find clocked-in Timesheet to update")
			if (err) next(err)
			console.log("closedTimeSheet- Logged")
			console.log(closedTimeSheet)
			next();
		})
	})
}

// I tried chaining these together into a single function but got an unresolved Promise Rejection