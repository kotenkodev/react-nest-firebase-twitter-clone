export const getVerificationEmailHtml = (
  frontendUrl: string,
  oobCode: string,
) => {
  const verificationLink = `${frontendUrl}/verify-email?oobCode=${oobCode}`;
  const currentYear = new Date().getFullYear();

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Email</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    body {
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #f9fafb;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  </style>
</head>
<body style="font-family: 'Inter', system-ui, sans-serif; background-color: #f9fafb; margin: 0; padding: 0;">
  <div style="background-color: #f9fafb; padding: 40px 20px; min-height: 100vh;">
    <div style="max-width: 480px; margin: 0 auto;">
      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; vertical-align: middle;">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"/><path d="m20 7 2 .5-2 .5"/><path d="M10 18v3"/><path d="M14 17.75V21"/><path d="M7 18a6 6 0 0 0 3.84-10.61"/></svg>
        </div>
        <span style="font-size: 24px; font-weight: 800; color: #111827; letter-spacing: -0.03em; vertical-align: middle; font-family: 'Inter', sans-serif; line-height: 24px; display: inline-block;">
          Birb
        </span>
      </div>
      
      <!-- Content Card -->
      <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025);">
        <h1 style="font-size: 20px; font-weight: 700; color: #111827; margin-top: 0; margin-bottom: 12px; letter-spacing: -0.02em; text-align: center;">
          Verify your email address
        </h1>
        <p style="font-size: 15px; line-height: 1.625; color: #4b5563; margin-bottom: 24px; text-align: center;">
          Welcome to Birb! To start sharing nests and posts, please confirm your email address by clicking the button below.
        </p>
        
        <!-- Button -->
        <div style="text-align: center; margin-bottom: 28px;">
          <a href="${verificationLink}" 
             style="display: inline-block; background-color: #111827; color: #ffffff; font-size: 14px; font-weight: 600; padding: 14px 28px; text-decoration: none; border-radius: 10px; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); transition: background-color 0.2s;">
            Verify Email
          </a>
        </div>
        
        <!-- Fallback Link -->
        <div style="border-top: 1px solid #f3f4f6; padding-top: 20px;">
          <p style="font-size: 12px; line-height: 1.5; color: #6b7280; margin: 0; word-break: break-all; text-align: center;">
            If you're having trouble clicking the button, copy and paste this URL into your web browser:<br>
            <a href="${verificationLink}" style="color: #2563eb; text-decoration: none;">${verificationLink}</a>
          </p>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; margin-top: 24px;">
        <p style="font-size: 12px; color: #9ca3af; margin: 0;">
          © ${currentYear} Birb. All rights reserved.
        </p>
        <p style="font-size: 11px; color: #9ca3af; margin-top: 6px; line-height: 1.4;">
          If you didn't create an account on Birb, you can safely ignore this email.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
};
