const { Router } = require("express");
const passport = require("../middlewares/passport.middleware");
const { signup, getUsers } = require("../controllers/user.controller");
const { sendMessage } = require("../controllers/message.controller");
const {
	signupValidator,
	loginValidator,
	postMessageValidator,
} = require("../utils/validator.util");
const { isLoggedAPI } = require("../middlewares/isLogged.midlleware");

const router = Router();

/* GET users listing. */
router.get("/", (req, res) => {
	res.status(200).send({
		message: "Welcome to the Single-Chat-Room API",
	});
});

router.post("/auth/signup", signupValidator, signup);
router.post(
	"/auth/login",
	(req, res, next) => {
		req.session.messages = undefined;
		next();
	},
	loginValidator,
	passport.authenticate("local", {
		successReturnToOrRedirect: "/chat",
		failureRedirect: "/login",
		failureMessage: true,
	})
);
router.get("/users", isLoggedAPI, getUsers);

// Messages
router.post("/messages", isLoggedAPI, postMessageValidator, sendMessage);

router.all("*", (req, res) => {
	res.status(404).json({
		message: "Invalid request, Route does not exist",
	});
});

module.exports = router;
