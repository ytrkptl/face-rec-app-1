import { getToken } from '../utils/redis-helper.mjs';

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json('Unauthorized');
  }

  return getToken(authorization)
    .then(next())
    .catch(e => {
      return res.status(401).json('Unauthorized')
    })
}

export default {
  requireAuth
}