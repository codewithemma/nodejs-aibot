const { google } = require("googleapis");
const crypto = require("crypto");
const url = require("url");
const User = require("../models/user");

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/meetings",
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const oauth2Client = new google.auth.OAuth2(
  "1064744088219-aple5jj2lim0ih1af35t331t8vknmt1q.apps.googleusercontent.com",
  "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",
  "http://localhost:3000/api/v1/auth/callback"
);

const oAuthHandler = async (req, res) => {
  const state = await crypto.randomBytes(32).toString("hex");
  req.session.state = state;
  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES.join(" "),
    include_granted_scopes: true,
    state: state,
  });
  res.redirect(authorizationUrl);
};

const callBack = async (req, res) => {
  try {
    let q = url.parse(req.url, true).query;
    if (q.error) {
      console.log("Error:" + q.error);
    } else if (q.state !== req.session.state) {
      console.log("State mismatch. Possible CSRF attack");
      res.end("State mismatch. Possible CSRF attack");
    } else {
      let { tokens } = await oauth2Client.getToken(q.code);
      oauth2Client.setCredentials(tokens);
      // Get user info
      const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: "v2",
      });

      const userInfo = await oauth2.userinfo.get();
      const { id, email, name, picture } = userInfo.data;

      // Save user to DB
      let user = await User.findOne({ googleId: id });

      if (!user) {
        user = new User({
          googleId: id,
          name,
          email,
          picture,
          refreshToken: tokens.refresh_token || null, // Save refresh token if available
        });
        await user.save();
      }
      // Store user ID in session
      req.session.userId = user._id;
      res.send(`Welcome, ${name}`);
    }
  } catch (error) {
    console.error("Error during callback:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { oAuthHandler, callBack };
