import nodemailer from 'nodemailer'

const sendEmail = (mail: Record<string, string>) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  const mailOptions = {
    from: `Mega-Automotives ${process.env.EMAIL_FROM}`,
    to: mail.to,
    subject: mail.subject,
    html: `
            <div style="margin: 20px; background: #fff; border-radius: 10px; padding: 20px 10px; box-shadow: 0px 4px 10px gray">
                ${mail.html}
            </div>
        `,
  }

  return transporter.sendMail(mailOptions)
}

export { sendEmail }
