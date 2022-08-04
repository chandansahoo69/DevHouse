const nodemailer = require("nodemailer");
// setting the dotenv file
// const dotenv = require("dotenv");
// dotenv.config();

class MailService {
  async sendMail(email, otp) {
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();

    //create a nodemailer transporter
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "respect09890@gmail.com",
        pass: "chandansahoo@123",
        // user: testAccount.user, // generated ethereal user
        // pass: testAccount.pass, // generated ethereal password
      },
    });
    //html template for mail
    const template = `<div class="flex items-center justify-center min-h-screen p-5 bg-blue-100 min-w-screen">
            <div class="max-w-xl p-8 text-center text-gray-800 bg-white shadow-xl lg:max-w-3xl rounded-3xl lg:p-12">
                <h3 class="text-2xl">Thanks for signing up.</h3>

                <p>We're happy you're here:<br/></p>
                <p>Yours devhouse OTP is:<br/></p>
                <h1 className="text-center text-blue-600 text-2xl font-mono font-semibold">${otp}</h1>
                <p>OTP will expire after 120 sec.<br/></p>
            </div>
        </div>`;

    //send out email through nodemailer
    const mailOptions = {
      from: "respect09890@gmail.com",
      to: email,
      subject: "Hello Dev.",
      //   text: `Yours devhouse OTP is ${otp}`,
      html: template,
    };

    transport.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        // console.log("email sent" + info.response);
      }
    });
  }
}

module.exports = new MailService();
