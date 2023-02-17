const mongoose = require("mongoose");

const { Schema } = mongoose;

const msgSchema = new Schema(
	{
		messageText: { type: String, required: true },
		timeSent: { type: Date, default: Date.now },
		sender: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("message", msgSchema);
