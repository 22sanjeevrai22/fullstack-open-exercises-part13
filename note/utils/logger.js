const info = (...params) => {
  console.log(new Date().toISOString(), ...params);
};

const error = (...params) => {
  console.error(new Date().toISOString(), ...params);
};

const requestLogger = (req, res, next) => {
  info(
    "Incoming request:",
    "method=",
    req.method,
    "path=",
    req.path,
    "body=",
    req.body
  );
  next();
};

module.exports = {
  info,
  error,
  requestLogger,
};
