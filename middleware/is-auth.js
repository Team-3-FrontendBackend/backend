// import necessary libraries
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated');
    error.statusCode = 403;
    throw error;
  }

  const token = authHeader.split(' ')[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    const error = new Error('Not authenticated');
    error.statusCode = 403;
    throw error;
  }

  if (!decodedToken) {
    const error = new Error('Not authenticated');
    error.statusCode = 403;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
