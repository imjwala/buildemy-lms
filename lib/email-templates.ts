import { env } from "./env";

export const generateOTPEmailTemplate = (otp: string, email: string) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - Buildemy</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        
        .logo {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }
        
        .header-subtitle {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 400;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .title {
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 16px;
            text-align: center;
        }
        
        .description {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 32px;
            text-align: center;
            line-height: 1.6;
        }
        
        .otp-container {
            background-color: #f9fafb;
            border: 2px dashed #d1d5db;
            border-radius: 12px;
            padding: 32px;
            text-align: center;
            margin: 32px 0;
        }
        
        .otp-label {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 12px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .otp-code {
            font-size: 36px;
            font-weight: 700;
            color: #1f2937;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
            background-color: #ffffff;
            padding: 16px 24px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            display: inline-block;
            margin: 0 auto;
        }
        
        .instructions {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 20px;
            border-radius: 8px;
            margin: 24px 0;
        }
        
        .instructions-title {
            font-size: 16px;
            font-weight: 600;
            color: #92400e;
            margin-bottom: 8px;
        }
        
        .instructions-list {
            color: #92400e;
            font-size: 14px;
            line-height: 1.6;
        }
        
        .instructions-list li {
            margin-bottom: 4px;
        }
        
        .security-note {
            background-color: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 8px;
            padding: 20px;
            margin: 24px 0;
        }
        
        .security-note-title {
            font-size: 14px;
            font-weight: 600;
            color: #0369a1;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
        }
        
        .security-note-text {
            font-size: 14px;
            color: #0369a1;
            line-height: 1.5;
        }
        
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        
        .footer-text {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 16px;
        }
        
        .footer-links {
            display: flex;
            justify-content: center;
            gap: 24px;
            margin-top: 16px;
        }
        
        .footer-link {
            color: #667eea;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
        }
        
        .footer-link:hover {
            text-decoration: underline;
        }
        
        .divider {
            height: 1px;
            background-color: #e5e7eb;
            margin: 24px 0;
        }
        
        @media (max-width: 600px) {
            .container {
                margin: 0;
                border-radius: 0;
            }
            
            .header, .content, .footer {
                padding: 24px 20px;
            }
            
            .otp-code {
                font-size: 28px;
                letter-spacing: 6px;
                padding: 12px 20px;
            }
            
            .footer-links {
                flex-direction: column;
                gap: 12px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Buildemy</div>
            <div class="header-subtitle">Your Learning Platform</div>
        </div>
        
        <div class="content">
            <h1 class="title">Verify Your Email Address</h1>
            <p class="description">
                Welcome to Buildemy! To complete your account setup and start your learning journey, 
                please verify your email address using the code below.
            </p>
            
            <div class="otp-container">
                <div class="otp-label">Your Verification Code</div>
                <div class="otp-code">${otp}</div>
            </div>
            
            <div class="instructions">
                <div class="instructions-title">📧 How to verify:</div>
                <ul class="instructions-list">
                    <li>Copy the 6-digit code above</li>
                    <li>Return to the verification page</li>
                    <li>Enter the code in the provided field</li>
                    <li>Click "Verify Email" to complete the process</li>
                </ul>
            </div>
            
            <div class="security-note">
                <div class="security-note-title">
                    🔒 Security Information
                </div>
                <div class="security-note-text">
                    This verification code will expire in 10 minutes for your security. 
                    If you didn't request this verification, please ignore this email.
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p class="footer-text">
                This email was sent to <strong>${email}</strong>
            </p>
            <div class="divider"></div>
            <div class="footer-links">
                <a href="#" class="footer-link">Help Center</a>
                <a href="#" class="footer-link">Contact Support</a>
                <a href="#" class="footer-link">Privacy Policy</a>
            </div>
            <p class="footer-text" style="margin-top: 16px; font-size: 12px;">
                © 2024 Buildemy. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
  `;
};

export const generateWelcomeEmailTemplate = (name: string, email: string) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Buildemy</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        
        .logo {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }
        
        .header-subtitle {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 400;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .title {
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 16px;
            text-align: center;
        }
        
        .welcome-message {
            font-size: 18px;
            color: #374151;
            margin-bottom: 24px;
            text-align: center;
        }
        
        .description {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 32px;
            text-align: center;
            line-height: 1.6;
        }
        
        .cta-container {
            text-align: center;
            margin: 32px 0;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            transition: transform 0.2s ease;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
        }
        
        .features {
            margin: 32px 0;
        }
        
        .feature {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            padding: 16px;
            background-color: #f9fafb;
            border-radius: 8px;
        }
        
        .feature-icon {
            font-size: 24px;
            margin-right: 16px;
        }
        
        .feature-text {
            font-size: 14px;
            color: #374151;
        }
        
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        
        .footer-text {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 16px;
        }
        
        @media (max-width: 600px) {
            .container {
                margin: 0;
                border-radius: 0;
            }
            
            .header, .content, .footer {
                padding: 24px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Buildemy</div>
            <div class="header-subtitle">Your Learning Platform</div>
        </div>
        
        <div class="content">
            <h1 class="title">Welcome to Buildemy! 🎉</h1>
            <p class="welcome-message">Hello ${name},</p>
            <p class="description">
                Your account has been successfully created and verified. You're now ready to start your learning journey with us!
            </p>
            
            <div class="cta-container">
                <a href="#" class="cta-button">Start Learning Now</a>
            </div>
            
            <div class="features">
                <div class="feature">
                    <div class="feature-icon">📚</div>
                    <div class="feature-text">Access to hundreds of courses</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">🎯</div>
                    <div class="feature-text">Personalized learning paths</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">🏆</div>
                    <div class="feature-text">Track your progress and earn certificates</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">👥</div>
                    <div class="feature-text">Join a community of learners</div>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p class="footer-text">
                This email was sent to <strong>${email}</strong>
            </p>
            <p class="footer-text" style="margin-top: 16px; font-size: 12px;">
                © 2024 Buildemy. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
  `;
};
export const generateAdminCredentialsEmail = (name: string, email: string, password: string) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Admin Account - Buildemy</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; color: #333; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { text-align: center; padding-bottom: 20px; }
    .header h1 { color: #10b981; }
    .content p { font-size: 16px; margin-bottom: 16px; }
    .credentials { background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; font-family: monospace; }
    .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Buildemy Admin!</h1>
    </div>
    <div class="content">
      <p>Hello ${name},</p>
      <p>Your admin account has been created. Use the credentials below to log in and manage the platform:</p>
      <div class="credentials">
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
      </div>
      <p>For security, please change your password after logging in for the first time.</p>
      <p style="text-align:center;">
        <a href="${env.BETTER_AUTH_URL}/login" class="cta-button">Login Now</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
};
