import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/UserModel";
require("dotenv").config();

class SMTPemail {
  static _idActivation(req, res, next) {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.Email,
        pass: process.env.Password,
      },
    });
    const jwtSecret: any = process.env.JWT_Activate;
    const payload: any = { username: req.body.username, email: req.body.email }
    console.log(payload);
    const verifyingToken = jwt.sign(
      payload,
      jwtSecret
    );

    let mailOptions = {
      from: process.env.Email,
      to: req.body.email,
      subject: "ANN cup Account Activation",
      html: `       
            <div class="container" style="margin-left:20em; margin-top:2em;" >
                <img src="https://ci4.googleusercontent.com/proxy/1YMUt1mQSReQzSbnUG--EeEWALSsSh4PHGr2md7UDlYzGUc6W5KJUG87oO08cjmAWCE=s0-d-e1-ft#https://i.imgur.com/hB2n7OL.jpg" style="width: 40em; border-radius: 1em ; margin-bottom:0em;" alt="">
                <div style="background-color:#141414;border-radius: 1em; margin-top:0em; width:40em;">
                  <h4 style="color:cyan; word-wrap: break-word; width: 35em; padding:1em;">${verifyingToken}</h4>
                </div>
            </div>
        `,
    };

    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        res.json({ Error: err });
      } else {
        res.status(201).json({
          success: true,
          message: `Only one few step, a Verification code sent to ${req.body.email
            } on ${Date()}`,
          data: {
            username: req.body.username,
            email: req.body.email,
          },
        });
      }
    });
  }

  static forgotPassword(req, res, next) {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.Email,
        pass: process.env.Password,
      },
    });
    const jwtForgotPassword: any = process.env.JWT_ForgotPassword;
    const ForgotToken = jwt.sign({ email: req.body.email }, jwtForgotPassword);

    let mailOptions = {
      from: process.env.Email,
      to: req.body.email,
      subject: "Forgot Password token",
      html: `       
            <div class="container" style="margin-left:20em; margin-top:2em;" >
                <img src="https://ci4.googleusercontent.com/proxy/1YMUt1mQSReQzSbnUG--EeEWALSsSh4PHGr2md7UDlYzGUc6W5KJUG87oO08cjmAWCE=s0-d-e1-ft#https://i.imgur.com/hB2n7OL.jpg" style="width: 40em; border-radius: 1em ; margin-bottom:0em;" alt="">
                <div style="background-color:#141414;border-radius: 1em; margin-top:0em; width:40em;">
                  <h4 style="color:cyan; word-wrap: break-word; width: 35em; padding:1em;">${ForgotToken}</h4>
                </div>
            </div>
        `,
    };

    return User.updateOne(
      { email: req.body.email },
      { $set: { resetLink: ForgotToken } },
      (err, success) => {
        if (err) {
          throw { name: "INVALID_TOKEN" };
        } else {
          transporter.sendMail(mailOptions, function (err, data) {
            if (err) {
              res.json({ Error: err });
            } else {
              res
                .status(200)
                .send(
                  `Forgot password token sent to ${req.body.email} on ${Date()}`
                );
            }
          });
        }
      }
    );
  }
}

export default SMTPemail;
