require("dotenv");
const express = require("express");
const session = require("express-session");
const app = express();

const providersRouter = require("./routes/providers");
const connectDB = require("./db/connect");

const port = 3000;

// middlewares
app.get("/", (req, res) => {
  res.send("hello");
});

app.use(
  session({
    secret: "1eef7c7c138cd7ef9f190677e73e9492b2226de1f4a96c156d8403d5a6da2752",
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/api/v1", providersRouter);

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
