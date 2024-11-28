const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).send("Unauthorized: Please log in.");
  }
};

module.exports = isAuthenticated;
