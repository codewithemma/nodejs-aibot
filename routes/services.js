const express = require("express");
const router = express.Router();

const { getLoggedInUser } = require("../controllers/services");
const isAuthenticated = require("../middleware/authentication");

router.get("/profile", isAuthenticated, getLoggedInUser);

module.exports = router;
