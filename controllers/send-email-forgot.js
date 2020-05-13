"use strict";
const sgMail = require("@sendgrid/mail");
if (process.env.NODE_ENV !== "production") require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const handleSendingEmail = (someToken, req, res) => {
  const { yourEmail, name, message } = req.body;
  const msg = {
    to: `${email}`,
    from: `${process.env.AUTHOR_EMAIL}`,
    subject: `Yatrik's Face Recognition App - Confirmation`,
    html: `
      <table style="overflow-x:auto;width:100%;max-width:600px;border:1px solid black;margin:auto">
        <tr style="height:50px;background:lightgray">
          <th style="border-bottom:1px solid black;">Yatrik's Face Recognition App - Forgot Password Step 1</th>
        </tr>
        <tr style="overflow-x:auto;width:100%;border:1px solid black;background:#def;">
          <td style="padding:30px;">
            <p>Hi there,</p>
            <p>Did you forget your password? We're sorry to hear that. 
              Here is how you can retrieve it:  Simply copy and 
              paste the code provided below into the "resetId" input 
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
            <p style="font-style: italic">Ps...did you try using the <span style="color:red;">"toggle rain"</span> option at 
            the top-left of our site? If no, please do check it out 
            at <a href="https://new-face-rec-1.herokuapp.com/">this link</a>.</p>
          </td>
        </tr>
      </table>
  `,
  };

  sgMail
    .send(msg)
    .then((sent) => {
      return res.status(400)
        .send(`Something went wrong. Please use the following email
        address to send Yatrik an email: ${process.env.AUTHOR_EMAIL}`);
    })
    .catch((err) => {
      return res.status(200).send(`Your email was sent successfully. Yatrik will
        get back in touch with you as soon as possible. Thanks for your interest.`);
    });
};

module.exports = {
  handleSendingEmail,
};
