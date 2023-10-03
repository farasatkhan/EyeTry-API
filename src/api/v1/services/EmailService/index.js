const { google } = require("googleapis");
const nodemailer = require('nodemailer');
require('dotenv').config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.EMAIL_CLIENT_ID,
  process.env.EMAIL_CLIENT_SECRET,
  process.env.EMAIL_REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.EMAIL_REFRESH_TOKEN });

const sendEmail = async (giftcardCode, expirationDate, to) => {
  const ACCESS_TOKEN = await oAuth2Client.getAccessToken();
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      clientId: process.env.EMAIL_CLIENT_ID,
      clientSecret: process.env.EMAIL_CLIENT_SECRET,
      refreshToken: process.env.EMAIL_REFRESH_TOKEN,
      accessToken: ACCESS_TOKEN,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  const from = process.env.EMAIL;
  const subject = `Your Gift Card Code Inside!`;
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Gift Card Redemption</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f5f5f5;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 10px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          h1 {
              color: #333;
          }
          p {
              color: #666;
          }
          .code {
              font-size: 24px;
              color: #007bff;
          }
          .expire {
              font-weight: bold;
          }
          .footer {
              margin-top: 20px;
              font-size: 14px;
              color: #999;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>We're thrilled to share your Gift Card Code with you! 🎉</h1>
          <p>Gift Card Code: <span class="code">${giftcardCode}</span></p>
          <p>To redeem your Gift Card, simply follow these steps:</p>
          <ol>
              <li>Visit our website or store.</li>
              <li>Browse our fantastic selection of products/services.</li>
              <li>Add your chosen items to your cart.</li>
              <li>At checkout, enter your unique Gift Card Code.</li>
              <li>Watch your balance cover your purchase – it's that easy!</li>
          </ol>
          <p>This Gift Card Code is valid until <span class="expire">${expirationDate}</span>, so be sure to make the most of it before it expires.</p>
          <p>Thank you for choosing us for your gifting needs. We hope you find something truly special with your Gift Card.</p>
          <p class="footer">Happy shopping!</p>
      </div>
  </body>
  </html>
  `;
  return new Promise((resolve, reject) => {
    transport.sendMail({ from, subject, to, html }, (err, info) => {
      if (err) reject(err);
      resolve(info);
    });
  });
};

module.exports = { sendEmail };