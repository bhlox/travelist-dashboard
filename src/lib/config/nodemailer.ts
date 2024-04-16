import nodemailer from "nodemailer";
import env from "./env";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "kurkboard@gmail.com",
    pass: env.EMAIL_PW,
  },
});

export default transporter;
