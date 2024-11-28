const User = require("../models/user");

const getLoggedInUser = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: "User not logged in" });
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("sesssssssssssssion", req.session);

    res.status(200).json({
      message: "Logged in user",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getLoggedInUser };
