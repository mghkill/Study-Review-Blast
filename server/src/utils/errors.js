function sendError(res, err, defaultMsg, status = 500) {
  console.error(err.stack || err.message || err);
  res.status(status).json({ error: defaultMsg });
}

module.exports = { sendError };
