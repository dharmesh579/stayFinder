const verifyEmailTemplate = (verificationLink) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Verify Your Email</title>
      </head>

      <body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:40px;">

        <div style="max-width:600px; margin:auto; background:white; padding:30px; border-radius:10px; text-align:center;">

          <h1 style="color:#2563eb;">
            🏨 StayFinder
          </h1>

          <h2>Welcome!</h2>

          <p>
            Thank you for registering with StayFinder.
          </p>

          <p>
            Please verify your email address to activate your account.
          </p>

          <a
            href="${verificationLink}"
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
            Verify Email
          </a>

          <p style="margin-top:30px; color:#666;">
            This verification link will expire in <strong>24 hours</strong>.
          </p>

          <p style="color:#999; font-size:14px;">
            If you didn't create this account, you can safely ignore this email.
          </p>

        </div>

      </body>
    </html>
  `;
};

export default verifyEmailTemplate;
