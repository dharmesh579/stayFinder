const forgotPasswordTemplate = (resetLink) => {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial,sans-serif;background:#f5f5f5;padding:40px;">

        <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:10px;text-align:center;">

          <h1 style="color:#2563eb;">🏨 StayFinder</h1>

          <h2>Reset Your Password</h2>

          <p>
            We received a request to reset your password.
          </p>

          <p>
            Click the button below to create a new password.
          </p>

          <a
            href="${resetLink}"
            style="
              display:inline-block;
              margin-top:20px;
              padding:14px 28px;
              background:#2563eb;
              color:white;
              text-decoration:none;
              border-radius:8px;
              font-weight:bold;
            "
          >
            Reset Password
          </a>

          <p style="margin-top:25px;color:#666;">
            This link expires in <strong>15 minutes</strong>.
          </p>

          <p style="font-size:14px;color:#888;">
            If you didn't request this, you can safely ignore this email.
          </p>

        </div>

      </body>
    </html>
  `;
};

export default forgotPasswordTemplate;
