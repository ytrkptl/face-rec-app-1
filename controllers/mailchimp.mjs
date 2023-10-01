import got from 'got';

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const handleSubscribe = async (req, res) => {
  const { firstName, lastName, email } = req.body;

  // Make sure fields are filled
  if (!firstName || !lastName || !email) {
    res.status(400).json('fields missing');
    return;
  }

  // Construct req data
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const postData = JSON.stringify(data);

  // Set options for the request
  const options = {
    url: 'https://us19.api.mailchimp.com/3.0/lists/f18811df03',
    method: 'POST',
    headers: {
      Authorization: `auth ${process.env.MAILCHIMP_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: postData
  };

  // Make the request
  try {
    const response = await got(options);
    if (response.statusCode === 200) {
      res.status(200).json('Sent the email');
    } else {
      res.status(400).json('could not (failed) send the email');
    }
  } catch (error) {
    console.error(error);
    res.status(400).json('could not send the email');
  }
}

export default { handleSubscribe };
