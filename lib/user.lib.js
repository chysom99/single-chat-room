const passport = require("passport");
const LocalStrategy = require("passport-local");
const UserModel = require("../models/user.model");
const { comparePasswords } = require("../utils/utility.util");

fetchUsers = async () => {
	const users = await UserModel.find({}).exec();
	return users;
};

fetchUser = async (value) => {
	const user = await UserModel.findOne({ ...value }).exec();
	return user;
};

fetchUserWithPassword = async (value) => {
	const user = await UserModel.findOne({ ...value })
		.select("password")
		.exec();
	return user;
};

const localStrategy = new LocalStrategy(async function verify(
	username,
	password,
	cb
) {
	try {
		const user = await fetchUserWithPassword({ username });
		if (!user) {
			return cb(null, false, { message: "Incorrect username or password." });
		}

		const passwordMatch = await comparePasswords(password, user.password);
		if (passwordMatch) {
			return cb(null, false, { message: "Incorrect username or password." });
		}
	} catch (err) {
		if (err) {
			return cb(err);
		}
	}
});

passport.use(localStrategy);

passport.serializeUser(function (user, cb) {
	process.nextTick(function () {
		cb(null, { id: user.id, username: user.username });
	});
});

passport.deserializeUser(function (user, cb) {
	process.nextTick(function () {
		return cb(null, user);
	});
});
