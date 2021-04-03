export const bloodTearsMiddleware = (req, res, next) => {
  res.header('x-powered-by', 'ingenuity, excellence, and ultimate-backend.');
  next();
};
