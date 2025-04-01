import nodemailer from 'nodemailer'
import { config } from './config'

const transporter = nodemailer.createTransport({
  host: config.email.smtp.HOST,
  port: config.email.smtp.PORT,
  secure: true,
  auth: {
    user: config.email.smtp.auth.USER,
    pass: config.email.smtp.auth.PASS,
  },
})

const sendEmail = (mail: Record<string, any>) => {
  const mailOptions = {
    from: `Mega-Automotives ${config.email.FROM}`,
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
