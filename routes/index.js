const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/authors", require("./author"));
router.use("/books", require("./book"));
router.use("/users", require("./users"));

module.exports = router;
