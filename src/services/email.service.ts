import { Payment } from '@prisma/client'
import { sendEmail } from '../config/email'

const sendPaymentVerificationMail = async (
  email: string,
  savedPayment: Payment
) => {
  return await sendEmail({
    to: email,
    subject: `Trip payment ${savedPayment.status}`,
    html: `<h3>Dear valued user,</h3>
            <br/>
            Thank you for booking a trip with Pemike Transports.
            <br/>
            Your trip payment was successful.
            <br/><br/>
            <a href="${process.env.ORIGIN_URL}/bookings/${savedPayment.bookingId}" 
                style="text-align:center;background:#4f5ddb;color:#fff;padding:6px 10px;font-size:16px;border-radius:3px;"
            >
                View Payment
            </a>
            <br/><br/>
            If you would like to place a complaint, click 
            <a href="mailto:${process.env.EMAIL_FROM}">here</a>.
            <br/><br/>
            <br/><br/>
            Warm Regards,
            <br/>
            Pemike Transports.
        `,
  })
}

export default {
  sendPaymentVerificationMail,
}
