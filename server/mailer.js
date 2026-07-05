// OPTIZONE — outgoing email (admin OTP codes).
// Configure with a Gmail App Password (GMAIL_USER + GMAIL_APP_PASSWORD) or any
// SMTP server (SMTP_HOST/PORT/USER/PASS). When not configured, sends are
// skipped and the OTP is printed to the server log instead (so the owner can
// still sign in by reading the log, and never gets locked out).
const nodemailer = require('nodemailer')
const config = require('./config')

let transport = null

function mailEnabled() {
  return !!(config.mail.user && config.mail.pass)
}

function getTransport() {
  if (!transport && mailEnabled()) {
    transport = nodemailer.createTransport({
      host: config.mail.host,
      port: config.mail.port,
      secure: config.mail.port === 465,
      auth: { user: config.mail.user, pass: config.mail.pass },
    })
  }
  return transport
}

async function sendMail({ to, subject, text, html }) {
  if (!mailEnabled()) {
    console.log(`[mail] (not configured) would send to ${to}: ${subject} — ${text}`)
    return { skipped: true }
  }
  const t = getTransport()
  await t.sendMail({ from: `OPTIZONE <${config.mail.from}>`, to, subject, text, html })
  return { sent: true }
}

function otpEmail(code) {
  const subject = `${code} is your OPTIZONE admin code`
  const text = `Your OPTIZONE admin verification code is ${code}. It expires in ${config.admin.otpTtlMin} minutes. If you didn't request this, ignore this email.`
  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:440px;margin:0 auto;border:1px solid #E2DBCF;border-radius:10px;overflow:hidden">
    <div style="background:#274A3B;padding:22px;text-align:center">
      <span style="color:#FFFFFF;font-size:20px;letter-spacing:4px;font-weight:bold">OPTI<span style="color:#E08A2A">ZONE</span></span>
    </div>
    <div style="padding:26px;text-align:center">
      <p style="color:#3A342A;font-size:14px;margin:0 0 14px">Your admin verification code:</p>
      <div style="font-size:34px;letter-spacing:10px;font-weight:bold;color:#274A3B;padding:12px 0">${code}</div>
      <p style="color:#736A5C;font-size:12.5px;margin:14px 0 0">Expires in ${config.admin.otpTtlMin} minutes. If you didn't try to sign in, you can ignore this email.</p>
    </div>
  </div>`
  return { subject, text, html }
}

function resetEmail(code) {
  const subject = `${code} — reset your OPTIZONE password`
  const text = `Use this code to reset your OPTIZONE password: ${code}. It expires in 15 minutes. If you didn't request a reset, you can ignore this email.`
  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:440px;margin:0 auto;border:1px solid #E2DBCF;border-radius:10px;overflow:hidden">
    <div style="background:#274A3B;padding:22px;text-align:center">
      <span style="color:#FFFFFF;font-size:20px;letter-spacing:4px;font-weight:bold">OPTI<span style="color:#E08A2A">ZONE</span></span>
    </div>
    <div style="padding:26px;text-align:center">
      <p style="color:#3A342A;font-size:14px;margin:0 0 14px">Your password reset code:</p>
      <div style="font-size:34px;letter-spacing:10px;font-weight:bold;color:#274A3B;padding:12px 0">${code}</div>
      <p style="color:#736A5C;font-size:12.5px;margin:14px 0 0">Expires in 15 minutes. If you didn't request a reset, ignore this email — your password stays unchanged.</p>
    </div>
  </div>`
  return { subject, text, html }
}

module.exports = { sendMail, mailEnabled, otpEmail, resetEmail }
