const validateObjectId = require('./validateObjectId.middleware');

module.exports = validateObjectId('productId', 'product ID');
