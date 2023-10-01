import { deleteToken } from '../utils/redis-helper.mjs';

const removeAuthToken = (req, res) => {
  const { authorization } = req.headers;
  if (authorization) {
    return deleteToken(authorization)
      .then(response => {
        return res.status(200).json(response)
      })
      .catch(e => console.log('error in removeAuthToken in signout.js line 10'))
  }
  return res.status(400).json('No users are logged in.')
}

export default { removeAuthToken }
