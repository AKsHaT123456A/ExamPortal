const isBrowser = require("../Utils/browserCheck");

function browserOnlyMiddleware(req, res, next) {
  if (isBrowser(req)) {
    next();
  } else {
    res.status(403).json({ message: 'API access is restricted .' });
  }
}

module.exports = browserOnlyMiddleware;
