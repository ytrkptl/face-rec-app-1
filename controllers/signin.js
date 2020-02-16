const jwt = require('jsonwebtoken');
const redisHelper = require('../utils/redis-helper');

const signToken = (username) => {
  const jwtPayload = { username };
  return jwt.sign(jwtPayload, 'JWT_SECRET_KEY', { expiresIn: '2 days' });
};

const createSession = (user) => {
  const { email, id } = user;
  const token = signToken(email);
  return redisHelper.setToken(token, id)
    .then(() => {
      return { success: 'true', userId: id, token, user }
    })
    .catch(err => console.log(`error creating session in signin.js`));
};

const handleSignin = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject('incorrect form submission');
  }
  return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => user[0])
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        return Promise.reject('wrong credentials');
      }
    })
    .catch(err => err)
}

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  return redisHelper.getToken(authorization)
    .then(reply => {
      res.status(200).json({ id: reply })
    })
    .catch(e => {
      res.status(401).json('Unauthorized')
    })
}

const signinAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization ? getAuthTokenId(req, res)
    : handleSignin(db, bcrypt, req, res)
      .then(data =>
        data.id && data.email ? createSession(data) : Promise.reject(data))
      .then(session => res.json(session))
      .catch(err => res.status(400).json(err));
}

module.exports = {
  signinAuthentication,
  jwt
}