export const bloodTearsMiddleware = (req, res, next) => {
  res.header('x-powered-by', 'Blood, sweat, and tears.');
  next();
};
