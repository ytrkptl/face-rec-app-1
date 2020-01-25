const redisHelper = require('../../utils/redis-helper');
const handleSendingEmailConfirmation = require('../send-email-confirmation').handleSendingEmailConfirmation;
const randomIdFunc = require('../../utils/other-helper').getUuidv4;

/* This method checks to see if name, email, and password are provided first, then it
checks to see if that email exists in database. If yes, sends the user
an email with a confirmationId and a success status of 200. If no, sends the users
no emails but still with a success status of 200. This will keep anyone from 
figuring out what emails exist in our database */
const handleRegisterWithEmail = async (db, bcrypt, req, res) => {
  
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
     return res.status(400).json('Please fill out a valid form')
  }

  let messageToSend = `If the email address you provided is valid, you should've received a code in an email from us. Please check your email and enter that code below.`
  
  db.select('id', 'email').from('users')
    .where({'email': email})
    .then(user => {
      if (user[0]===undefined) {
        const randomId = randomIdFunc();
        let passwordEnc = bcrypt.hashSync(password, 10);
        let someKeys = ['randomId', 'name', email, 'password', 'email']
        let someVals = [randomId, name, email, passwordEnc, email] 
        redisHelper.keyExists(email)
        .then(x=>{
          if(x===0) {
            // register only if key does not exist 
            redisHelper.setMultipleValuesWithEx(someKeys, someVals)
            .then(check=>{
              if (check===true) {
                handleSendingEmailConfirmation(randomId, req, res)
              } else {
                Promise.reject('noooo error').catch(err=>err)
              }
            })
            .catch(err=>{
              Promise.reject('key already exists').catch(err=>err)
            })
          } 
          else {
            Promise.reject('key already exists').catch(err=>err)
          }
        })
        .catch(err=> {
          return res.status(400).json('An email with confirmation code has already been sent to this email address.')
        })
        return res.status(200).json(messageToSend)
      } else {
        throw new Error(messageToSend)
      }
    })
    .catch(err => {
      if(err) {
        console.log(err)
        return res.status(200).json(messageToSend)
      }
    })
}

module.exports = {
  handleRegisterWithEmail: handleRegisterWithEmail,
}