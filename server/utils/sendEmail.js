const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Jonathan Happy <${process.env.EMAIL_FROM}>`;
  }

  send(template, subject) {
    let transporter;

    if (process.env.NODE_ENV === "production") {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD,
        },
      });
    } else {
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }

    const dir = `${__dirname}/../views`;

    transporter.use(
      "compile",
      hbs({
        viewEngine: {
          extname: ".hbs",
          layoutsDir: `${dir}/layouts/`,
          defaultLayout: "email",
          partialsDir: `${dir}/partials/`,
        },
        viewPath: `${dir}/email/`,
        extName: ".hbs",
      })
    );

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      template,
      context: {
        firstName: this.firstName,
        url: this.url,
        subject,
      },
    };

    transporter.sendMail(mailOptions);
  }

  sendWelcome() {
    this.send("welcome", "Welcome to the Natours Family!");
  }

  sendPasswordReset() {
    this.send(
      "passwordReset",
      "Your password reset token (valid for 10 minutes)"
    );
  }
};
