"use strict";
const sgMail = require("@sendgrid/mail");
if (process.env.NODE_ENV !== "production") require("dotenv").config();
sgMail.setApiKey(process.env.FACE_REC_APP_1_SG_API_KEY);

const handleSendingEmailConfirmation = (someToken, req, res) => {
  const { email } = req.body;

  const msg = {
    to: `${email}`,
    from: `${process.env.AUTHOR_EMAIL}`,
    subject: `Yatrik's Face Recognition App - Confirmation`,
    html: `
    <body style="padding:0;margin:0;">
      <table style="overflow-x:auto;width:100%;max-width:600px;border:1px solid black;margin:auto;">
        <tr style="height:50px;background:lightgray">
          <th style="border-bottom:1px solid black;">Yatrik's Face Recognition App - Confirmation </th>
        </tr>
        <tr style="overflow-x:auto;width:100%;border:1px solid black;background:#def;">
          <td style="padding:30px;">
            <p>Hello,</p>
            <p>Welcome to Yatrik's Face Recognition App!</p>
            <p>Thank you for signing up. There is one last step to complete the sign-up process though: Simply copy and 
              paste the code provided below into the "Confirmation" input 
              provided on our site.
            <p>
            <table>
              <tr>
                <td style="background-color:lightgray;padding:10px;cursor:pointer;">
                  <h3 style="padding:auto;margin:auto">${someToken}</h3>
                </td>
              </tr>
            </table>
            <p>Thank you!<br/>-Yatrik Patel</p>
          </td>
        </tr>
      </table>
    </body>
  `,
  };

  sgMail
    .send(msg)
    .then((sent) => {
      return res.status(200)
        .json(`If the email you provided is valid, you'll receive a 6-digit code 
        from us within the next 5 minutes. Please enter that 6-digit code below.`);
    })
    .catch((err) => {
      console.log(err);
      return res.status(400)
        .json(`Something went wrong while sending a message to the email you provided.
               Please use the following email address to contact us about this issue: ${process.env.AUTHOR_EMAIL}`);
    });
};

module.exports = {
  handleSendingEmailConfirmation,
};
