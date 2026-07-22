import { ImageResponse } from 'next/og';

type ReceiptData = {
  amount: number;
  platform_fee: number;
  transaction_id: string;
  time: string;
  email: string;
};

export function Receipts(data: ReceiptData) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

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

  const netAmount = data.amount - data.platform_fee;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: 60,
      }}
    >
      {/* Receipt Card - single child of outer, but has multiple children so needs display: flex */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: 600,
          background: '#ffffff',
          padding: 48,
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        }}
      >
        {/* Header - multiple children */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 40,
            paddingBottom: 32,
            borderBottom: '2px dashed #e5e5e5',
          }}
        >
          {/* Logo - multiple children */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                background: '#111111',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  color: '#ffffff',
                  fontSize: 24,
                  fontWeight: 900,
                  fontFamily: 'system-ui',
                }}
              >
                C
              </span>
            </div>
            <span
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: '#111111',
                letterSpacing: -0.5,
                fontFamily: 'system-ui',
              }}
            >
              Chari-T
            </span>
          </div>

          <div
            style={{
              marginTop: 24,
              fontSize: 14,
              color: '#666666',
              textTransform: 'uppercase',
              letterSpacing: 2,
              fontWeight: 600,
            }}
          >
            Payment Receipt
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 12,
              color: '#999999',
            }}
          >
            {formatDate(data.time)}
          </div>
        </div>

        {/* Amount Section - multiple children */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              fontSize: 14,
              color: '#666666',
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            Total Amount
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: '#111111',
              letterSpacing: -2,
            }}
          >
            {formatCurrency(data.amount)}
          </div>
        </div>

        {/* Breakdown - multiple children */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            marginBottom: 40,
            padding: 24,
            background: '#fafafa',
            borderRadius: 12,
          }}
        >
          {/* Row 1 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: 15,
                color: '#666666',
                fontWeight: 500,
              }}
            >
              Subtotal
            </span>
            <span
              style={{
                fontSize: 15,
                color: '#111111',
                fontWeight: 600,
                fontFamily: 'monospace',
              }}
            >
              {formatCurrency(netAmount)}
            </span>
          </div>

          {/* Row 2 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: 15,
                color: '#666666',
                fontWeight: 500,
              }}
            >
              Platform Fee
            </span>
            <span
              style={{
                fontSize: 15,
                color: '#dc2626',
                fontWeight: 600,
                fontFamily: 'monospace',
              }}
            >
              -{formatCurrency(data.platform_fee)}
            </span>
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: '#e5e5e5',
              margin: '8px 0',
            }}
          />

          {/* Row 3 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: 15,
                color: '#666666',
                fontWeight: 700,
              }}
            >
              Total Paid
            </span>
            <span
              style={{
                fontSize: 15,
                color: '#111111',
                fontWeight: 700,
                fontFamily: 'monospace',
              }}
            >
              {formatCurrency(data.amount)}
            </span>
          </div>
        </div>

        {/* Details - multiple children */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: 14,
                color: '#999999',
                fontWeight: 500,
              }}
            >
              Transaction ID
            </span>
            <span
              style={{
                fontSize: 14,
                color: '#333333',
                fontWeight: 600,
                maxWidth: 300,
                textAlign: 'right',
              }}
            >
              {data.transaction_id}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: 14,
                color: '#999999',
                fontWeight: 500,
              }}
            >
              Email
            </span>
            <span
              style={{
                fontSize: 14,
                color: '#333333',
                fontWeight: 600,
                maxWidth: 300,
                textAlign: 'right',
              }}
            >
              {data.email}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: 14,
                color: '#999999',
                fontWeight: 500,
              }}
            >
              Date
            </span>
            <span
              style={{
                fontSize: 14,
                color: '#333333',
                fontWeight: 600,
                maxWidth: 300,
                textAlign: 'right',
              }}
            >
              {formatDate(data.time)}
            </span>
          </div>
        </div>

        {/* Footer - multiple children */}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 32,
            borderTop: '2px dashed #e5e5e5',
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: '#999999',
              textAlign: 'center',
              lineHeight: 1.6,
            }}
          >
            Thank you for your donation!
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: 13,
              color: '#999999',
              textAlign: 'center',
              lineHeight: 1.6,
            }}
          >
            A copy of this receipt has been sent to your email.
          </div>

          <div
            style={{
              marginTop: 16,
              fontSize: 12,
              color: '#cccccc',
            }}
          >
            Chari-T • Secure Payments
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 900,
    },
  );
}
