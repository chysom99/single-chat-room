const utility = require("../utils/utility.util");
const MessageLib = require("../lib/message.lib");
const asyncHandler = require("../middlewares/async.middleware");
const ErrorResponse = require("../utils/errorResponse.util");

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
}

module.exports = new MessageController();
