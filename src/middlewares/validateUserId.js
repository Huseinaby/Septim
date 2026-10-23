module.exports = (req, res, next) => {
  const { id } = req.params;

  if (!/^[1-9]\d*$/.test(id)) {
    return res.status(400).json({
      message: 'Invalid user ID. It must be a positive integer.'
    });
  }

  next();
};