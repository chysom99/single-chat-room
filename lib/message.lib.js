const Message = require("../models/message.model");

class MessageLib {
	constructor() {
		this.MessageModel = Message;
	}

	createMessage = async (messageDetails) => {
		const { MessageModel } = this;
		const { messageText, timeSent, sender } = messageDetails;
		let message;
		try {
			message = new MessageModel({
				messageText,
				timeSent,
				sender,
			});
			return await message.save();
		} catch (error) {
			throw new ErrorResponse(`${error.message}`, 500);
		}
	};
	fetchMessages = async () => {
		const { MessageModel } = this;
		const messages = await MessageModel.find({}).exec();
		return messages;
	};
}

module.exports = MessageLib;
