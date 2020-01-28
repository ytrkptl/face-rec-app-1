const redisHelper = require('../../utils/redis-helper');
const handleSendingEmailConfirmation = require('../send-email-confirmation').handleSendingEmailConfirmation;
const randomIdFunc = require('../../utils/other-helper').getUuidv4;

let messageToSend = `If the email address you provided is valid, you should've received a code in an email from us. Please check your email and enter that code below.`


/* This method checks to see if name, email, and password are provided first, then it
checks to see if that email exists in database. If yes, sends the user
an email with a confirmationId and a success status of 200. If no, sends the users
no emails but still with a success status of 200. This will keep anyone from 
figuring out what emails exist in our database */
const handleRegisterWithEmail = (db, bcrypt, req, res) => {

  redisHelper.flushAllFromRedis();

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
     return res.status(400).json('Please fill out a valid form')
  }
  
  db.select('id', 'email')
    .from('users')
    .where({'email': email})
    .then(user => {
      if (user[0]===undefined) {
        let passwordEnc = bcrypt.hashSync(password, 10);
        checkIfEmailExistsInRedis(name, email, passwordEnc, req, res)
      } else {
        throw new Error(messageToSend)
      }
    })
    .catch(err => {
      if(err) {
        return res.status(200).json(messageToSend)
      }
    })
}

const checkIfEmailExistsInRedis = (name, email, passwordEnc, req, res) => {
  const randomId = randomIdFunc();
  let someKeys = ['randomId', 'name', email, 'password', 'email']
  let someVals = [randomId, name, email, passwordEnc, email] 

  redisHelper.keyExists(email)
  .then(x=>{
    // register only if key does not exist, represented by "x" here.
    if(x===0) {
      console.log(x)
      // this block will only run if key does not exist in redis
      redisHelper.setMultipleValuesWithEx(someKeys, someVals)
      .then(check=>{
        console.log(check)
        if (check===true) {
          handleSendingEmailConfirmation(randomId, req, res)
        } 
      })
      .catch(err=>{
        console.log(err + ' from line 61')
        if (err) {
          res.status(400).json('Internal error #1')
        }
      })
    } else {
      throw new Error('key already exists')
    }
  })
  .catch(()=> {
    return res.status(200).json(messageToSend)
  })
}

module.exports = {
  handleRegisterWithEmail: handleRegisterWithEmail
}