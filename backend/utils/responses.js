function sendError(res, status, message) {
  return res.status(status).json({
    success: false,
    message
  });
}

function sendProductNotFound(res) {
  return sendError(res, 404, 'Product not found');
}

function sendNotAuthenticated(res) {
  return sendError(res, 401, 'Not authenticated');
}

module.exports = {
  sendError,
  sendProductNotFound,
  sendNotAuthenticated
};
