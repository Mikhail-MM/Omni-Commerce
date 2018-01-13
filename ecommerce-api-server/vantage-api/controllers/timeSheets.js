const mongoose = require('mongoose');
const Client = require('../models/schemas/client');
const Schemas = require('../models/schemas/timeSheet');
const TimeSheetSchema = Schemas.timeSheetSchema;

module.exports.createNewTimesheet = function(req, res, next) {
	console.log("Creating New Timesheet. Clock In number:")

	console.log(req.body.clockInNumber)

	Client.findOne({
		$and:[{clockInNumber: req.body.clockInNumber },
		{ mongoCollectionKey: req.headers['x-mongo-key'] }], }, function(err, client) {
		console.log("Found Client For Second Timesheet Function")
		console.log(client)
		req.body.name = client.firstName;
		console.log("Attaching Client name from client.firstName")
		console.log(client.firstName)
		console.log("...to req.body.name:")
		console.log(req.body.name)
		console.log("This should be passed to our logged in storeConfig function")
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
				req.body.timeSheet = timeSheet
				next()
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
		{ mongoCollectionKey: req.headers['x-mongo-key'] }], }, function(err, client) {
		console.log("Found Client for Clock Out")
		console.log(client)
		console.log("Attaching Client name from client.firstName")
		console.log(client.firstName)
		req.body.name = client.firstName;
		console.log("...to req.body.name:")
		console.log(req.body.name)
		console.log("This should be passed to our logged in storeConfig function")
		return client;
		}).then((client) => {
		const TimeSheet = mongoose.model('TimeSheet', TimeSheetSchema, req.headers['x-mongo-key'] + '_TimeSheets')
		TimeSheet.findOneAndUpdate({user: client._id, status: "Clocked In"}, {timeOut: Date.now(), status: "Clocked Out" }, { new: true }, function(err, closedTimeSheet) {
			if (!closedTimeSheet) console.log("Could not find clocked-in Timesheet to update")
			if (err) next(err)
			console.log("closedTimeSheet- Logged")
			console.log(closedTimeSheet);
			req.body.timeSheet = closedTimeSheet;
			next();
		})
	})
}

// I tried chaining these together into a single function but got an unresolved Promise Rejection