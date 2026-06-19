import nodemailer from 'nodemailer';

interface WelcomeEmailData {
  email: string;
  firstName?: string;
  username: string;
}

function createWelcomeEmailHtml(firstName: string, username: string): string {
  const displayName = firstName || username;
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Sportzal Fitness</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#2563eb,#1d4ed8);padding:40px 32px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;letter-spacing:-0.5px;">💪 Sportzal Fitness</h1>
              <p style="color:#bfdbfe;margin:8px 0 0;font-size:15px;">Your personal fitness companion</p>
            </td>
          </tr>
          <!-- Greeting -->
          <tr>
            <td style="padding:40px 32px 24px;">
              <h2 style="color:#111827;margin:0 0 12px;font-size:22px;">Welcome aboard, ${displayName}! 🎉</h2>
              <p style="color:#4b5563;margin:0;font-size:15px;line-height:1.6;">
                Thank you for joining Sportzal Fitness. Your account is ready and we're excited to help you reach your fitness goals.
              </p>
            </td>
          </tr>
          <!-- Features -->
          <tr>
            <td style="padding:0 32px 32px;">
              <p style="color:#374151;font-size:15px;font-weight:600;margin:0 0 16px;">Here's what you can do right now:</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:12px;background:#eff6ff;border-radius:8px;margin-bottom:8px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:22px;padding-right:12px;">🏋️</td>
                        <td>
                          <strong style="color:#1d4ed8;display:block;font-size:14px;">Exercise Library</strong>
                          <span style="color:#6b7280;font-size:13px;">Browse hundreds of exercises with GIF demonstrations</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>
                <tr>
                  <td style="padding:12px;background:#f0fdf4;border-radius:8px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:22px;padding-right:12px;">🤖</td>
                        <td>
                          <strong style="color:#16a34a;display:block;font-size:14px;">AI Workout Planner</strong>
                          <span style="color:#6b7280;font-size:13px;">Get personalized plans powered by AI</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>
                <tr>
                  <td style="padding:12px;background:#fff7ed;border-radius:8px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:22px;padding-right:12px;">🍎</td>
                        <td>
                          <strong style="color:#ea580c;display:block;font-size:14px;">Calorie Counter</strong>
                          <span style="color:#6b7280;font-size:13px;">Track daily nutrition with automatic food lookup</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>
                <tr>
                  <td style="padding:12px;background:#fdf4ff;border-radius:8px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:22px;padding-right:12px;">📊</td>
                        <td>
                          <strong style="color:#9333ea;display:block;font-size:14px;">BMI Calculator & Weight Tracker</strong>
                          <span style="color:#6b7280;font-size:13px;">Monitor your health metrics and progress over time</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- CTA -->
          <tr>
            <td style="padding:0 32px 40px;text-align:center;">
              <a href="${process.env.APP_URL || 'https://your-app.replit.app'}" 
                 style="display:inline-block;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;">
                Start Your Fitness Journey →
              </a>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:24px 32px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="color:#9ca3af;font-size:12px;margin:0;">
                © ${new Date().getFullYear()} Sportzal Fitness. All rights reserved.<br/>
                You received this email because you created an account with username <strong>${username}</strong>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });
}

export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
  const { email, firstName, username } = data;

  const transporter = createTransporter();
  if (!transporter) {
    console.log(`[Email] SMTP not configured — skipping welcome email for ${email}. Set SMTP_HOST, SMTP_USER, SMTP_PASS to enable.`);
    return;
  }

  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@sportzalfitness.com';

  try {
    await transporter.sendMail({
      from: `"Sportzal Fitness" <${fromAddress}>`,
      to: email,
      subject: 'Welcome to Sportzal Fitness! 💪',
      html: createWelcomeEmailHtml(firstName || '', username),
      text: `Welcome to Sportzal Fitness, ${firstName || username}!\n\nThank you for joining. Start exploring exercises, track your calories, use the AI workout planner, and monitor your BMI progress.\n\nHappy training!\nThe Sportzal Fitness Team`,
    });
    console.log(`[Email] Welcome email sent successfully to ${email}`);
  } catch (error: any) {
    console.error(`[Email] Failed to send welcome email to ${email}:`, error.message);
  }
}
