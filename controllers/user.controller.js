const utility = require("../utils/utility.util");
const UserLib = require("../lib/user.lib");
const asyncHandler = require("../middlewares/async.middleware");
const ErrorResponse = require("../utils/errorResponse.util");

const {
	filterValues,
	formatValues,
	hashPassword,
	comparePasswords,
	sendTokenResponse,
} = utility;

class AuthController {
	constructor() {
		this.userLib = new UserLib();
	}

	/**
	 * @desc Register user
	 * @route POST /api/v1/auth/signup
	 * @access Public
	 */
	signup = asyncHandler(async (req, res, next) => {
		const rawData = req.body;
		const { password } = rawData;
		const encryptedPassword = await hashPassword(password);
		const data = {
			...rawData,
			password: encryptedPassword,
		};
		const existingUsername = await this.userLib.fetchUser({
			username: data.username,
		});
		if (existingUsername) {
			return next(new ErrorResponse("Username already taken", 400));
		}

		const user = await this.userLib.createUser(data, next);
		return sendTokenResponse(user, 201, res);
	});

	/**
	 * @desc Login user
	 * @route POST /api/v1/auth/login
	 * @access Public
	 */
	login = asyncHandler(async (req, res, next) => {
		// try {
		const rawData = req.body;
		const { password } = rawData;
		const data = {
			...rawData,
			password,
		};
		const user = await this.userLib.fetchUserWithPassword({
			username: data.username,
		});
		if (!user) {
			return next(new ErrorResponse("Incorrect username or password", 401));
		}
		const passwordMatch = await comparePasswords(password, user.password);
		if (passwordMatch) {
			return sendTokenResponse(user, 200, res);
		}
		return next(new ErrorResponse("Incorrect username or password", 401));
	});

	/**
	 * @desc Get current logged in user
	 * @route GET /api/v1/auth/me
	 * @access Private
	 */
	getMe = asyncHandler(async (req, res) => {
		const user = await this.userLib.fetchUser(req.user.id);

		res.status(200).json({ success: true, data: user });
	});
}

module.exports = new AuthController();
