package com.app.auth.template;

public class WelcomeEmailTemplate {

    private WelcomeEmailTemplate() {
    }

    public static String build(String fullName, String brandName) {
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Welcome to %s</title>
              <style>
                body { margin: 0; padding: 24px; background: #eef3f8; font-family: 'Segoe UI', Tahoma, sans-serif; color: #122033; }
                .card { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(18, 32, 51, 0.12); }
                .hero { padding: 40px; background: linear-gradient(135deg, #0f172a, #203f67); color: #ffffff; text-align: center; }
                .hero h1 { margin: 0 0 10px; font-size: 30px; font-weight: 800; }
                .body { padding: 36px 40px; }
                .body p { margin: 0 0 16px; font-size: 15px; line-height: 1.7; color: #475569; }
                .pill { display: inline-block; margin-top: 12px; padding: 10px 18px; border-radius: 999px; background: #e2f7f4; color: #0f766e; font-size: 13px; font-weight: 700; }
              </style>
            </head>
            <body>
              <div class="card">
                <div class="hero">
                  <h1>Welcome aboard</h1>
                  <p>Your email is verified and your account is ready.</p>
                </div>
                <div class="body">
                  <p>Hi %s,</p>
                  <p>Thanks for joining %s. Your registration is complete and your email address has been verified successfully.</p>
                  <span class="pill">Account activated</span>
                </div>
              </div>
            </body>
            </html>
            """.formatted(brandName, fullName, brandName);
    }
}
