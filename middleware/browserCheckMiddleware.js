import isBrowser from "../Utils/browserCheck.js";

function browserOnlyMiddleware(req, res, next) {
  if (isBrowser(req)) {
    next();
  } else {
    res.status(403).json({ message: 'API access is restricted .' });
  }
}

export default browserOnlyMiddleware;
