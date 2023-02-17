const express = require("express");
const { isLoggedPages } = require("../middlewares/isLogged.midlleware");

const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
	res.render("index", { title: "Express" });
});

/* GET login page. */
router.get("/login", (req, res, next) => {
	res.render("login", {
		title: "Login",
		errorMsg:
			req.session.messages && req.session.messages[0]
				? req.session.messages[0]
				: "",
	});
});

/* GET chat page. */
router.get("/chat", isLoggedPages, (req, res, next) => {
	res.render("chat", { title: "Chat" });
});

// Render 404
router.all("*", (req, res) => {
	res.status(404).json({
		message: "Invalid request, Route does not exist",
	});
});
module.exports = router;
