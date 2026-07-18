/**
 * Chari-T Email Templates
 * ------------------------------------------------------------------
 * Design system: soft emerald accent, rounded cards, pill buttons.
 * Forced light color-scheme (meta tags) so the logo — which is black
 * text on a transparent background — never disappears when a phone
 * or mail client is in dark mode. The logo also always sits inside
 * an explicit white box as a second safety net.
 * ------------------------------------------------------------------
 */

const COLORS = {
  bgPage: '#F3F6F5',
  bgCard: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#5B6570',
  textMuted: '#8A939C',
  accent: '#0E8E68',
  accentDark: '#0B6F52',
  accentLight: '#E6F4EF',
  border: '#E6E9EC',
  danger: '#C0392B',
  dangerLight: '#FBEAE8',
  warning: '#B4740E',
  warningLight: '#FBF1DE',
};

const baseStyles = `
  body { margin: 0; padding: 0; background: ${COLORS.bgPage}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
  table { border-collapse: collapse; }
  img { border: 0; display: block; }
  .email-wrapper { width: 100%; background: ${COLORS.bgPage}; padding: 32px 12px; }
  .container { max-width: 600px; margin: 0 auto; background: ${COLORS.bgCard}; border-radius: 16px; overflow: hidden; border: 1px solid ${COLORS.border}; }
  .header { padding: 32px 40px 24px 40px; text-align: center; background: ${COLORS.bgCard}; }
  .logo-box { display: inline-block; background: #ffffff; padding: 14px 24px; border-radius: 10px; border: 1px solid ${COLORS.border}; }
  .logo { max-width: 160px; height: auto; }
  .eyebrow { font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: ${COLORS.accent}; margin-top: 16px; }
  .body-pad { padding: 8px 40px 40px 40px; }
  h1 { font-size: 24px; font-weight: 700; color: ${COLORS.textPrimary}; margin: 0 0 16px 0; line-height: 1.3; }
  p { font-size: 15px; line-height: 1.65; color: ${COLORS.textSecondary}; margin: 0 0 16px 0; }
  .lead { font-size: 16px; color: ${COLORS.textPrimary}; }
  .card { background: ${COLORS.accentLight}; border-radius: 12px; padding: 24px; margin: 24px 0; }
  .card-neutral { background: #F8F9FA; border: 1px solid ${COLORS.border}; border-radius: 12px; padding: 24px; margin: 24px 0; }
  .card-warning { background: ${COLORS.warningLight}; border-radius: 12px; padding: 20px 24px; margin: 20px 0; }
  .card-danger { background: ${COLORS.dangerLight}; border-radius: 12px; padding: 20px 24px; margin: 20px 0; }
  .row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.06); }
  .row:last-child { border-bottom: none; }
  .row-label { font-size: 13px; font-weight: 600; color: ${COLORS.textMuted}; text-transform: uppercase; letter-spacing: 0.4px; }
  .row-value { font-size: 14px; font-weight: 700; color: ${COLORS.textPrimary}; text-align: right; }
  .amount { font-size: 38px; font-weight: 800; color: ${COLORS.accentDark}; letter-spacing: -0.5px; }
  .badge { display: inline-block; padding: 5px 14px; border-radius: 999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
  .badge-success { background: ${COLORS.accent}; color: #ffffff; }
  .badge-warning { background: ${COLORS.warning}; color: #ffffff; }
  .badge-danger { background: ${COLORS.danger}; color: #ffffff; }
  .btn { display: inline-block; padding: 14px 32px; border-radius: 999px; font-weight: 600; font-size: 15px; text-decoration: none; margin: 8px 8px 8px 0; }
  .btn-primary { background: ${COLORS.accent}; color: #ffffff !important; }
  .btn-secondary { background: #ffffff; color: ${COLORS.textPrimary} !important; border: 1px solid ${COLORS.border}; }
  .divider { border-top: 1px solid ${COLORS.border}; margin: 8px 0 0 0; }
  .footer { padding: 28px 40px; text-align: center; }
  .footer p { font-size: 12px; color: ${COLORS.textMuted}; margin: 0 0 6px 0; }
  .stats-grid { display: flex; justify-content: space-between; gap: 12px; margin: 20px 0; flex-wrap: wrap; }
  .stat { flex: 1; min-width: 100px; text-align: center; background: #F8F9FA; border: 1px solid ${COLORS.border}; border-radius: 10px; padding: 14px 8px; }
  .stat-value { font-size: 19px; font-weight: 800; color: ${COLORS.textPrimary}; }
  .stat-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; color: ${COLORS.textMuted}; margin-top: 2px; }
  .quote { border-left: 3px solid ${COLORS.accent}; background: #F8F9FA; padding: 12px 18px; margin: 16px 0; font-style: italic; border-radius: 0 8px 8px 0; }
  @media only screen and (max-width: 480px) {
    .header { padding: 28px 24px 20px 24px; }
    .body-pad { padding: 8px 24px 32px 24px; }
    .footer { padding: 24px 24px; }
    .stats-grid { flex-direction: column; }
    .row { flex-direction: column; align-items: flex-start; gap: 2px; }
    .row-value { text-align: left; }
  }
`;

