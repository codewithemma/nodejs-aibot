require("dotenv").config();
const express = require("express");
const session = require("express-session");
const app = express();

// routes
const authRoute = require("./routes/auth");
const serviceRouter = require("./routes/services");

// connect db
const connectDB = require("./db/connect");

const port = 3000;

app.use(express.json());

// middlewares
app.get("/", (req, res) => {
  res.send("hello");
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
      secure: false, // Ensure cookies are only sent over HTTPS in production
    },
  })
);

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/dashboard", serviceRouter);

const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`server is listening at port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
