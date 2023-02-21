const Message = require("../models/message.model");
const utility = require("../utils/utility.util");
const MessageLib = require("../lib/message.lib");
const asyncHandler = require("../middlewares/async.middleware");
const advancedResults = require("../utils/advancedResults.util");

class MessageController {
	constructor() {
		this.messageLib = new MessageLib();
	}

	/**
	 * @desc Send Message
	 * @route POST /api/v1/messages
	 * @access Private
	 */
	sendMessage = asyncHandler(async (req, res, next) => {
		const { messageText, timeSent } = req.body;
		const message = await this.messageLib.createMessage({
			messageText,
			timeSent,
			sender: req.session.passport.user.username,
		});
		return res.status(200).json({
			success: true,
			message,
		});
	});

	/**
	 * @desc Fetch Messages
	 * @route GET /api/v1/messages
	 * @access Private
	 */
	getMessages = asyncHandler(async (req, res, next) => {
		const { query } = req;
		const { page, limit, select, sort, ...filter } = query;
		const result = await advancedResults(Message, filter, {
			page,
			limit,
			select,
			sort,
		});

		res.status(200).json({
			success: true,
			...result,
		});
	});
}

module.exports = new MessageController();
