// lib/receipt.ts
import { ImageResponse } from 'next/og';

// ---------- Types ----------
type ReceiptData = {
  amount: number;
  platform_fee: number;
  transaction_id: string;
  time: string;
  email: string;
};

// ---------- Helpers ----------
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount);

const formatDate = (timeString: string) => {
  try {
    return new Date(timeString).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return timeString;
  }
};

// ---------- Styles (extracted for clarity) ----------
const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f5f5f5',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: 60,
  },
  card: {
    display: 'flex',
    flexDirection: 'column' as const,
    width: '100%',
    maxWidth: 600,
    background: '#ffffff',
    padding: 48,
    borderRadius: 16,
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  },
  header: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    marginBottom: 40,
    paddingBottom: 32,
    borderBottom: '2px dashed #e5e5e5',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    marginTop: 24,
    fontSize: 14,
    color: '#666666',
    textTransform: 'uppercase' as const,
    letterSpacing: 2,
    fontWeight: 600,
  },
  date: {
    marginTop: 8,
    fontSize: 12,
    color: '#999999',
  },
  amountSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    marginBottom: 40,
  },
  amountLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  amountValue: {
    fontSize: 56,
    fontWeight: 800,
    color: '#111111',
    letterSpacing: -2,
  },
  breakdown: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 16,
    marginBottom: 40,
    padding: 24,
    background: '#fafafa',
    borderRadius: 12,
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: 15,
    color: '#666666',
    fontWeight: 500,
  },
  rowValue: {
    fontSize: 15,
    fontWeight: 600,
    fontFamily: 'monospace',
  },
  divider: {
    height: 1,
    background: '#e5e5e5',
    margin: '8px 0',
  },
  details: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 16,
    marginBottom: 40,
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#999999',
    fontWeight: 500,
  },
  detailValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: 600,
    maxWidth: 300,
    textAlign: 'right' as const,
  },
  footer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    paddingTop: 32,
    borderTop: '2px dashed #e5e5e5',
  },
  footerText: {
    fontSize: 13,
    color: '#999999',
    textAlign: 'center' as const,
    lineHeight: 1.6,
  },
  footerBrand: {
    marginTop: 16,
    fontSize: 12,
    color: '#cccccc',
  },
};

// ---------- Component ----------
export function Receipts(data: ReceiptData) {
  const netAmount = data.amount - data.platform_fee;

  // --- Image URL with fallback ---
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const logoSrc = `${baseUrl}/ct_logo_texts.png`;

  return new ImageResponse(
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>
            <img
              src={logoSrc}
              alt="Chari-T Logo"
              width={200}
             
            />
          </div>
          <div style={styles.title}>Payment Receipt</div>
          <div style={styles.date}>{formatDate(data.time)}</div>
        </div>

        {/* Amount */}
        <div style={styles.amountSection}>
          <div style={styles.amountLabel}>Total Amount</div>
          <div style={styles.amountValue}>{formatCurrency(data.amount)}</div>
        </div>

        {/* Breakdown */}
        <div style={styles.breakdown}>
          <div style={styles.row}>
            <span style={styles.rowLabel}>Subtotal</span>
            <span style={{ ...styles.rowValue, color: '#111111' }}>
              {formatCurrency(netAmount)}
            </span>
          </div>
          <div style={styles.row}>
            <span style={styles.rowLabel}>Platform Fee</span>
            <span style={{ ...styles.rowValue, color: '#dc2626' }}>
              -{formatCurrency(data.platform_fee)}
            </span>
          </div>
          <div style={styles.divider} />
          <div style={styles.row}>
            <span style={{ ...styles.rowLabel, fontWeight: 700 }}>Total Paid</span>
            <span style={{ ...styles.rowValue, color: '#111111', fontWeight: 700 }}>
              {formatCurrency(data.amount)}
            </span>
          </div>
        </div>

        {/* Details */}
        <div style={styles.details}>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Transaction ID</span>
            <span style={styles.detailValue}>{data.transaction_id}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Email</span>
            <span style={styles.detailValue}>{data.email}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Date</span>
            <span style={styles.detailValue}>{formatDate(data.time)}</span>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.footerText}>Thank you for your donation!</div>
          <div style={{ ...styles.footerText, marginTop: 4 }}>
            A copy of this receipt has been sent to your email.
          </div>
          <div style={styles.footerBrand}>Chari-T • Secure Payments</div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 900,
    },
  );
}