const headHtml = (title: string) => `
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light only">
  <title>${title}</title>
  <style>${baseStyles}</style>
</head>
`;

const headerHtml = (eyebrow: string) => `
  <div class="header">
    <div class="logo-box">
      <img src="https://chari-t.live/ct_logo_texts.png" alt="Chari-T" class="logo">
    </div>
    <div class="eyebrow">${eyebrow}</div>
  </div>
`;

const footerHtml = (note: string) => `
  <div class="divider"></div>
  <div class="footer">
    <p>© ${new Date().getFullYear()} Chari-T. All rights reserved.</p>
    <p>${note}</p>
  </div>
`;

const shell = (title: string, eyebrow: string, bodyContent: string, footerNote: string) => `
<!DOCTYPE html>
<html lang="en">
${headHtml(title)}
<body>
  <div class="email-wrapper">
    <div class="container">
      ${headerHtml(eyebrow)}
      <div class="body-pad">
        ${bodyContent}
      </div>
      ${footerHtml(footerNote)}
    </div>
  </div>
</body>
</html>
`;

// ---------------------------------------------------------------------------
// Welcome
// ---------------------------------------------------------------------------
export const welcomeEmail = (data: {
  name: string;
  companyName?: string;
  loginUrl?: string;
}): string => {
  const body = `
    <h1>Welcome, ${data.name} 👋</h1>
    <p class="lead">We're thrilled to have you on board at Chari-T. Your journey starts now.</p>
    ${data.companyName ? `<p>You've joined <strong>${data.companyName}</strong> as a valued member.</p>` : ''}
    <div class="card">
      <p style="margin:0 0 10px 0; font-weight:700; color:${COLORS.textPrimary};">Here's what you can do next:</p>
      <div class="row"><span class="row-value" style="text-align:left; font-weight:500;">✓ Complete your profile</span></div>
      <div class="row"><span class="row-value" style="text-align:left; font-weight:500;">✓ Explore campaigns to support</span></div>
      <div class="row"><span class="row-value" style="text-align:left; font-weight:500;">✓ Connect with the community</span></div>
    </div>
    ${data.loginUrl ? `<a href="${data.loginUrl}" class="btn btn-primary">Get Started</a>` : ''}
    <p style="font-size:13px; margin-top:16px;">Questions? Just reply to this email — we're here to help.</p>
  `;
  return shell('Welcome to Chari-T', 'Crowdfunding Platform', body, "You're receiving this because you signed up with Chari-T.");
};

// ---------------------------------------------------------------------------
// Donation success (platform-side confirmation)
// ---------------------------------------------------------------------------
export const donationSuccessEmail = (data: {
  name: string;
  amount: string;
  campaignName: string;
  transactionId: string;
  date?: string;
  receiptUrl?: string;
}): string => {
  const body = `
    <span class="badge badge-success">Payment Confirmed</span>
    <h1 style="margin-top:12px;">Thank you, ${data.name}!</h1>
    <p class="lead">Your generous donation has been successfully processed.</p>
    <div class="card" style="text-align:center;">
      <div class="stat-label">Amount Donated</div>
      <div class="amount">${data.amount}</div>
      <p style="margin-top:6px;">to <strong style="color:${COLORS.textPrimary};">${data.campaignName}</strong></p>
    </div>
    <div class="card-neutral">
      <div class="row"><span class="row-label">Transaction ID</span><span class="row-value">${data.transactionId}</span></div>
      ${data.date ? `<div class="row"><span class="row-label">Date</span><span class="row-value">${data.date}</span></div>` : ''}
    </div>
    ${data.receiptUrl ? `<a href="${data.receiptUrl}" class="btn btn-primary">View Receipt</a>` : ''}
    <p style="font-size:13px;">Your contribution makes a real difference. We're grateful for your support.</p>
  `;
  return shell('Donation Successful', 'Donation Confirmation', body, 'This is a confirmation of your donation.');
};

// ---------------------------------------------------------------------------
// Campaign update
// ---------------------------------------------------------------------------
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
  const hasStats = data.raised || data.goal || data.progress || data.daysLeft;
  const body = `
    <div class="eyebrow" style="text-align:left; margin-bottom:8px;">Campaign Update</div>
    <h1>${data.campaignName}</h1>
    <p>Hi ${data.name},</p>
    <div class="quote">
      <p style="margin:0;">${data.updateMessage}</p>
    </div>
    ${hasStats ? `
      <div class="stats-grid">
        ${data.raised ? `<div class="stat"><div class="stat-value">${data.raised}</div><div class="stat-label">Raised</div></div>` : ''}
        ${data.goal ? `<div class="stat"><div class="stat-value">${data.goal}</div><div class="stat-label">Goal</div></div>` : ''}
        ${data.progress ? `<div class="stat"><div class="stat-value">${data.progress}</div><div class="stat-label">Progress</div></div>` : ''}
        ${data.daysLeft !== undefined ? `<div class="stat"><div class="stat-value">${data.daysLeft}</div><div class="stat-label">Days Left</div></div>` : ''}
      </div>
    ` : ''}
    ${data.viewUrl ? `<a href="${data.viewUrl}" class="btn btn-primary">View Campaign</a>` : ''}
    <p style="font-size:13px;">Thank you for your continued support on Chari-T.</p>
  `;
  return shell('Campaign Update', 'Campaign Update', body, "You're receiving this because you're following this campaign.");
};

// ---------------------------------------------------------------------------
// Campaign success (goal met)
// ---------------------------------------------------------------------------
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
  const body = `
    <div class="card" style="text-align:center;">
      <span class="badge badge-success">Goal Reached</span>
      <h1 style="margin:14px 0 4px 0;">Campaign Goal Met! 🎉</h1>
      <p style="margin:0; font-weight:600; color:${COLORS.textPrimary};">${data.campaignName}</p>
    </div>
    <p>Dear ${data.name},</p>
    <p><strong>Congratulations!</strong> Your Chari-T campaign has successfully reached its funding goal.</p>
    <div class="stats-grid">
      <div class="stat"><div class="stat-value">${data.raised}</div><div class="stat-label">Raised</div></div>
      <div class="stat"><div class="stat-value">${data.goal}</div><div class="stat-label">Goal</div></div>
      ${data.backers !== undefined ? `<div class="stat"><div class="stat-value">${data.backers}</div><div class="stat-label">Backers</div></div>` : ''}
      ${data.daysAhead ? `<div class="stat"><div class="stat-value">${data.daysAhead}</div><div class="stat-label">Days Ahead</div></div>` : ''}
    </div>
    ${data.nextSteps ? `<div class="card-neutral"><p style="margin:0;"><strong>Next Steps:</strong> ${data.nextSteps}</p></div>` : ''}
    ${data.viewUrl ? `<a href="${data.viewUrl}" class="btn btn-primary">View Campaign</a>` : ''}
    <p style="font-size:13px;">Thank you to everyone who supported this campaign on Chari-T.</p>
  `;
  return shell('Campaign Successful', 'Campaign Success', body, 'This is a notification about your campaign.');
};

// ---------------------------------------------------------------------------
// KYC submitted
// ---------------------------------------------------------------------------
export const kycSubmittedEmail = (data: {
  name: string;
  submissionId: string;
  status: 'pending' | 'in-review' | 'approved' | 'rejected';
  documents?: string[];
  estimatedTime?: string;
  supportUrl?: string;
}): string => {
  const statusMessages: Record<string, string> = {
    pending: 'Your documents have been received and are pending review.',
    'in-review': 'Your documents are currently being reviewed by our team.',
    approved: 'Your KYC has been approved!',
    rejected: 'Please review your documents and resubmit.',
  };
  const badgeClass = data.status === 'approved' ? 'badge-success' : data.status === 'rejected' ? 'badge-danger' : 'badge-warning';
  const body = `
    <h1>KYC Documents Submitted</h1>
    <p>Hello ${data.name},</p>
    <div class="card-neutral">
      <div class="row">
        <span class="row-label">Submission Status</span>
        <span class="badge ${badgeClass}">${data.status.replace('-', ' ')}</span>
      </div>
      <div class="row"><span class="row-label">Submission ID</span><span class="row-value">${data.submissionId}</span></div>
      ${data.estimatedTime ? `<div class="row"><span class="row-label">Est. Processing Time</span><span class="row-value">${data.estimatedTime}</span></div>` : ''}
    </div>
    <p>${statusMessages[data.status]}</p>
    ${data.documents && data.documents.length > 0 ? `
      <div class="card">
        <p style="margin:0 0 10px 0; font-weight:700; color:${COLORS.textPrimary};">Documents Submitted</p>
        ${data.documents.map(doc => `<div class="row"><span class="row-value" style="text-align:left; font-weight:500;">📄 ${doc}</span></div>`).join('')}
      </div>
    ` : ''}
    ${data.supportUrl ? `<a href="${data.supportUrl}" class="btn btn-secondary">Contact Support</a>` : ''}
    <p style="font-size:13px;">We'll notify you once the verification is complete.</p>
  `;
  return shell('KYC Submitted', 'KYC Verification', body, 'This is a confirmation of your KYC submission.');
};

// ---------------------------------------------------------------------------
// You donated (donor-side receipt)
// ---------------------------------------------------------------------------
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
  const body = `
    <h1>Thank you for your donation, ${data.name}! 💚</h1>
    <p class="lead">Your contribution has been successfully processed on Chari-T.</p>
    <div class="card" style="text-align:center;">
      <div class="stat-label">Amount Donated</div>
      <div class="amount">${data.amount}</div>
      <p style="margin-top:6px;">to <strong style="color:${COLORS.textPrimary};">${data.campaignName}</strong></p>
      ${data.date ? `<p style="font-size:13px; margin-top:2px;">${data.date}</p>` : ''}
    </div>
    <div class="card-neutral">
      <div class="row"><span class="row-label">Transaction ID</span><span class="row-value">${data.transactionId}</span></div>
    </div>
    ${data.message ? `<div class="quote"><p style="margin:0;">"${data.message}"</p></div>` : ''}
    ${data.taxReceiptUrl ? `<a href="${data.taxReceiptUrl}" class="btn btn-primary">View Tax Receipt</a>` : ''}
    ${data.shareUrl ? `<a href="${data.shareUrl}" class="btn btn-secondary">Share Your Impact</a>` : ''}
    <p style="font-size:13px;">Your generosity makes a real difference. Thank you for being part of the Chari-T community.</p>
  `;
  return shell('You Donated', 'Donation Confirmation', body, 'This is your donation receipt.');
};

// ---------------------------------------------------------------------------
// Campaign shutdown
// ---------------------------------------------------------------------------
export const campaignShutdownEmail = (data: {
  name: string;
  campaignName: string;
  reason: string;
  shutdownDate: string;
  refundStatus?: string;
  contactUrl?: string;
  additionalInfo?: string;
}): string => {
  const body = `
    <span class="badge badge-danger">Campaign Closed</span>
    <h1 style="margin-top:12px;">${data.campaignName}</h1>
    <p>Dear ${data.name},</p>
    <p>We regret to inform you that this Chari-T campaign has been shut down.</p>
    <div class="card-neutral">
      <div class="row"><span class="row-label">Shutdown Date</span><span class="row-value">${data.shutdownDate}</span></div>
      ${data.refundStatus ? `<div class="row"><span class="row-label">Refund Status</span><span class="row-value">${data.refundStatus}</span></div>` : ''}
    </div>
    <div class="card-danger">
      <p style="margin:0 0 4px 0; font-weight:700; color:${COLORS.textPrimary};">Reason</p>
      <p style="margin:0;">${data.reason}</p>
    </div>
    ${data.additionalInfo ? `<p>${data.additionalInfo}</p>` : ''}
    ${data.contactUrl ? `<a href="${data.contactUrl}" class="btn btn-primary">Contact Chari-T Support</a>` : ''}
    <p style="font-size:13px;">We apologize for any inconvenience this may cause.</p>
  `;
  return shell('Campaign Closed', 'Campaign Closure', body, 'This is a notification about your campaign.');
};

// ---------------------------------------------------------------------------
// User banned
// ---------------------------------------------------------------------------
export const userBannedEmail = (data: {
  name: string;
  reason: string;
  banDate: string;
  duration?: string;
  appealUrl?: string;
  contactUrl?: string;
  termsUrl?: string;
}): string => {
  const body = `
    <span class="badge badge-danger">Account Suspended</span>
    <h1 style="margin-top:12px;">Account Suspension Notice</h1>
    <p>Dear ${data.name},</p>
    <p>We are writing to inform you that your Chari-T account has been suspended.</p>
    <div class="card-neutral">
      <div class="row"><span class="row-label">Suspension Date</span><span class="row-value">${data.banDate}</span></div>
      ${data.duration ? `<div class="row"><span class="row-label">Duration</span><span class="row-value">${data.duration}</span></div>` : ''}
    </div>
    <div class="card-danger">
      <p style="margin:0 0 4px 0; font-weight:700; color:${COLORS.textPrimary};">Reason for Suspension</p>
      <p style="margin:0;">${data.reason}</p>
    </div>
    <p style="font-size:13px;">This action has been taken in accordance with Chari-T's Terms of Service.</p>
    ${data.appealUrl ? `<a href="${data.appealUrl}" class="btn btn-primary">Submit Appeal</a>` : ''}
    ${data.contactUrl ? `<a href="${data.contactUrl}" class="btn btn-secondary">Contact Support</a>` : ''}
    ${data.termsUrl ? `<p style="margin-top:12px;"><a href="${data.termsUrl}" style="color:${COLORS.accent}; font-size:13px;">View Terms of Service</a></p>` : ''}
  `;
  return shell('Account Suspended', 'Account Suspension', body, 'This is an important notice regarding your account.');
};

// ---------------------------------------------------------------------------
// Bank details added
// ---------------------------------------------------------------------------
export const bankDetailsAddedEmail = (data: {
  name: string;
  bankName: string;
  accountHolderName: string;
  accountNumberLast4: string;
  dateAdded?: string;
  manageUrl?: string;
  supportUrl?: string;
}): string => {
  const body = `
    <span class="badge badge-success">Bank Details Added</span>
    <h1 style="margin-top:12px;">Hi ${data.name}, your bank details have been added</h1>
    <p class="lead">Your bank account has been successfully linked to your Chari-T account and will be used to receive payouts from your campaigns.</p>
    <div class="card-neutral">
      <div class="row"><span class="row-label">Bank Name</span><span class="row-value">${data.bankName}</span></div>
      <div class="row"><span class="row-label">Account Holder</span><span class="row-value">${data.accountHolderName}</span></div>
      <div class="row"><span class="row-label">Account Number</span><span class="row-value">•••• ${data.accountNumberLast4}</span></div>
      ${data.dateAdded ? `<div class="row"><span class="row-label">Date Added</span><span class="row-value">${data.dateAdded}</span></div>` : ''}
    </div>
    <div class="card-warning">
      <p style="margin:0;">If you did not make this change, please contact our support team immediately to secure your account.</p>
    </div>
    ${data.manageUrl ? `<a href="${data.manageUrl}" class="btn btn-primary">Manage Payout Settings</a>` : ''}
    ${data.supportUrl ? `<a href="${data.supportUrl}" class="btn btn-secondary">Contact Support</a>` : ''}
    <p style="font-size:13px;">Thank you for keeping your Chari-T account up to date.</p>
  `;
  return shell('Bank Details Added', 'Payout Settings', body, 'This is a security notification regarding your payout account.');
};

// ---------------------------------------------------------------------------
export const emailTemplates = {
  welcome: welcomeEmail,
  donationSuccess: donationSuccessEmail,
  campaignUpdate: campaignUpdateEmail,
  campaignSuccess: campaignSuccessEmail,
  kycSubmitted: kycSubmittedEmail,
  youDonated: youDonatedEmail,
  campaignShutdown: campaignShutdownEmail,
  userBanned: userBannedEmail,
  bankDetailsAdded: bankDetailsAddedEmail,
};