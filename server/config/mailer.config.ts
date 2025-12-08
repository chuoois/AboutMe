import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendOtpEmail = async (to: string, code: string) => {
  try {
    await transporter.sendMail({
      from: `"Support Team" <${process.env.MAIL_USER}>`,
      to,
      subject: "Mã xác thực đăng nhập (OTP)",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Mã xác thực của bạn</h2>
          <p>Xin chào, mã OTP để đăng nhập của bạn là:</p>
          <h1 style="color: #4CAF50; letter-spacing: 5px;">${code}</h1>
          <p>Mã này sẽ hết hạn sau <strong>5 phút</strong>.</p>
          <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Lỗi gửi mail:", error);
    throw new Error("EMAIL_SEND_FAILED");
  }
};