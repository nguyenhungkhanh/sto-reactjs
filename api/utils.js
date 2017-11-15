import express from 'express';
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
import fs from 'fs';

let router = express.Router();

router.post('/send-email', (req, res) => {

  console.log(req.body);
  const timeString = new Date();
  const time = `${timeString.getDate()}/${timeString.getMonth() + 1}/${timeString.getFullYear()} 
                - ${timeString.getHours()}:${timeString.getMinutes()}`;
  let body = `From: <b>${req.body.name}</b> - <b>${req.body.email}</b><br>
    Message: <b>${req.body.message}</b><br>
    Time: ${time}<br>
  `;

  var transporter = nodemailer.createTransport(smtpTransport({
      service: 'gmail',
      auth: {
          user: 'daubattu@gmail.com',
          pass: 'khanhtrang'
      }
  }));

  var mailOptions = {
    from: 'nhk020996@gmail.com',
    to: 'daubattu@gmail.com',
    subject: req.body.subject,
    html: body
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      res.status(500).json(error);
    } else {
      res.status(200).json({success: 'ok'});
    }
  });
})

router.put('/delete-image', (req, res) => {
  req.body.map((filename) => {
    fs.unlink(`./public${filename}`, (err) => {
      if(err) res.status(400).json(err);
      else res.status(200).json({success: true});
    })
  })
});
export default router;
