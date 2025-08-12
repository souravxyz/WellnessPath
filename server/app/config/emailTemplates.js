export const getVerifyEmailTemplate = (name, verifyURL) => ({
  subject: "Confirm Your WellNest Email",
  html: `
    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background: #4CAF93; padding: 25px 20px; text-align: center;">
        <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 600;">WellNest</h1>
        <p style="margin: 5px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Find Your Calm</p>
      </div>
      
      <div style="padding: 30px 25px;">
        <h2 style="margin-top: 0; font-size: 20px; color: #111827;">Hi ${name},</h2>
        <p style="font-size: 16px; line-height: 1.5; margin-bottom: 25px;">Welcome to WellNest! Please confirm your email address to access all features and share your wellness sessions.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyURL}" style="display: inline-block; padding: 12px 30px; background-color: #4CAF93; color: white; text-decoration: none; border-radius: 4px; font-weight: 500; font-size: 16px;">Confirm Email</a>
        </div>
        
        <p style="font-size: 14px; color: #6b7280; line-height: 1.5; margin-bottom: 0;">
          If you didn’t create this account, you can safely ignore this message.
        </p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0 0 5px;">© ${new Date().getFullYear()} WellNest. All rights reserved.</p>
        <p style="margin: 0; font-size: 11px;">Wellness for Everyone • Mind • Body • Community</p>
      </div>
    </div>
  `,
});

export const getWelcomeEmailTemplate = (name) => ({
  subject: "Welcome to WellNest!",
  html: `
    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background: #4CAF93; padding: 25px 20px; text-align: center;">
        <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 600;">WellNest</h1>
      </div>
      
      <div style="padding: 30px 25px; text-align: center;">
        <div style="margin-bottom: 25px;">
          <img src="https://cdn-icons-png.flaticon.com/512/3106/3106911.png" alt="WellNest Logo" width="60" />
        </div>
        
        <h2 style="margin: 0 0 15px; font-size: 22px; color: #111827;">Welcome, ${name}!</h2>
        <p style="font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
          Your WellNest account is now active. Start your journey toward a calmer, healthier you.
        </p>
        
        <div style="background: #f0f7f5; padding: 15px; border-radius: 6px; text-align: left; margin: 25px 0;">
          <h3 style="margin: 0 0 10px; font-size: 16px; color: #4CAF93;">Here’s how to begin:</h3>
          <ol style="margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">Explore public wellness sessions</li>
            <li style="margin-bottom: 8px;">Create your own guided session</li>
            <li>Invite friends to join your journey</li>
          </ol>
        </div>
        
        <a href="https://wellnest.com/dashboard" style="display: inline-block; padding: 12px 30px; background-color: #4CAF93; color: white; text-decoration: none; border-radius: 4px; font-weight: 500; font-size: 16px; margin-top: 15px;">Go to Dashboard</a>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0;">© ${new Date().getFullYear()} WellNest — Wellness for All</p>
      </div>
    </div>
  `,
});

export const getPasswordResetEmail = (name, resetLink) => ({
  subject: "Reset Your WellNest Password",
  html: `
    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background: #4CAF93; padding: 25px 20px; text-align: center;">
        <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 600;">WellNest</h1>
      </div>
      
      <div style="padding: 30px 25px;">
        <h2 style="margin-top: 0; font-size: 20px; color: #111827;">Password Reset Request</h2>
        <p style="font-size: 16px; line-height: 1.5;">Hi ${name}, we received a request to reset your WellNest password.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="display: inline-block; padding: 12px 30px; background-color: #d83a3a; color: white; text-decoration: none; border-radius: 4px; font-weight: 500; font-size: 16px;">Reset Password</a>
        </div>
        
        <p style="font-size: 14px; color: #6b7280; line-height: 1.5; margin-bottom: 5px;">
          <strong>This link will expire in 15 minutes.</strong>
        </p>
        <p style="font-size: 14px; color: #6b7280; line-height: 1.5;">
          If you didn’t request this change, please update your password immediately.
        </p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0;">For your security, WellNest never asks for your password via email.</p>
      </div>
    </div>
  `,
});

export const getPasswordChangedNotification = (name) => ({
  subject: "Your WellNest Password Was Changed",
  html: `
    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background: #4CAF93; padding: 25px 20px; text-align: center;">
        <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 600;">WellNest</h1>
      </div>
      
      <div style="padding: 30px 25px;">
        <h2 style="margin-top: 0; font-size: 20px; color: #111827;">Password Updated</h2>
        <p style="font-size: 16px; line-height: 1.5;">Hi ${name}, this is confirmation that your WellNest password was successfully changed.</p>
        
        <div style="background: #f0f7f5; padding: 15px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #4CAF93;">
          <p style="margin: 0; font-size: 14px; color: #4CAF93;">
            <strong>Security Tip:</strong> Use a unique password for each online account.
          </p>
        </div>
        
        <p style="font-size: 14px; color: #6b7280; line-height: 1.5; margin-bottom: 0;">
          If you didn’t make this change, please 
          <a href="mailto:security@wellnest.com" style="color: #4CAF93;">contact our security team</a> immediately.
        </p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0;">© ${new Date().getFullYear()} WellNest — Wellness for All</p>
      </div>
    </div>
  `,
});
