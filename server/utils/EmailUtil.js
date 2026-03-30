// CLI: npm install nodemailer --save

const nodemailer = require('nodemailer');
const MyConstants = require('./MyConstants');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MyConstants.EMAIL_USER,
    pass: MyConstants.EMAIL_PASS,
  },
});

const EmailUtil = {
  send(email, id, token) {
    const text =
      'Thanks for signing up, please input these informations to activate your account:\n' +
      '\t.id: ' +
      id +
      '\n' +
      '\t.token: ' +
      token;

    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: MyConstants.EMAIL_USER,
        to: email,
        subject: 'Signup | Verification',
        text: text,
      };

      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  },
};

module.exports = EmailUtil;
