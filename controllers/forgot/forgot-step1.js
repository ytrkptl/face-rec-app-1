const redisHelper = require('../../utils/redis-helper');
const handleSendingEmail = require('../send-email-forgot').handleSendingEmail;
const randomIdFunc = require('../../utils/other-helper').getSixDigitCode;

/* This method checks to see if yourEmail was provided first, then it
checks to see if that email exists in database. If yes, sends the user
an email with a resetId and a success status of 200. If no, sends the users
no emails but still with a success status of 200. This will keep anyone from 
figuring out what emails exist in our database */

const handleForgotPassword = (db, req, res) => {

  const { yourEmail } = req.body;

  if (!yourEmail) {
    return Promise.reject('Please fill out a valid email address.');
  }

  db.select('id', 'email').from('users')
    .where({ 'email': yourEmail })
    .then(user => {
      if (user[0].id) {
        const randomId = randomIdFunc();
        redisHelper.setTokenWithEx(yourEmail, 900, randomId)
          .then(check => {
            if (check === 'OK') {
              handleSendingEmail(randomId, req, res)
            } else {
              return Promise.reject()
            }
          })
          .catch(err => {
            console.log('Something went wrong in step forgot step 1 line 33')
          })
        return res.status(200).json('Please check your email and enter the code provided in the box below within 15 minutes.')
      }
    })
    .catch(err => {
      return res.status(200).json(`Please check your email and enter the code provided in the box below within 15 minutes.`)
    })
}

module.exports = {
  handleForgotPassword
}