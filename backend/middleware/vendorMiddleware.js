const vendor = (req, res, next) => {
  if (req.user && (req.user.role === 'vendor' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a vendor' });
  }
};

module.exports = { vendor };
