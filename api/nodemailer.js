const nodemailer = require("nodemailer");
 require('dotenv').config()


  const transporter = nodemailer.createTransport({
    service:"gmail",
    host:"smtp.gmail.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });
    
    
    // async..await is not allowed in global scope, must use a wrapper
    const main=async(to,subject,text)=> {
   
      // send mail with defined transport object
      try {
        const info = await transporter.sendMail({
          from: `streamin-app <${process.env.USER_EMAIL}>`, // sender address
          to: to,
          subject: subject, // Subject line
          text: text, // plain text body
        });
      
        console.log("Message sent");
      } catch (error) {
        console.log(error)
      }
      
    }
    
   module.exports = main



