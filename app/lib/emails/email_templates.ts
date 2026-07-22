export const welcomeEmail = (data: {
  name: string;
  companyName?: string;
  loginUrl?: string;
}): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Chari-T</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #ffffff; color: #000000; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #ffffff; }
    .header { border-bottom: 1px solid #000000; padding-bottom: 20px; margin-bottom: 30px; text-align: center; }
    .logo { max-width: 200px; height: auto; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto; }
    .header-title { font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #000000; margin-top: 8px; }
    .content { line-height: 1.6; color: #000000; }
    .content p { margin-bottom: 16px; }
    .button { display: inline-block; padding: 12px 32px; background: #000000; color: #ffffff !important; text-decoration: none; border-radius: 4px; font-weight: 500; margin: 20px 0; border: 1px solid #000000; }
    .button:hover { background: #333333; }
    .divider { border-top: 1px solid #000000; margin: 30px 0; }
    .footer { font-size: 12px; color: #000000; text-align: center; margin-top: 30px; }
    .footer a { color: #000000; }
    @media only screen and (max-width: 480px) { .container { padding: 20px 16px; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://chari-t.live/ct_logo_texts.png" alt="Chari-T Logo" class="logo">
      <div class="header-title">Crowdfunding Platform</div>
    </div>
    <div class="content">
      <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 16px; color: #000000;">Welcome, ${data.name}!</h1>
      <p>We're thrilled to have you on board at Chari-T. Your journey with us starts now.</p>
      ${data.companyName ? `<p>You've joined <strong>${data.companyName}</strong> as a valued member.</p>` : ''}
      <p>Here's what you can do next:</p>
      <ul style="padding-left: 20px; margin-bottom: 20px; color: #000000;">
        <li>Create a cause</li>
        <li>Explore campaigns to support</li>
        <li>Connect with the community</li>
      </ul>
      ${data.loginUrl ? `<a href="${data.loginUrl}" class="button">Get Started</a>` : ''}
      <p style="font-size: 14px; color: #000000;">If you have any questions, just reply to this email. We're here to help.</p>
    </div>
    <div class="divider"></div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Chari-T. All rights reserved.</p>
      <p>You're receiving this because you signed up with Chari-T.</p>
    </div>
  </div>
</body>
</html>
  `;
};

export const donationSuccessEmail = (data: {
  name: string;
  amount: string;
  campaignName: string;
  transactionId: string;
  date?: string;
  receiptUrl?: string;
}): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Donation Successful - Chari-T</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #ffffff; color: #000000; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #ffffff; }
    .header { border-bottom: 1px solid #000000; padding-bottom: 20px; margin-bottom: 30px; text-align: center; }
    .logo { max-width: 200px; height: auto; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto; }
    .header-title { font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #000000; margin-top: 8px; }
    .content { line-height: 1.6; color: #000000; }
    .content p { margin-bottom: 16px; }
    .success-box { background: #f5f5f5; border: 1px solid #000000; padding: 20px; margin: 20px 0; text-align: center; }
    .amount { font-size: 36px; font-weight: 700; color: #000000; }
    .button { display: inline-block; padding: 12px 32px; background: #000000; color: #ffffff !important; text-decoration: none; border-radius: 4px; font-weight: 500; margin: 20px 0; border: 1px solid #000000; }
    .button:hover { background: #333333; }
    .divider { border-top: 1px solid #000000; margin: 30px 0; }
    .footer { font-size: 12px; color: #000000; text-align: center; margin-top: 30px; }
    @media only screen and (max-width: 480px) { .container { padding: 20px 16px; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://chari-t.live/ct_logo_texts.png" alt="Chari-T Logo" class="logo">
      <div class="header-title">Donation Confirmation</div>
    </div>
    <div class="content">
      <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 16px; color: #000000;">Thank You, ${data.name}!</h1>
      <p>Your generous donation has been successfully processed on Chari-T.</p>
      <div class="success-box">
        <div style="font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; color: #000000;">Amount Donated</div>
        <div class="amount">${data.amount}</div>
        <div style="font-size: 14px; margin-top: 8px; color: #000000;">to <strong>${data.campaignName}</strong></div>
      </div>
      <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
      ${data.date ? `<p><strong>Date:</strong> ${data.date}</p>` : ''}
      <p>Your contribution makes a real difference. We're grateful for your support.</p>
      ${data.receiptUrl ? `<a href="${data.receiptUrl}" class="button">View Receipt</a>` : ''}
      <p style="font-size: 14px; color: #000000;">A confirmation receipt has been sent to your email.</p>
    </div>
    <div class="divider"></div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Chari-T. All rights reserved.</p>
      <p>This is a confirmation of your donation.</p>
    </div>
  </div>
</body>
</html>
  `;
};

export const campaignUpdateEmail = (data: {
  name: string;
  campaignName: string;
  updateMessage: string;
  progress?: string;
  goal?: string;
  raised?: string;
  daysLeft?: number;
  viewUrl?: string;
}): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Campaign Update - Chari-T</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #ffffff; color: #000000; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #ffffff; }
    .header { border-bottom: 1px solid #000000; padding-bottom: 20px; margin-bottom: 30px; text-align: center; }
    .logo { max-width: 200px; height: auto; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto; }
    .header-title { font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #000000; margin-top: 8px; }
    .content { line-height: 1.6; color: #000000; }
    .content p { margin-bottom: 16px; }
    .update-box { background: #f5f5f5; border-left: 4px solid #000000; padding: 16px 20px; margin: 20px 0; }
    .stats { display: flex; justify-content: space-between; background: #f5f5f5; padding: 16px; margin: 20px 0; border: 1px solid #000000; }
    .stat-item { text-align: center; }
    .stat-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #000000; }
    .stat-value { font-size: 20px; font-weight: 700; color: #000000; }
    .button { display: inline-block; padding: 12px 32px; background: #000000; color: #ffffff !important; text-decoration: none; border-radius: 4px; font-weight: 500; margin: 20px 0; border: 1px solid #000000; }
    .button:hover { background: #333333; }
    .divider { border-top: 1px solid #000000; margin: 30px 0; }
    .footer { font-size: 12px; color: #000000; text-align: center; margin-top: 30px; }
    @media only screen and (max-width: 480px) { .container { padding: 20px 16px; } .stats { flex-direction: column; gap: 12px; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://chari-t.live/ct_logo_texts.png" alt="Chari-T Logo" class="logo">
      <div class="header-title">Campaign Update</div>
    </div>
    <div class="content">
      <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 16px; color: #000000;">Update: ${data.campaignName}</h1>
      <p>Hello ${data.name},</p>
      <div class="update-box">
        <p style="margin: 0; color: #000000;">${data.updateMessage}</p>
      </div>
      ${
        data.progress || data.raised
          ? `
        <div class="stats">
          ${data.raised ? `<div class="stat-item"><div class="stat-label">Raised</div><div class="stat-value">${data.raised}</div></div>` : ''}
          ${data.goal ? `<div class="stat-item"><div class="stat-label">Goal</div><div class="stat-value">${data.goal}</div></div>` : ''}
          ${data.progress ? `<div class="stat-item"><div class="stat-label">Progress</div><div class="stat-value">${data.progress}</div></div>` : ''}
          ${data.daysLeft ? `<div class="stat-item"><div class="stat-label">Days Left</div><div class="stat-value">${data.daysLeft}</div></div>` : ''}
        </div>
      `
          : ''
      }
      ${data.viewUrl ? `<a href="${data.viewUrl}" class="button">View Campaign</a>` : ''}
      <p style="font-size: 14px; color: #000000;">Thank you for your continued support on Chari-T.</p>
    </div>
    <div class="divider"></div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Chari-T. All rights reserved.</p>
      <p>You're receiving this update because you're following this campaign.</p>
    </div>
  </div>
</body>
</html>
  `;
};

export const campaignSuccessEmail = (data: {
  name: string;
  campaignName: string;
  raised: string;
  goal: string;
  backers?: number;
  daysAhead?: string;
  viewUrl?: string;
  nextSteps?: string;
}): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Campaign Successful - Chari-T</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #ffffff; color: #000000; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #ffffff; }
    .header { border-bottom: 1px solid #000000; padding-bottom: 20px; margin-bottom: 30px; text-align: center; }
    .logo { max-width: 200px; height: auto; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto; }
    .header-title { font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #000000; margin-top: 8px; }
    .content { line-height: 1.6; color: #000000; }
    .content p { margin-bottom: 16px; }
    .success-box { background: #f5f5f5; border: 1px solid #000000; padding: 30px 20px; margin: 20px 0; text-align: center; }
    .success-box h2 { font-size: 32px; font-weight: 700; margin: 0 0 8px 0; color: #000000; }
    .stats { display: flex; justify-content: space-around; margin: 20px 0; }
    .stat-item { text-align: center; }
    .stat-value { font-size: 24px; font-weight: 700; color: #000000; }
    .stat-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #000000; }
    .button { display: inline-block; padding: 12px 32px; background: #000000; color: #ffffff !important; text-decoration: none; border-radius: 4px; font-weight: 500; margin: 20px 0; border: 1px solid #000000; }
    .button:hover { background: #333333; }
    .divider { border-top: 1px solid #000000; margin: 30px 0; }
    .footer { font-size: 12px; color: #000000; text-align: center; margin-top: 30px; }
    @media only screen and (max-width: 480px) { .container { padding: 20px 16px; } .stats { flex-direction: column; gap: 12px; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://chari-t.live/ct_logo_texts.png" alt="Chari-T Logo" class="logo">
      <div class="header-title">Campaign Success</div>
    </div>
    <div class="content">
      <div class="success-box">
        <h2>Campaign Goal Met!</h2>
        <p style="font-size: 18px; margin: 8px 0; color: #000000;">${data.campaignName}</p>
      </div>
      <p>Dear ${data.name},</p>
      <p><strong>Congratulations!</strong> Your Chari-T campaign has successfully reached its funding goal.</p>
      <div class="stats">
        <div class="stat-item">
          <div class="stat-label">Raised</div>
          <div class="stat-value">${data.raised}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Goal</div>
          <div class="stat-value">${data.goal}</div>
        </div>
        ${data.backers ? `<div class="stat-item"><div class="stat-label">Backers</div><div class="stat-value">${data.backers}</div></div>` : ''}
        ${data.daysAhead ? `<div class="stat-item"><div class="stat-label">Days Ahead</div><div class="stat-value">${data.daysAhead}</div></div>` : ''}
      </div>
      ${data.nextSteps ? `<p><strong>Next Steps:</strong> ${data.nextSteps}</p>` : ''}
      ${data.viewUrl ? `<a href="${data.viewUrl}" class="button">View Campaign</a>` : ''}
      <p style="font-size: 14px; color: #000000;">Thank you to everyone who supported this campaign on Chari-T.</p>
    </div>
    <div class="divider"></div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Chari-T. All rights reserved.</p>
      <p>This is a notification about your campaign.</p>
    </div>
  </div>
</body>
</html>
  `;
};

export const kycSubmittedEmail = (data: {
  name: string;
  submissionId: string;
  status: 'pending' | 'in-review' | 'approved' | 'rejected';
  documents?: string[];
  estimatedTime?: string;
  supportUrl?: string;
}): string => {
  const statusMessages = {
    pending: 'Your documents have been received and are pending review.',
    'in-review': 'Your documents are currently being reviewed by our team.',
    approved: 'Your KYC has been approved!',
    rejected: 'Please review your documents and resubmit.',
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KYC Submitted - Chari-T</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #ffffff; color: #000000; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #ffffff; }
    .header { border-bottom: 1px solid #000000; padding-bottom: 20px; margin-bottom: 30px; text-align: center; }
    .logo { max-width: 200px; height: auto; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto; }
    .header-title { font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #000000; margin-top: 8px; }
    .content { line-height: 1.6; color: #000000; }
    .content p { margin-bottom: 16px; }
    .status-box { background: #f5f5f5; border: 1px solid #000000; padding: 20px; margin: 20px 0; }
    .status-badge { display: inline-block; padding: 4px 16px; background: #000000; color: #ffffff; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 2px; }
    .doc-list { padding-left: 20px; margin: 12px 0; color: #000000; }
    .doc-list li { margin-bottom: 6px; color: #000000; }
    .button { display: inline-block; padding: 12px 32px; background: #000000; color: #ffffff !important; text-decoration: none; border-radius: 4px; font-weight: 500; margin: 20px 0; border: 1px solid #000000; }
    .button:hover { background: #333333; }
    .divider { border-top: 1px solid #000000; margin: 30px 0; }
    .footer { font-size: 12px; color: #000000; text-align: center; margin-top: 30px; }
    @media only screen and (max-width: 480px) { .container { padding: 20px 16px; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://chari-t.live/ct_logo_texts.png" alt="Chari-T Logo" class="logo">
      <div class="header-title">KYC Verification</div>
    </div>
    <div class="content">
      <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 16px; color: #000000;">KYC Documents Submitted</h1>
      <p>Hello ${data.name},</p>
      <div class="status-box">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <span style="font-weight: 500; color: #000000;">Submission Status:</span>
          <span class="status-badge">${data.status.replace('-', ' ').toUpperCase()}</span>
        </div>
        <p style="margin-top: 12px; color: #000000;">${statusMessages[data.status]}</p>
        <p><strong>Submission ID:</strong> ${data.submissionId}</p>
      </div>
      ${
        data.documents && data.documents.length > 0
          ? `
        <p><strong>Documents Submitted:</strong></p>
        <ul class="doc-list">
          ${data.documents.map((doc) => `<li>${doc}</li>`).join('')}
        </ul>
      `
          : ''
      }
      ${data.estimatedTime ? `<p><strong>Estimated Processing Time:</strong> ${data.estimatedTime}</p>` : ''}
      ${data.supportUrl ? `<a href="${data.supportUrl}" class="button">Contact Support</a>` : ''}
      <p style="font-size: 14px; color: #000000;">We'll notify you once the verification is complete.</p>
    </div>
    <div class="divider"></div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Chari-T. All rights reserved.</p>
      <p>This is a confirmation of your KYC submission.</p>
    </div>
  </div>
</body>
</html>
  `;
};

export const youDonatedEmail = (data: {
  name: string;
  amount: string;
  campaignName: string;
  transactionId: string;
  date?: string;
  message?: string;
  taxReceiptUrl?: string;
  shareUrl?: string;
}): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You Donated - Chari-T</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #ffffff; color: #000000; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #ffffff; }
    .header { border-bottom: 1px solid #000000; padding-bottom: 20px; margin-bottom: 30px; text-align: center; }
    .logo { max-width: 200px; height: auto; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto; }
    .header-title { font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #000000; margin-top: 8px; }
    .content { line-height: 1.6; color: #000000; }
    .content p { margin-bottom: 16px; }
    .donation-box { background: #f5f5f5; border: 1px solid #000000; padding: 24px; margin: 20px 0; text-align: center; }
    .amount { font-size: 40px; font-weight: 700; color: #000000; }
    .campaign-name { font-size: 18px; font-weight: 500; margin: 8px 0; color: #000000; }
    .message-box { background: #f5f5f5; border-left: 4px solid #000000; padding: 12px 16px; margin: 16px 0; font-style: italic; }
    .button { display: inline-block; padding: 12px 32px; background: #000000; color: #ffffff !important; text-decoration: none; border-radius: 4px; font-weight: 500; margin: 20px 0; border: 1px solid #000000; }
    .button:hover { background: #333333; }
    .button-secondary { display: inline-block; padding: 12px 32px; background: #ffffff; color: #000000 !important; text-decoration: none; border-radius: 4px; font-weight: 500; margin: 20px 0; border: 1px solid #000000; }
    .button-secondary:hover { background: #f5f5f5; }
    .divider { border-top: 1px solid #000000; margin: 30px 0; }
    .footer { font-size: 12px; color: #000000; text-align: center; margin-top: 30px; }
    @media only screen and (max-width: 480px) { .container { padding: 20px 16px; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://chari-t.live/ct_logo_texts.png" alt="Chari-T Logo" class="logo">
      <div class="header-title">Donation Confirmation</div>
    </div>
    <div class="content">
      <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 16px; color: #000000;">Thank You for Your Donation, ${data.name}!</h1>
      <p>Your contribution has been successfully processed on Chari-T.</p>
      <div class="donation-box">
        <div style="font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; color: #000000;">Amount Donated</div>
        <div class="amount">${data.amount}</div>
        <div class="campaign-name">to <strong>${data.campaignName}</strong></div>
        ${data.date ? `<div style="font-size: 14px; margin-top: 8px; color: #000000;">${data.date}</div>` : ''}
      </div>
      <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
      ${
        data.message
          ? `
        <div class="message-box">
          <p style="margin: 0; color: #000000;">"${data.message}"</p>
        </div>
      `
          : ''
      }
      <div style="display: flex; gap: 12px; flex-wrap: wrap; margin: 20px 0;">
        ${data.taxReceiptUrl ? `<a href="${data.taxReceiptUrl}" class="button">View Tax Receipt</a>` : ''}
        ${data.shareUrl ? `<a href="${data.shareUrl}" class="button-secondary">Share Your Impact</a>` : ''}
      </div>
      <p style="font-size: 14px; color: #000000;">Your generosity makes a real difference. Thank you for being part of the Chari-T community.</p>
    </div>
    <div class="divider"></div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Chari-T. All rights reserved.</p>
      <p>This is your donation receipt.</p>
    </div>
  </div>
</body>
</html>
  `;
};

export const campaignShutdownEmail = (data: {
  name: string;
  campaignName: string;
  reason: string;
  shutdownDate: string;
  refundStatus?: string;
  contactUrl?: string;
  additionalInfo?: string;
}): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Campaign Shutdown - Chari-T</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #ffffff; color: #000000; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #ffffff; }
    .header { border-bottom: 1px solid #000000; padding-bottom: 20px; margin-bottom: 30px; text-align: center; }
    .logo { max-width: 200px; height: auto; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto; }
    .header-title { font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #000000; margin-top: 8px; }
    .content { line-height: 1.6; color: #000000; }
    .content p { margin-bottom: 16px; }
    .shutdown-box { background: #f5f5f5; border: 1px solid #000000; padding: 20px; margin: 20px 0; }
    .shutdown-reason { background: #f5f5f5; border-left: 4px solid #000000; padding: 12px 16px; margin: 12px 0; }
    .button { display: inline-block; padding: 12px 32px; background: #000000; color: #ffffff !important; text-decoration: none; border-radius: 4px; font-weight: 500; margin: 20px 0; border: 1px solid #000000; }
    .button:hover { background: #333333; }
    .divider { border-top: 1px solid #000000; margin: 30px 0; }
    .footer { font-size: 12px; color: #000000; text-align: center; margin-top: 30px; }
    @media only screen and (max-width: 480px) { .container { padding: 20px 16px; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://chari-t.live/ct_logo_texts.png" alt="Chari-T Logo" class="logo">
      <div class="header-title">Campaign Closure</div>
    </div>
    <div class="content">
      <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 16px; color: #000000;">Campaign Closed</h1>
      <p>Dear ${data.name},</p>
      <p>We regret to inform you that the Chari-T campaign <strong>${data.campaignName}</strong> has been shut down.</p>
      <div class="shutdown-box">
        <p><strong>Shutdown Date:</strong> ${data.shutdownDate}</p>
        <div class="shutdown-reason">
          <p style="margin: 0; font-weight: 500; color: #000000;">Reason:</p>
          <p style="margin: 4px 0 0 0; color: #000000;">${data.reason}</p>
        </div>
        ${data.refundStatus ? `<p><strong>Refund Status:</strong> ${data.refundStatus}</p>` : ''}
        ${data.additionalInfo ? `<p><strong>Additional Information:</strong> ${data.additionalInfo}</p>` : ''}
      </div>
      ${data.contactUrl ? `<a href="${data.contactUrl}" class="button">Contact Chari-T Support</a>` : ''}
      <p style="font-size: 14px; color: #000000;">We apologize for any inconvenience this may cause.</p>
    </div>
    <div class="divider"></div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Chari-T. All rights reserved.</p>
      <p>This is a notification about your campaign.</p>
    </div>
  </div>
</body>
</html>
  `;
};

export const userBannedEmail = (data: {
  name: string;
  reason: string;
  banDate: string;
  duration?: string;
  appealUrl?: string;
  contactUrl?: string;
  termsUrl?: string;
}): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Suspended - Chari-T</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #ffffff; color: #000000; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #ffffff; }
    .header { border-bottom: 1px solid #000000; padding-bottom: 20px; margin-bottom: 30px; text-align: center; }
    .logo { max-width: 200px; height: auto; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto; }
    .header-title { font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #000000; margin-top: 8px; }
    .content { line-height: 1.6; color: #000000; }
    .content p { margin-bottom: 16px; }
    .ban-box { background: #f5f5f5; border: 1px solid #000000; padding: 20px; margin: 20px 0; }
    .ban-reason { background: #f5f5f5; border-left: 4px solid #000000; padding: 12px 16px; margin: 12px 0; }
    .button { display: inline-block; padding: 12px 32px; background: #000000; color: #ffffff !important; text-decoration: none; border-radius: 4px; font-weight: 500; margin: 20px 0; border: 1px solid #000000; }
    .button:hover { background: #333333; }
    .button-secondary { display: inline-block; padding: 12px 32px; background: #ffffff; color: #000000 !important; text-decoration: none; border-radius: 4px; font-weight: 500; margin: 20px 0; border: 1px solid #000000; }
    .button-secondary:hover { background: #f5f5f5; }
    .divider { border-top: 1px solid #000000; margin: 30px 0; }
    .footer { font-size: 12px; color: #000000; text-align: center; margin-top: 30px; }
    @media only screen and (max-width: 480px) { .container { padding: 20px 16px; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://chari-t.live/ct_logo_texts.png" alt="Chari-T Logo" class="logo">
      <div class="header-title">Account Suspension</div>
    </div>
    <div class="content">
      <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 16px; color: #000000;">Account Suspension Notice</h1>
      <p>Dear ${data.name},</p>
      <p>We are writing to inform you that your Chari-T account has been suspended.</p>
      <div class="ban-box">
        <p><strong>Suspension Date:</strong> ${data.banDate}</p>
        ${data.duration ? `<p><strong>Duration:</strong> ${data.duration}</p>` : ''}
        <div class="ban-reason">
          <p style="margin: 0; font-weight: 500; color: #000000;">Reason for Suspension:</p>
          <p style="margin: 4px 0 0 0; color: #000000;">${data.reason}</p>
        </div>
      </div>
      <p>This action has been taken in accordance with Chari-T's Terms of Service.</p>
      <div style="display: flex; gap: 12px; flex-wrap: wrap; margin: 20px 0;">
        ${data.appealUrl ? `<a href="${data.appealUrl}" class="button">Submit Appeal</a>` : ''}
        ${data.contactUrl ? `<a href="${data.contactUrl}" class="button-secondary">Contact Chari-T Support</a>` : ''}
        ${data.termsUrl ? `<a href="${data.termsUrl}" style="color: #000000; font-size: 14px;">View Terms of Service</a>` : ''}
      </div>
      <p style="font-size: 14px; color: #000000;">If you believe this was done in error, please contact our support team.</p>
    </div>
    <div class="divider"></div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Chari-T. All rights reserved.</p>
      <p>This is an important notice regarding your account.</p>
    </div>
  </div>
</body>
</html>
  `;
};

export const emailTemplates = {
  welcome: welcomeEmail,
  donationSuccess: donationSuccessEmail,
  campaignUpdate: campaignUpdateEmail,
  campaignSuccess: campaignSuccessEmail,
  kycSubmitted: kycSubmittedEmail,
  youDonated: youDonatedEmail,
  campaignShutdown: campaignShutdownEmail,
  userBanned: userBannedEmail,
};
