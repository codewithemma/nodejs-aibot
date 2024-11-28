const express = require("express");
const { oAuthHandler, callBack } = require("../controllers/loginWithGoogle");
const router = express.Router();

router.get("/login", oAuthHandler);

router.get("/auth/callback", callBack);

module.exports = router;
