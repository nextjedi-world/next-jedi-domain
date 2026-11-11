const SPREADSHEET_ID = '12AYvWgUP6JIYHz3ehbVABTEadzQp6w9ruKn6Qs-UTcs';
const WAITLIST_SHEET = 'Waitlist';
const SUPPORT_SHEET = 'Support';

// ── Web App Endpoint ──────────────────────────────────────────────────────────
// The site POSTs text/plain (a CORS simple request, no preflight) and reads this JSON reply:
//   { ok: true }  or  { ok: false, error: '...' }
// Every code path must return one of those, because the site treats anything else as a failure.

const MAX_FIELD_LEN = 5000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function str_(v) {
  return v === undefined || v === null ? '' : String(v).trim();
}

// Spreadsheet formula injection: a cell starting with = + - @ is evaluated by Sheets.
function cell_(v) {
  const s = str_(v).slice(0, MAX_FIELD_LEN);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function validate_(data) {
  if (!data || typeof data !== 'object') return 'Invalid request';
  if (data.type === 'waitlist') {
    if (str_(data.name).length < 2) return 'Name is required';
    if (!EMAIL_RE.test(str_(data.email))) return 'A valid email is required';
  } else if (data.type === 'support') {
    if (str_(data.name).length < 2) return 'Name is required';
    if (!EMAIL_RE.test(str_(data.email))) return 'A valid email is required';
    if (!str_(data.message)) return 'Message is required';
  } else if (data.type === 'idea') {
    if (!str_(data.description)) return 'Description is required';
  } else {
    return 'Unknown form type';
  }
  return null;
}

function getTab_(ss, name, headers) {
  const tab = ss.getSheetByName(name) || ss.insertSheet(name);
  if (tab.getLastRow() === 0) tab.appendRow(headers);
  return tab;
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents)
      return json_({ ok: false, error: 'Empty request' });

    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return json_({ ok: false, error: 'Invalid JSON' });
    }

    const invalid = validate_(data);
    if (invalid) return json_({ ok: false, error: invalid });

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const ts = new Date().toISOString();

    if (data.type === 'waitlist') {
      const tab = getTab_(ss, WAITLIST_SHEET, ['Timestamp', 'Name', 'Email', 'Feature Request']);
      tab.appendRow([ts, cell_(data.name), cell_(data.email), cell_(data.feature)]);
      try {
        sendWaitlistEmail_(str_(data.name), str_(data.email));
      } catch (mailErr) {
        console.error('Email failed for ' + data.email + ': ' + mailErr.toString());
      }
    } else if (data.type === 'support') {
      const tab = getTab_(ss, SUPPORT_SHEET, ['Timestamp', 'Name', 'Email', 'App', 'Message']);
      tab.appendRow([
        ts,
        cell_(data.name),
        cell_(data.email),
        cell_(data.app),
        cell_(data.message),
      ]);
    } else if (data.type === 'idea') {
      const tab = getTab_(ss, 'Ideas', ['Timestamp', 'Description']);
      tab.appendRow([ts, cell_(data.description)]);
    }

    return json_({ ok: true });
  } catch (err) {
    console.error(err.toString());
    return json_({ ok: false, error: 'Server error' });
  }
}

// ── Test (run manually from IDE, then delete) ─────────────────────────────────

function testEmail() {
  try {
    sendWaitlistEmail_('Test User', 'arunabhmaster@gmail.com');
    console.log('Email sent successfully');
  } catch (err) {
    console.log('ERROR: ' + err.toString());
  }
}

// ── Waitlist Confirmation Email ───────────────────────────────────────────────

function sendWaitlistEmail_(name, email) {
  const firstName = name.split(' ')[0];
  const subject = "You're in — Project Aurora early access confirmed";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f4f4f8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f8;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#3525cd 0%,#4f46e5 60%,#7c3aed 100%);border-radius:16px 16px 0 0;padding:48px 40px 40px;text-align:center;">
              <p style="margin:0 0 24px;font-size:13px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.6);">Next Jedi</p>
              <h1 style="margin:0 0 12px;font-size:36px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;line-height:1.1;">Project Aurora</h1>
              <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.75);font-weight:500;">Early Access Confirmed</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:48px 40px;">

              <p style="margin:0 0 24px;font-size:17px;color:#1a1a2e;font-weight:600;">Hey ${firstName},</p>

              <p style="margin:0 0 20px;font-size:15px;color:#4a4a6a;line-height:1.75;">
                You're officially on the Aurora waitlist. You've joined a small circle of builders who get to shape what we build next — and unlock early access to <strong style="color:#3525cd;">all our apps</strong> before anyone else sees them.
              </p>

              <p style="margin:0 0 32px;font-size:15px;color:#4a4a6a;line-height:1.75;">
                Every app we ship — you'll be first in line. We'll reach out personally when your access is ready. Until then, know that your input matters — every feature request, every idea gets read by the team.
              </p>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="border-top:1px solid #ebebf5;"></td>
                </tr>
              </table>

              <!-- What's next -->
              <p style="margin:0 0 20px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#9090b0;">What happens next</p>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 0 20px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:36px;vertical-align:top;">
                          <div style="width:28px;height:28px;border-radius:50%;background:#f0eeff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#3525cd;text-align:center;line-height:28px;">1</div>
                        </td>
                        <td style="padding-left:12px;vertical-align:top;">
                          <p style="margin:4px 0 0;font-size:14px;color:#1a1a2e;font-weight:600;">We review your feature request</p>
                          <p style="margin:4px 0 0;font-size:13px;color:#6a6a8a;line-height:1.6;">Your input directly influences our roadmap.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 20px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:36px;vertical-align:top;">
                          <div style="width:28px;height:28px;border-radius:50%;background:#f0eeff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#3525cd;text-align:center;line-height:28px;">2</div>
                        </td>
                        <td style="padding-left:12px;vertical-align:top;">
                          <p style="margin:4px 0 0;font-size:14px;color:#1a1a2e;font-weight:600;">Early access opens</p>
                          <p style="margin:4px 0 0;font-size:13px;color:#6a6a8a;line-height:1.6;">You'll get a personal invite to all our apps before the public launch.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:36px;vertical-align:top;">
                          <div style="width:28px;height:28px;border-radius:50%;background:#f0eeff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#3525cd;text-align:center;line-height:28px;">3</div>
                        </td>
                        <td style="padding-left:12px;vertical-align:top;">
                          <p style="margin:4px 0 0;font-size:14px;color:#1a1a2e;font-weight:600;">Shape what gets built</p>
                          <p style="margin:4px 0 0;font-size:13px;color:#6a6a8a;line-height:1.6;">Test, give feedback, and watch your ideas come to life.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f4f4f8;border-radius:0 0 16px 16px;padding:32px 40px;text-align:center;border-top:1px solid #ebebf5;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#3525cd;letter-spacing:0.05em;">Next Jedi</p>
              <p style="margin:0;font-size:12px;color:#9090b0;line-height:1.6;">
                You're receiving this because you signed up for Project Aurora early access.<br/>
                If this wasn't you, you can safely ignore this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

  GmailApp.sendEmail(email, subject, '', { htmlBody: html, name: 'Next Jedi' });
}
