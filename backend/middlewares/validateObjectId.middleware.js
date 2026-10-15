const mongoose = require('mongoose');

function validateObjectId(paramName, label) {
  return function (req, res, next) {
    if (!mongoose.isObjectIdOrHexString(req.params[paramName])) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${label}`
      });
    }

    next();
  };
}

module.exports = validateObjectId;
