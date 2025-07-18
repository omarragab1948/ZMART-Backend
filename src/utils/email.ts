import nodemailer from "nodemailer";

class Email {
  public to: string;
  public from: string;
  public firstName: string;
  public url: string;

  constructor(user: { name: string; email: string }, url: string) {
    this.to = user.email;
    this.from = process.env.EMAIL_USER as string;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
  }
  createTransporter() {
    return nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(subject: string, message: string) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: message,
    };

    try {
      const info = await this.createTransporter().sendMail(mailOptions);
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }
}
