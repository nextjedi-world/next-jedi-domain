/**
 * Aurora waitlist confirmation email.
 *
 * Ported from aurora-backend/Code.js (sendWaitlistEmail_). Pure render
 * function: no sending code lives here.
 */

export interface WaitlistConfirmationData {
  name: string;
  email: string;
}

export interface RenderedEmail {
  subject: string;
  html: string;
}

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
}

export const WAITLIST_SUBJECT = "You're in — Project Aurora early access confirmed";

export function renderWaitlistConfirmation(data: WaitlistConfirmationData): RenderedEmail {
  const firstName = (data.name ?? '').trim().split(/\s+/)[0] || 'there';
  const html = `<!DOCTYPE html>
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

              <p style="margin:0 0 24px;font-size:17px;color:#1a1a2e;font-weight:600;">Hey ${escapeHtml(firstName)},</p>

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
  return { subject: WAITLIST_SUBJECT, html };
}
