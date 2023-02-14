var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
	res.render("index", { title: "Express" });
});

/* GET login page. */
router.get("/login", function (req, res, next) {
	res.render("login", { title: "Login" });
});

/* GET chat page. */
router.get("/chat", function (req, res, next) {
	res.render("chat", { title: "Chat" });
});

// Render 404
router.all("*", (req, res) => {
	res.status(404).json({
		message: "Invalid request, Route does not exist",
	});
});
module.exports = router;
