const express = require("express");
const { callBack, signInGoogle } = require("../controllers/auth");
const router = express.Router();

router.get("/login", signInGoogle);

router.get("/callback", callBack);

module.exports = router;
