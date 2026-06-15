import { config } from './config.js'

// Sends a "new lead" alert email to the Bellamar team via Resend (https://resend.com).
// Uses native fetch — no extra dependency. If RESEND_API_KEY / LEAD_NOTIFY_TO are
// not configured, it logs and skips gracefully (so leads are still saved).
export async function notifyNewLead(lead) {
  if (!config.resendApiKey || !config.leadNotifyTo) {
    console.warn('[email] new-lead notification skipped — set RESEND_API_KEY and LEAD_NOTIFY_TO')
    return { sent: false, reason: 'not-configured' }
  }

  const when = new Date().toLocaleString('en-GB', { timeZone: 'Europe/Zagreb' })
  const safe = (v) => String(v || '—').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1d2b33">
      <div style="background:linear-gradient(135deg,#0c2733,#17475a);padding:22px 24px;border-radius:14px 14px 0 0">
        <h2 style="margin:0;color:#c9a45f;font-family:Georgia,serif">Bellamar Housing</h2>
        <p style="margin:4px 0 0;color:#dfe7ea;font-size:13px">New lead from your website chatbot</p>
      </div>
      <div style="border:1px solid #e7e0d2;border-top:none;border-radius:0 0 14px 14px;padding:24px">
        <p style="margin:0 0 16px;font-size:15px">A visitor just shared their details:</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:8px 0;color:#6a7780;width:110px">Name</td><td style="padding:8px 0;font-weight:600">${safe(lead.name)}</td></tr>
          <tr><td style="padding:8px 0;color:#6a7780">Email</td><td style="padding:8px 0"><a href="mailto:${safe(lead.email)}">${safe(lead.email)}</a></td></tr>
          <tr><td style="padding:8px 0;color:#6a7780">Interested in</td><td style="padding:8px 0">${safe(lead.interest)}</td></tr>
          <tr><td style="padding:8px 0;color:#6a7780">Language</td><td style="padding:8px 0">${safe((lead.language || 'en').toUpperCase())}</td></tr>
          <tr><td style="padding:8px 0;color:#6a7780">Received</td><td style="padding:8px 0">${safe(when)} (Zagreb)</td></tr>
        </table>
        <a href="mailto:${safe(lead.email)}" style="display:inline-block;margin-top:18px;background:#0c2733;color:#fff;text-decoration:none;padding:11px 20px;border-radius:10px;font-weight:600;font-size:14px">Reply to ${safe(lead.name)}</a>
        <p style="margin:18px 0 0;color:#9aa4a9;font-size:12px">Reach out promptly so this lead doesn't go cold.</p>
      </div>
    </div>`

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: config.leadNotifyFrom,
        to: [config.leadNotifyTo],
        reply_to: lead.email || undefined,
        subject: `🏠 New lead: ${lead.name || 'Website visitor'}${lead.interest ? ` — ${lead.interest}` : ''}`,
        html,
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      console.error('[email] Resend error:', data)
      return { sent: false, error: data }
    }
    console.log('[email] new-lead alert sent:', data.id)
    return { sent: true, id: data.id }
  } catch (err) {
    console.error('[email] send failed:', err?.message || err)
    return { sent: false, error: err?.message }
  }
}
