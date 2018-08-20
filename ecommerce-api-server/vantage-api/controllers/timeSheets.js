const mongoose = require('mongoose');
const Users = require('../models/schemas/users');
const events = require('./events')
const OmniUser = Users.OmniUser;

const Schemas = require('../models/schemas/timeSheet');
const TimeSheetSchema = Schemas.timeSheetSchema;

// Need better error handling - send 404 if no users with that number is found ...

module.exports.getAllTimesheets = async (req, res, next) => {
	try{
		const TimeSheetModel = mongoose.model('TimeSheet', TimeSheetSchema, req.headers['x-mongo-key'] + '_TimeSheets')
		const allTimeSheets = await TimeSheetModel.find({})
			res.json(allTimeSheets)
	} catch(err) { next(err) }
}
module.exports.createNewTimesheet = async (req, res, next) => {
	try {	
			console.log("Creating New Timesheet. Clock In number:", req.body.clockInNumber)

			const UserClockingIn = await OmniUser.findOne({ 
				$and: [{ terminalIDNumber: req.body.clockInNumber }, { mongoCollectionKey: req.headers['x-mongo-key'] }] 
			})

			console.log('Found Client with that Terminal Number: ', UserClockingIn)
			console.log("Retreiving full name of User and appending to req.body.name:" )

			req.body.name = `${UserClockingIn.firstName} ${UserClockingIn.lastName}`

			const TimeSheetModel = mongoose.model('TimeSheet', TimeSheetSchema, req.headers['x-mongo-key'] + '_TimeSheets')

			const data = {
				user: UserClockingIn._id,
				name: `${UserClockingIn.firstName} ${UserClockingIn.lastName}`,
				timeIn: Date.now(),
				status: "Clocked In",
			}

			const newTimeSheet = new TimeSheetModel(data)
			const savedTimeSheet = await newTimeSheet.save()

			console.log("Appending newly saved Timesheet Doc. to req.body.timesheet: ", savedTimeSheet)

			req.body.timeSheet = savedTimeSheet

			console.log("Sending req.body to StoreConfig controllers")
			
			events.postNewEvent(req, res, next, {
				actionType: 'Clock In',
				createdBy: `${UserClockingIn.firstName} ${UserClockingIn.lastName}`,
				createdAt: Date.now(),
				creatorId: req.body.client._id,
				description: `${UserClockingIn.firstName} ${UserClockingIn.lastName} reported for work and clocked in.`
			})

			next()		
	} catch(err) { next(err) }
}

module.exports.checkForMissedTimesheets = async (req, res, next) => {
	try {
			console.log("Checking for missed Timesheets. Clock In number:")
			console.log(req.body.clockInNumber)

			const UserClockingIn = await OmniUser.findOne({ 
				$and: [{ terminalIDNumber: req.body.clockInNumber }, { mongoCollectionKey: req.headers['x-mongo-key'] }] 
			})

			const TimeSheetModel = mongoose.model('TimeSheet', TimeSheetSchema, req.headers['x-mongo-key'] + '_TimeSheets')

			const LookForAndUpdateForgottenTimesheet = await TimeSheetModel.findOneAndUpdate(
				{user: UserClockingIn._id, status: "Clocked In"}, 
				{timeOut: Date.now(), status: "Clocked Out" }, 
				{ new: true }
			)

			if (!LookForAndUpdateForgottenTimesheet) console.log("No missed clock-out to update")
			if (LookForAndUpdateForgottenTimesheet) {
				events.postNewEvent(req, res, next, {
					actionType: 'Missed Clock Out',
					createdBy: `${UserClockingIn.firstName} ${UserClockingIn.lastName}`,
					createdAt: Date.now(),
					creatorId: req.body.client._id,
					description: `${UserClockingIn.firstName} ${UserClockingIn.lastName} forgot to close out their timesheet last night!`
				})
				console.log("Missed Clock-Out Updated - Logged", LookForAndUpdateForgottenTimesheet)
			}

			next()
	} catch(err) { next(err) }
}

module.exports.clockOutEmployee = async (req, res, next) => {
	try { 

		console.log("Closing Timesheet. Clock In number:", req.body.clockInNumber)
		
		const UserClockingIn = await OmniUser.findOne({ 
			$and: [{ terminalIDNumber: req.body.clockInNumber }, { mongoCollectionKey: req.headers['x-mongo-key'] }] 
		})

		console.log("Found Client for clock out")

		console.log("Attaching full name to req.body.name...")

		req.body.name = `${UserClockingIn.firstName} ${UserClockingIn.lastName}`

		const TimeSheetModel = mongoose.model('TimeSheet', TimeSheetSchema, req.headers['x-mongo-key'] + '_TimeSheets')
		const ClosedTimeSheet = await TimeSheetModel.findOneAndUpdate(
			{user: UserClockingIn._id, status: "Clocked In"}, 
			{timeOut: Date.now(), status: "Clocked Out" }, 
			{ new: true }
		)
		
		if (!ClosedTimeSheet) console.log("Could not find clocked-in Timesheet to Update")
		if (ClosedTimeSheet) console.log("Logging and attaching ClosedTimeSheet to req.body.timeSheet")

		req.body.timeSheet = ClosedTimeSheet

		events.postNewEvent(req, res, next, {
			actionType: 'Clock Out',
			createdBy: `${UserClockingIn.firstName} ${UserClockingIn.lastName}`,
			createdAt: Date.now(),
			creatorId: req.body.client._id,
			description: `${UserClockingIn.firstName} ${UserClockingIn.lastName} has just clocked out.`
		})

		next()

	} catch(err) { next(err) }
}
