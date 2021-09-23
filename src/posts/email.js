import sgMail from "@sendgrid/mail";

// const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (content) => {
  const msg = {
    to: "btrearty@gmail.com",
    from: "btrearty@gmail.com",
    subject: "Sending with SendGrid is Fun",
    text: `${content}`,
    html: `<strong>${content}</strong>`,
  };
  await sgMail.send(msg);
};
