const redisHelper = require('../utils/redis-helper');

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json('Unauthorized');
  }

  return redisHelper.getToken(authorization)
    .then(next())
    .catch(e => {
      return res.status(401).json('Unauthorized')
    })
}

module.exports = {
  requireAuth
}