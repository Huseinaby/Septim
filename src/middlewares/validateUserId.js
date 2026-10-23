module.exports = (req, res, next) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      message: 'Invalid user ID. It must be a positive integer.'
    });
  }

  next();
};