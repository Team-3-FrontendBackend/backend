// import necessary libraries
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    console.log('not authenticated');
    return res.status(403).json({ message: 'Not Authenticated' });
  }

  const token = authHeader.split(' ')[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
  } catch (err) {
    console.log(err);
    return res.status(403).json({ message: 'Not Authenticated' });
  }

  if (!decodedToken) {
    console.log('not authenticated');
    return res.status(403).json({ message: 'Not Authenticated' });
  }
  req.userId = decodedToken.userId;
  next();
};
