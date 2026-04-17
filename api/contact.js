export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, vessel, vessel_type, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const html = `
    <h2 style="color:#0f2a4a;">New Enquiry — Marine Compliance Solutions</h2>
    <table style="border-collapse:collapse;width:100%;max-width:500px;">
      <tr><td style="padding:6px 12px 6px 0;font-weight:600;color:#555;white-space:nowrap;">Name</td><td style="padding:6px 0;">${escHtml(name)}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;font-weight:600;color:#555;white-space:nowrap;">Email</td><td style="padding:6px 0;"><a href="mailto:${escHtml(email)}">${escHtml(email)}</a></td></tr>
      <tr><td style="padding:6px 12px 6px 0;font-weight:600;color:#555;white-space:nowrap;">Phone</td><td style="padding:6px 0;">${escHtml(phone) || '—'}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;font-weight:600;color:#555;white-space:nowrap;">Vessel Name</td><td style="padding:6px 0;">${escHtml(vessel) || '—'}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;font-weight:600;color:#555;white-space:nowrap;">Vessel Type</td><td style="padding:6px 0;">${escHtml(vessel_type) || '—'}</td></tr>
    </table>
    <h3 style="color:#0f2a4a;margin-top:24px;">Message</h3>
    <p style="white-space:pre-wrap;color:#333;">${escHtml(message)}</p>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'MCS Website <noreply@marinecompliancesolutions.co.uk>',
        to: ['admin@marinecompliancesolutions.co.uk'],
        reply_to: email,
        subject: `Enquiry — ${vessel || name}`,
        html,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error('Resend error:', err);
      return res.status(500).json({ error: 'Failed to send message' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Contact handler error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
