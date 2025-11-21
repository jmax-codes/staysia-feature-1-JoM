/**
 * Email Service Module
 * 
 * Handles sending verification and notification emails via Resend.
 */

import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface VerificationEmailProps {
  email: string;
  name: string;
  url: string;
  token?: string;
}

export async function sendVerificationEmail({
  email,
  name,
  url,
}: VerificationEmailProps) {
  if (!resend) {
    console.warn('⚠️  RESEND_API_KEY not configured - skipping verification email');
    console.log(`📧 Would have sent verification email to: ${email}`);
    console.log(`🔗 Verification URL: ${url}`);
    return { success: true, skipped: true };
  }

  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Staysia <onboarding@resend.dev>',
      to: email,
      subject: 'Verify your email address - Staysia',
      html: getVerificationEmailTemplate(name, url),
      text: `Hi ${name},\n\nThank you for signing up for Staysia! Please verify your email address by clicking the link below:\n\n${url}\n\nThis link will expire in 24 hours.\n\nIf you didn't create this account, please ignore this email.`,
    });

    if (result.error) {
      console.error('Resend error:', result.error);
      throw new Error(`Failed to send verification email: ${result.error.message}`);
    }

    return result;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}

function getVerificationEmailTemplate(name: string, url: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6; 
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto;
            background: white;
          }
          .header { 
            background: linear-gradient(135deg, #283B73 0%, #1e2d5a 100%);
            padding: 30px 20px;
            text-align: center;
          }
          .logo {
            color: white;
            font-size: 32px;
            font-weight: bold;
            margin: 0;
          }
          .content {
            padding: 40px 30px;
          }
          .title {
            font-size: 24px;
            font-weight: bold;
            color: #283B73;
            margin: 0 0 20px 0;
          }
          .button { 
            background: #283B73;
            color: #fff !important;
            padding: 14px 30px;
            text-decoration: none;
            border-radius: 8px;
            display: inline-block;
            font-weight: 600;
            margin: 20px 0;
          }
          .button:hover {
            background: #1e2d5a;
          }
          .footer { 
            margin-top: 30px;
            padding: 20px 30px;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #eee;
            background: #fafafa;
          }
          .link-box {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            word-break: break-all;
          }
          .warning {
            color: #dc3545;
            font-size: 14px;
            margin-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">Staysia</h1>
          </div>
          <div class="content">
            <h2 class="title">Verify Your Email Address</h2>
            <p>Hi ${name},</p>
            <p>Thank you for signing up for Staysia! We're excited to have you on board.</p>
            <p>To complete your registration and start exploring amazing properties, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${url}" class="button">Verify Email Address</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <div class="link-box">
              <a href="${url}" style="color: #283B73; word-break: break-all;">${url}</a>
            </div>
            
            <p class="warning">⏰ This verification link will expire in 24 hours.</p>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">If you didn't create an account with Staysia, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p style="margin: 0 0 10px 0;"><strong>Staysia</strong> - Your trusted property rental platform</p>
            <p style="margin: 0; color: #999;">This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
