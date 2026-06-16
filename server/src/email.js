import path from 'node:path'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import nodemailer from 'nodemailer'
import { config } from './config.js'

// -----------------------------------------------------------------------------
// Lead emails via Nodemailer (Gmail/Workspace SMTP).
// On every new lead we send TWO branded emails:
//   1. Team alert  -> LEAD_NOTIFY_TO (executive@bellamarinvest.com)
//   2. Confirmation -> the visitor's email
// The logo is embedded inline (CID) so it always renders, even with images off.
// -----------------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LOGO_PATH = path.join(__dirname, '..', 'assets', 'logo.png')
const LOGO_CID = 'bellamarlogo'
// Hosted fallback if the bundled file isn't available at runtime (e.g. on Vercel).
const HOSTED_LOGO_URL = 'https://bellamar-ai-real-estate-chatbot.vercel.app/logo.png'

// Load the logo once at startup. If present we embed it inline (CID — most
// reliable, shows even with remote images blocked); otherwise we use the URL.
const LOGO_BUFFER = (() => {
  try {
    return readFileSync(LOGO_PATH)
  } catch {
    return null
  }
})()
const LOGO_SRC = LOGO_BUFFER ? `cid:${LOGO_CID}` : HOSTED_LOGO_URL

const C = {
  navy: '#0c2733',
  navy2: '#17475a',
  gold: '#c9a45f',
  goldSoft: '#e7d4a8',
  cream: '#f4efe6',
  card: '#ffffff',
  ink: '#1d2b33',
  soft: '#6a7780',
  line: '#e7e0d2',
}

const esc = (v) =>
  String(v ?? '—').replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]))

let transporter = null
function getTransporter() {
  if (transporter) return transporter
  if (!config.smtpUser || !config.smtpPass) return null
  transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpPort === 465, // 465 = SSL, 587 = STARTTLS
    auth: { user: config.smtpUser, pass: config.smtpPass },
    // Bound the wait so a stuck connection can't hang a serverless request.
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  })
  return transporter
}

export async function verifyEmail() {
  const tx = getTransporter()
  if (!tx) return { ok: false, reason: 'not-configured' }
  await tx.verify()
  return { ok: true }
}

