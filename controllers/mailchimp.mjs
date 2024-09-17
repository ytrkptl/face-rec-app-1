// const request = require('request');
// if (process.env.NODE_ENV !== 'production') require('dotenv').config();

// const handleSubscribe = (req, res) => {
//   const { firstName, lastName, email } = req.body;

//   // Make sure fields are filled
//   if (!firstName || !lastName || !email) {
//     res.status(400).json('fields missing');
//     return;
//   }

//   // Construct req data
//   const data = {
//     members: [
//       {
//         email_address: email,
//         status: 'subscribed',
//         merge_fields: {
//           FNAME: firstName,
//           LNAME: lastName
//         }
//       }
//     ]
//   };

//   const postData = JSON.stringify(data);

//   const options = {
//     url: 'https://us19.api.mailchimp.com/3.0/lists/f18811df03',
//     method: 'POST',
//     headers: {
//       Authorization: `auth ${process.env.MAILCHIMP_API_KEY}`
//     },
//     body: postData
//   };

//   request(options, (err, response, body) => {
//     if (err) {
//       res.status(400).json('could not send the email');
//     } else {
//       if (response.statusCode === 200) {
//         res.status(200).json('Sent the email');
//       } else {
//         res.status(400).json('could not (failed) send the email');
//       }
//     }
//   });
// }

// module.exports = {
//   handleSubscribe
// }