import { Payment, User } from '@prisma/client'
import { sendEmail } from '../config/email'
import { config } from '../config/config'

const sendWelcomeMail = async (email: string, firstName: string) => {
  return await sendEmail({
    to: email,
    subject: 'Welcome to Pemike Transports!',
    html: `<h3>Hey ${firstName},</h3>
            <div>
              Welcome to Pemike Transports. It's great to meet you!
              Pemike Transport is your trusted partner for 24/7 transportation 
              and logistics services. We specialize in the seamless movement of 
              people and goods, ensuring reliability, safety, and efficiency at all times.
              <br/><br/>
              Your email has been confirmed and we are glad to have you journey with us.
              <br/><br/>
              Here are some of our services:
              <ul>
                  <li>✔ Round-the-Clock Availability</li>
                  <li>✔ Increased Flexibility</li>
                  <li>✔ Enhanced Reliability</li>
                  <li>✔ Customer Satisfaction</li>
                  <li>✔ Improved Emergency Support</li>
              </ul>
              <br/><br/>
              To know more about our services:
              <a href="${config.ORIGIN_URL}" 
                  style="text-align:center;background:#4f5ddb;color:#fff;padding:6px 10px;font-size:16px;border-radius:3px;"
              >
                  Explore
              </a>
            </div>
            <br/>
            Warm Regards,<br/>
            Pemike Transports Team.
        `,
  })
}

const sendEmailVerificationRequestMail = async (
  savedUser: User,
  otp: string
) => {
  return await sendEmail({
    to: savedUser.email,
    subject: 'Confirm your email address',
    html: `<h3>Hello, ${savedUser.firstName}</h3>
          <div>
            There's one quick step you need to complete for creating an account. 
            Let's make sure this is the right email address for you - 
            please confirm that this is the right address to use for your new account.
            Kindly use this OTP to get started on Pemike Transports:
            <br/><br/>
            <span style="margin:auto;background:#fff;color:#000;padding:6px 10px;font-size:30px;border-radius:3px;font-weight:bold;">
                ${otp}
            </span>
            <br/><br/>
            This OTP expires after ${config.OTP_EXPIRATION_MINUTES} minutes. Only enter this code on our official website.
            Don't share it with anyone. We'll never ask for it outside our official website.
          </div>
          <br/>
          Warm Regards,
          <br/>
          Pemike Transports Team.
      `,
  })
}

const sendForgotPasswordMail = async (email: string, otp: string) => {
  return await sendEmail({
    to: email,
    subject: 'Pemike Account Password Reset',
    html: `<h3>Dear valued user,</h3>
          You are receiving this email because you requested a password reset.
          Please use the following one-time password to reset your password:
            <br/><br/>
            <span style="margin:auto;background:#fff;color:#000;padding:6px 10px;font-size:30px;border-radius:3px;font-weight:bold;">
                ${otp}
            </span>
          <br/><br/>
          If you did not request this, kindly ignore.
          <br/><br/>
          Thanks,
          <br/>
          Pemike Transports.
      `,
  })
}

const sendPasswordChangedMail = async (email: string, firstName: string) => {
  return await sendEmail({
    to: email,
    subject: 'Your account password was changed!',
    html: `<h3>Hey ${firstName},</h3>
            <div>
              Please be informed that your user account password has been updated.
              <br/><br/>
              If this activity wasn't performed by you, please revoke the account password immediately.
              <br/><br/>
              <a href="${config.ORIGIN_URL}/profile/change-password" 
                  style="text-align:center;background:#4f5ddb;color:#fff;padding:6px 10px;font-size:16px;border-radius:3px;"
              >
                  Change Password
              </a>
            </div>
            <br/>
            Warm Regards, 
            <br/>
            Pemike Transport Team.
        `,
  })
}

const sendPaymentVerificationMail = async (
  email: string,
  savedPayment: Payment
) => {
  return await sendEmail({
    to: email,
    subject: `Trip payment successful`,
    html: `<h3>Dear valued user,</h3>
            <div>
              Thank you for booking a trip with Pemike Transports.
              <br/>
              Your trip payment was successful and your booking has been confirmed.
              <br/><br/>
              <a href="${config.ORIGIN_URL}/bookings/${savedPayment.bookingId}" 
                  style="text-align:center;background:#4f5ddb;color:#fff;padding:6px 10px;font-size:16px;border-radius:3px;"
              >
                  View Payment
              </a>
              <br/><br/>
              If you would like to place a complaint, click 
              <a href="mailto:${config.email.FROM}">here</a>.
            </div>
            <br/>
            Warm Regards,
            <br/>
            Pemike Transports.
        `,
  })
}

const sendUserVerificationOTP = async (email: string, otp: string) => {
  return await sendEmail({
    to: email,
    subject: `Account Verification Request`,
    html: `<h3>Hi ${email},</h3>
          <div>
            Let's make sure this is the right email address for you - 
            confirm that this is the right address to use for your details.
            Kindly use this OTP to continue on Pemike Transports:
            <br/><br/>
            <span style="margin:auto;background:#fff;color:#000;padding:6px 10px;font-size:30px;border-radius:3px;font-weight:bold;">
                ${otp}
            </span>
            <br/><br/>
            This OTP expires after ${config.OTP_EXPIRATION_MINUTES} minutes. Only enter this code on our official website.
            Don't share it with anyone. We'll never ask for it outside our official website.
          </div>
          <br/>
          Warm Regards,
          <br/>
          Pemike Transports Team.
        `,
  })
}

export default {
  sendWelcomeMail,
  sendEmailVerificationRequestMail,
  sendForgotPasswordMail,
  sendPasswordChangedMail,
  sendPaymentVerificationMail,
  sendUserVerificationOTP,
}
