package com.app.auth.template;

public class OtpEmailTemplate {

    private OtpEmailTemplate() {
    }

    public static String build(String recipientName, String otp, int expiryMinutes, String brandName) {
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Your Verification Code</title>
              <style>
                body { margin: 0; padding: 24px; background: #f2f5f8; font-family: 'Segoe UI', Tahoma, sans-serif; color: #122033; }
                .card { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(18, 32, 51, 0.12); }
                .header { padding: 32px 40px; background: linear-gradient(135deg, #0f172a, #174f58); color: #ffffff; }
                .header h1 { margin: 0; font-size: 24px; font-weight: 800; }
                .body { padding: 36px 40px; }
                .body p { margin: 0 0 16px; font-size: 15px; line-height: 1.65; color: #475569; }
                .otp-box { margin: 24px 0; padding: 24px; border-radius: 16px; border: 2px dashed #cbd5e1; background: #f8fafc; text-align: center; }
                .otp-code { font-size: 40px; letter-spacing: 10px; font-weight: 800; color: #0f172a; font-family: 'Courier New', monospace; }
                .meta { font-size: 13px; color: #64748b; margin-top: 10px; }
                .note { margin-top: 24px; padding: 14px 16px; border-radius: 12px; background: #fff7ed; color: #9a3412; font-size: 13px; }
                .footer { padding: 20px 40px 32px; font-size: 12px; color: #94a3b8; }
              </style>
            </head>
            <body>
              <div class="card">
                <div class="header">
                  <h1>%s</h1>
                </div>
                <div class="body">
                  <p>Hi %s,</p>
                  <p>Use the one-time password below to verify your email address and complete your account setup.</p>
                  <div class="otp-box">
                    <div class="otp-code">%s</div>
                    <div class="meta">This code expires in %d minutes.</div>
                  </div>
                  <p class="note">If you did not request this code, you can ignore this email.</p>
                </div>
                <div class="footer">
                  This is an automated message from %s.
                </div>
              </div>
            </body>
            </html>
            """.formatted(brandName, recipientName, otp, expiryMinutes, brandName);
    }
}
