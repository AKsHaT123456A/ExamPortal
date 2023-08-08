const isBrowser = require('../utils/browserCheck');

function browserOnlyMiddleware(req, res, next) {
  if (isBrowser(req)) {
    next();
  } else {
    res.status(403).json({ message: 'API access is restricted to browsers only.' });
  }
}

module.exports = browserOnlyMiddleware;
