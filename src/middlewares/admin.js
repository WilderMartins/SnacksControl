const User = require('../models/User');

module.exports = async (req, res, next) => {
  const user = await User.findByPk(req.userId);

  if (!user || user.role !== 'admin') {
    return res.status(401).json({ error: 'User is not an admin' });
  }

  return next();
};
