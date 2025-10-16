// backend/utils/sendEmail.js
const nodemailer = require("nodemailer");

// Gmail SMTP setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "pixelbluegfx@gmail.com",         // <-- Your Gmail
    pass: "aixe pxet satz rhst",           // <-- 16-char App Password
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Inventory System" <pixelbluegfx@gmail.com>`,
      to,
      subject,
      text,
    });
    console.log("Email sent successfully!");
  } catch (err) {
    console.error("Error sending email:", err.message);
  }
};

module.exports = sendEmail;
