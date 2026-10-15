const jwt = require('jsonwebtoken');
const Customer = require('../models/customer.model');
const { sendNotAuthenticated } = require('../utils/responses');

async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies && req.cookies.token;

    if (!token) {
      return sendNotAuthenticated(res);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const customer = await Customer.findById(decoded.id).select('-password');

    if (!customer) {
      return sendNotAuthenticated(res);
    }

    req.user = customer;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired, please log in again'
      });
    }

    if (err.name === 'JsonWebTokenError' || err.name === 'NotBeforeError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    next(err);
  }
}

module.exports = authMiddleware;
