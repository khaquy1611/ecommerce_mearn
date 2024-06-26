const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
// Hàm gửi email
const sendMail = asyncHandler(async ({ email, html, subject }) => {
  if (!email) throw new Error(`Thiếu trường email`);
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
  let info = await transporter.sendMail({
    from: `"Cuahangdientu" <no-reply@cuahangdientu.com>`,
    to: email,
    subject: subject,
    html: html,
  });
  return info;
});

module.exports = sendMail;