// Shared branded shell — email-safe (tables + inline styles), responsive-ish.
function shell({ preheader, tag, inner }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"></head>
<body style="margin:0;padding:0;background:${C.cream};">
  <span style="display:none;opacity:0;visibility:hidden;height:0;width:0;overflow:hidden">${esc(preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream};padding:28px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${C.card};border-radius:18px;overflow:hidden;box-shadow:0 10px 40px rgba(12,39,51,.12);font-family:Helvetica,Arial,sans-serif;">

        <!-- header -->
        <tr><td style="background:${C.navy};background-image:linear-gradient(135deg,${C.navy},${C.navy2});padding:30px 32px;" align="center">
          <img src="${LOGO_SRC}" width="64" alt="${esc(config.brandName)}" style="display:block;width:64px;height:auto;margin:0 auto 12px;">
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:700;color:#ffffff;letter-spacing:.5px;">${esc(config.brandName)}</div>
          <div style="margin-top:6px;display:inline-block;background:rgba(201,164,95,.18);color:${C.goldSoft};font-size:11px;letter-spacing:2px;text-transform:uppercase;padding:5px 14px;border-radius:999px;">${esc(tag)}</div>
        </td></tr>

        <!-- gold divider -->
        <tr><td style="height:4px;background:${C.gold};background-image:linear-gradient(90deg,${C.gold},${C.goldSoft},${C.gold});"></td></tr>

        <!-- body -->
        <tr><td style="padding:32px;color:${C.ink};font-size:15px;line-height:1.6;">${inner}</td></tr>

        <!-- footer -->
        <tr><td style="background:${C.navy};padding:22px 32px;" align="center">
          <div style="color:#ffffff;font-family:Georgia,serif;font-size:16px;font-weight:700;">${esc(config.brandName)}</div>
          <div style="color:rgba(255,255,255,.7);font-size:12px;margin-top:6px;line-height:1.7;">
            Split, Croatia &nbsp;·&nbsp; +385 95 374 4906<br>
            <a href="mailto:executive@bellamarinvest.com" style="color:${C.goldSoft};text-decoration:none;">executive@bellamarinvest.com</a>
            &nbsp;·&nbsp; <a href="https://bellamar-invest.com" style="color:${C.goldSoft};text-decoration:none;">bellamar-invest.com</a>
          </div>
          <div style="color:rgba(255,255,255,.4);font-size:11px;margin-top:12px;">Your Trusted Partner in Croatian Real Estate</div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`
}

function row(label, value) {
  return `<tr>
    <td style="padding:11px 0;border-bottom:1px solid ${C.line};color:${C.soft};font-size:13px;width:130px;vertical-align:top;">${esc(label)}</td>
    <td style="padding:11px 0;border-bottom:1px solid ${C.line};color:${C.ink};font-size:14px;font-weight:600;">${value}</td>
  </tr>`
}

function goldButton(href, text) {
  return `<a href="${href}" style="display:inline-block;background:${C.navy};color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:13px 26px;border-radius:10px;">${esc(text)}</a>`
}

// ---- Team alert email --------------------------------------------------------
function adminEmail(lead, when) {
  const inner = `
    <p style="margin:0 0 6px;font-size:20px;font-family:Georgia,serif;color:${C.navy};font-weight:700;">New lead from your website 🎉</p>
    <p style="margin:0 0 22px;color:${C.soft};">A visitor just shared their details through the AI assistant. Reach out promptly so the lead stays warm.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row('Name', esc(lead.name))}
      ${row('Email', `<a href="mailto:${esc(lead.email)}" style="color:${C.navy2};">${esc(lead.email)}</a>`)}
      ${row('Interested in', esc(lead.interest))}
      ${row('Language', esc(String(lead.language || 'en').toUpperCase()))}
      ${row('Received', esc(when) + ' (Zagreb)')}
    </table>
    <div style="margin-top:26px;">${goldButton(`mailto:${esc(lead.email)}?subject=${encodeURIComponent('Bellamar Housing — your enquiry')}`, `✉  Reply to ${esc((lead.name || '').split(' ')[0] || 'lead')}`)}</div>`
  return shell({
    preheader: `New lead: ${lead.name} — ${lead.interest || 'website enquiry'}`,
    tag: 'New Website Lead',
    inner,
  })
}

// ---- Visitor confirmation email ---------------------------------------------
function customerEmail(lead) {
  const first = (lead.name || '').split(' ')[0] || 'there'
  const inner = `
    <p style="margin:0 0 6px;font-size:20px;font-family:Georgia,serif;color:${C.navy};font-weight:700;">Thank you, ${esc(first)} 🌊</p>
    <p style="margin:0 0 16px;">We've received your enquiry and a member of the <strong>Bellamar Housing</strong> team will personally reach out to you very soon${lead.interest ? ` regarding <strong>${esc(lead.interest)}</strong>` : ''}.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream};border-radius:12px;margin:6px 0 20px;">
      <tr><td style="padding:16px 18px;color:${C.ink};font-size:14px;line-height:1.7;">
        <strong style="color:${C.navy};">What happens next?</strong><br>
        Our advisors will contact you with tailored options and answer any questions about properties, viewings, or investing on the Adriatic coast.
      </td></tr>
    </table>
    <p style="margin:0 0 4px;color:${C.soft};font-size:14px;">In the meantime, feel free to reach us directly:</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 0 22px;">
      ${row('Phone', '+385 95 374 4906')}
      ${row('Email', `<a href="mailto:executive@bellamarinvest.com" style="color:${C.navy2};">executive@bellamarinvest.com</a>`)}
      ${row('Location', 'Split, Croatia')}
    </table>
    <div>${goldButton('https://bellamar-invest.com', '🏠  Explore our properties')}</div>
    <p style="margin:24px 0 0;color:${C.soft};font-size:13px;">Warm regards,<br><strong style="color:${C.navy};">The Bellamar Housing Team</strong></p>`
  return shell({
    preheader: 'Thank you for contacting Bellamar Housing — we will be in touch shortly.',
    tag: 'Enquiry Received',
    inner,
  })
}

// Sends both emails. Best-effort and non-blocking for the caller.
export async function sendLeadEmails(lead) {
  const tx = getTransporter()
  if (!tx) {
    console.warn('[email] SMTP not configured — set SMTP_USER and SMTP_PASS')
    return { sent: false, reason: 'not-configured' }
  }

  const when = new Date().toLocaleString('en-GB', { timeZone: 'Europe/Zagreb' })
  const from = `"${config.brandName}" <${config.smtpUser}>`
  // Inline logo attachment only when we have the file; otherwise the HTML uses the hosted URL.
  const attachments = LOGO_BUFFER ? [{ filename: 'logo.png', content: LOGO_BUFFER, cid: LOGO_CID }] : []

  const jobs = []
  // 1) team alert
  jobs.push(
    tx.sendMail({
      from,
      to: config.leadNotifyTo,
      replyTo: lead.email || undefined,
      subject: `🏠 New lead: ${lead.name || 'Website visitor'}${lead.interest ? ` — ${lead.interest}` : ''}`,
      html: adminEmail(lead, when),
      attachments,
    }),
  )
  // 2) visitor confirmation
  if (lead.email) {
    jobs.push(
      tx.sendMail({
        from,
        to: lead.email,
        subject: 'Thank you for contacting Bellamar Housing 🌊',
        html: customerEmail(lead),
        attachments,
      }),
    )
  }

  const results = await Promise.allSettled(jobs)
  results.forEach((r, i) => {
    const which = i === 0 ? 'team-alert' : 'visitor-confirm'
    if (r.status === 'fulfilled') console.log(`[email] ${which} sent:`, r.value?.messageId)
    else console.error(`[email] ${which} failed:`, r.reason?.message || r.reason)
  })

  return { sent: results.some((r) => r.status === 'fulfilled') }
}
