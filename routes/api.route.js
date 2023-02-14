var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res) {
	res.status(200).send({
		message: "Welcome to the Single-Chat-Room API",
	});
});

router.all("*", (req, res) => {
	res.status(404).json({
		message: "Invalid request, Route does not exist",
	});
});

module.exports = router;
