import { ImageResponse } from 'next/og';

type Flier = {
  _type: 'center' | 'normal';
  goal?: string;
  raised: string;
  campaign_id: number;
  campaign_name?: string;
  style: 1 | 2 | 3 | 4 | 5;
  center_logo_url?: string;
  campaign_logo_url: string;
  qr_code_url: string;
  tagline?: string;
  details?: string;
  center_name?: string;
  center_handle?: string;
};

const formatAmount = (amount: string) => {
  return 'NGN ' + new Intl.NumberFormat('en-NG').format(Number(amount));
};

const getProgress = (raised: string, goal?: string) => {
  if (!goal) return null;
  const r = parseFloat(raised);
  const g = parseFloat(goal);
  if (isNaN(r) || isNaN(g) || g === 0) return null;
  return Math.min(Math.round((r / g) * 100), 100);
};

const ChariTLogo = ({
  size = 48,
  theme = 'light',
}: {
  size?: number;
  theme?: 'light' | 'dark';
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <div
      style={{
        width: size,
        height: size,
        background: theme === 'light' ? '#09090b' : '#ffffff',
        borderRadius: size * 0.25,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <span
        style={{
          color: theme === 'light' ? '#ffffff' : '#09090b',
          fontSize: size * 0.55,
          fontWeight: 900,
          fontFamily: 'system-ui',
        }}
      >
        C
      </span>
    </div>
    <span
      style={{
        fontSize: size * 0.6,
        fontWeight: 800,
        color: theme === 'light' ? '#09090b' : '#ffffff',
        letterSpacing: -0.5,
        fontFamily: 'system-ui',
      }}
    >
      Chari-T
    </span>
  </div>
);

const PaystackBadge = ({ theme = 'light' }: { theme?: 'light' | 'dark' }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 16px',
      background: theme === 'light' ? '#f4f4f5' : 'rgba(255,255,255,0.1)',
      borderRadius: 30,
      border: `1px solid ${theme === 'light' ? '#e4e4e7' : 'rgba(255,255,255,0.15)'}`,
    }}
  >
    <span
      style={{
        fontSize: 12,
        color: theme === 'light' ? '#71717a' : '#a1a1aa',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      }}
    >
      Secured by
    </span>
    <span style={{ fontSize: 14, color: '#00C3F7', fontWeight: 800 }}>Paystack</span>
  </div>
);

const QRCode = ({ url, label, size = 180 }: { url: string; label?: string; size?: number }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
    <div
      style={{
        width: size,
        height: size,
        background: '#ffffff',
        borderRadius: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #e4e4e7',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        padding: 16,
      }}
    >
      <img
        src={url}
        alt="QR Code"
        width={size - 32}
        height={size - 32}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
    {label && (
      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: '#71717a',
          textTransform: 'uppercase',
          letterSpacing: 1.5,
          fontFamily: 'system-ui',
        }}
      >
        {label}
      </span>
    )}
  </div>
);

const DonationLink = ({ url, theme = 'light' }: { url: string; theme?: 'light' | 'dark' }) => {
  const Url = new URL(url);
  const donate_url = Url.searchParams.get('data') || url;
  const isDark = theme === 'dark';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: '20px 32px',
        background: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
        borderRadius: 20,
        border: `1px dashed ${isDark ? 'rgba(255,255,255,0.2)' : '#cbd5e1'}`,
        width: '100%',
      }}
    >
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: isDark ? '#a1a1aa' : '#64748b',
          textTransform: 'uppercase',
          letterSpacing: 2,
          fontFamily: 'system-ui',
        }}
      >
        Or visit this link
      </span>
      <span
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: isDark ? '#ffffff' : '#0f172a',
          fontFamily: 'system-ui',
          letterSpacing: 0.5,
          wordBreak: 'break-all',
          textAlign: 'center',
        }}
      >
        {donate_url}
      </span>
    </div>
  );
};

const ProgressBar = ({
  raised,
  goal,
  large = false,
  theme = 'light',
}: {
  raised: string;
  goal?: string;
  large?: boolean;
  theme?: 'light' | 'dark';
}) => {
  const progress = getProgress(raised, goal);
  if (!progress) return null;
  const isDark = theme === 'dark';
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: large ? 16 : 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span
            style={{
              fontSize: large ? 14 : 12,
              color: isDark ? '#a1a1aa' : '#71717a',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 1.5,
            }}
          >
            Raised
          </span>
          <span
            style={{
              fontSize: large ? 32 : 24,
              color: isDark ? '#ffffff' : '#09090b',
              fontWeight: 900,
              letterSpacing: -1,
            }}
          >
            {formatAmount(raised)}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
          <span
            style={{
              fontSize: large ? 14 : 12,
              color: isDark ? '#a1a1aa' : '#71717a',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 1.5,
            }}
          >
            Goal
          </span>
          <span
            style={{
              fontSize: large ? 32 : 24,
              color: isDark ? '#ffffff' : '#09090b',
              fontWeight: 900,
              letterSpacing: -1,
            }}
          >
            {formatAmount(goal || '0')}
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            flex: 1,
            height: large ? 16 : 10,
            background: isDark ? 'rgba(255,255,255,0.1)' : '#e4e4e7',
            borderRadius: 100,
            overflow: 'hidden',
            display: 'flex',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: isDark ? '#ffffff' : '#09090b',
              borderRadius: 100,
              display: 'flex',
            }}
          />
        </div>
        <span
          style={{
            fontSize: large ? 20 : 16,
            fontWeight: 800,
            color: isDark ? '#ffffff' : '#09090b',
          }}
        >
          {progress}%
        </span>
      </div>
    </div>
  );
};

const CenterBadge = ({
  name,
  handle,
  theme = 'light',
}: {
  name: string;
  handle?: string;
  theme?: 'light' | 'dark';
}) => {
  const isDark = theme === 'dark';
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '16px 24px',
        background: isDark ? 'rgba(255,255,255,0.05)' : '#f4f4f5',
        borderRadius: 24,
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e4e4e7'}`,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          background: isDark ? '#ffffff' : '#09090b',
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: isDark ? '#09090b' : '#ffffff', fontSize: 24, fontWeight: 900 }}>
          {name.charAt(0)}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: isDark ? '#ffffff' : '#09090b',
              fontFamily: 'system-ui',
            }}
          >
            {name}
          </span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#3b82f6">
            <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
          </svg>
        </div>
        {handle && (
          <span
            style={{
              fontSize: 15,
              color: isDark ? '#a1a1aa' : '#71717a',
              fontWeight: 600,
              fontFamily: 'system-ui',
            }}
          >
            @{handle}
          </span>
        )}
      </div>
    </div>
  );
};

/* ================= STYLE 1: MAGAZINE ================= */
const Style1 = ({ data }: { data: Flier }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
    }}
  >
    <div style={{ height: '55%', position: 'relative', display: 'flex' }}>
      <img
        src={data.campaign_logo_url}
        alt="Campaign"
        width={1200}
        height={1200}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)',
          display: 'flex',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '40px 48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <ChariTLogo theme="dark" size={44} />
        <PaystackBadge theme="dark" />
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '0 48px 48px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: '#38bdf8',
            textTransform: 'uppercase',
            letterSpacing: 3,
          }}
        >
          Campaign #{data.campaign_id}
        </span>
        <h1
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: '#ffffff',
            lineHeight: 1.05,
            margin: 0,
            letterSpacing: -1.5,
            textShadow: '0 4px 24px rgba(0,0,0,0.4)',
          }}
        >
          {data.campaign_name || 'Support Our Cause'}
        </h1>
      </div>
    </div>

    <div style={{ flex: 1, display: 'flex', padding: '48px', gap: 48, background: '#ffffff' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 32 }}>
        {data._type === 'center' && data.center_name && (
          <CenterBadge name={data.center_name} handle={data.center_handle} />
        )}
        <p style={{ fontSize: 20, color: '#3f3f46', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
          {data.tagline ||
            'Every contribution brings us closer to making a real difference. Join thousands of donors who believe in this cause.'}
        </p>
        {data.details && (
          <p style={{ fontSize: 16, color: '#71717a', lineHeight: 1.6, margin: 0 }}>
            {data.details}
          </p>
        )}
        <div style={{ marginTop: 'auto', display: 'flex', width: '100%' }}>
          <ProgressBar raised={data.raised} goal={data.goal} large />
        </div>
      </div>

      <div
        style={{
          width: 320,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          padding: '32px',
          background: '#f8fafc',
          borderRadius: 32,
          border: '1px solid #e2e8f0',
        }}
      >
        <span style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', textAlign: 'center' }}>
          Scan to Donate
        </span>
        <QRCode url={data.qr_code_url} size={220} />
        <div style={{ width: '100%', height: 1, background: '#e2e8f0', margin: '8px 0' }} />
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#64748b',
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          Open your camera and point it at the code to support this campaign securely.
        </span>
      </div>
    </div>
  </div>
);

/* ================= STYLE 2: POSTER DARK ================= */
const Style2 = ({ data }: { data: Flier }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      background: '#09090b',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}
  >
    <div style={{ width: '45%', height: '100%', position: 'relative', display: 'flex' }}>
      <img
        src={data.campaign_logo_url}
        alt="Campaign"
        width={1200}
        height={1200}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, transparent 0%, #09090b 100%)',
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(9,9,11,0.8) 0%, transparent 100%)',
          display: 'flex',
        }}
      />

      <div style={{ position: 'absolute', top: 48, left: 48, display: 'flex' }}>
        <ChariTLogo theme="dark" size={48} />
      </div>
    </div>

    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '48px 48px 48px 0',
        justifyContent: 'center',
        gap: 32,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: '#38bdf8',
            textTransform: 'uppercase',
            letterSpacing: 3,
          }}
        >
          Campaign #{data.campaign_id}
        </span>
        <h1
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: '#ffffff',
            lineHeight: 1.1,
            margin: 0,
            letterSpacing: -1.5,
          }}
        >
          {data.campaign_name || 'Support Our Cause'}
        </h1>
      </div>

      {data._type === 'center' && data.center_name && (
        <CenterBadge name={data.center_name} handle={data.center_handle} theme="dark" />
      )}

      <p style={{ fontSize: 18, color: '#a1a1aa', lineHeight: 1.6, margin: 0 }}>
        {data.tagline ||
          'Your generosity creates ripples of change. Together, we can transform lives and build a brighter future for those who need it most.'}
      </p>

      {data.details && (
        <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.6, margin: 0 }}>{data.details}</p>
      )}

      <div
        style={{
          padding: '32px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 24,
          border: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          width: '100%',
        }}
      >
        <ProgressBar raised={data.raised} goal={data.goal} large theme="dark" />
      </div>

      <div
        style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 32,
          paddingTop: 32,
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <QRCode url={data.qr_code_url} size={140} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{ fontSize: 24, fontWeight: 900, color: '#ffffff' }}>Scan to Give</span>
          <span style={{ fontSize: 15, color: '#a1a1aa', lineHeight: 1.5 }}>
            Make an instant, secure donation. Every contribution matters.
          </span>
          <div style={{ marginTop: 8, display: 'flex' }}>
            <PaystackBadge theme="dark" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ================= STYLE 3: TICKET CARD ================= */
const Style3 = ({ data }: { data: Flier }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#e4e4e7',
      padding: 48,
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}
  >
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#ffffff',
        borderRadius: 40,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 24px 64px rgba(0,0,0,0.1)',
        overflow: 'hidden',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          padding: '32px 48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#09090b',
        }}
      >
        <ChariTLogo theme="dark" size={40} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#a1a1aa',
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            Ticket #{data.campaign_id}
          </span>
          <PaystackBadge theme="dark" />
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', padding: 48, gap: 48 }}>
        <div
          style={{
            width: '45%',
            borderRadius: 24,
            overflow: 'hidden',
            display: 'flex',
            boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
          }}
        >
          <img
            src={data.campaign_logo_url}
            alt="Campaign"
            width={1200}
            height={1200}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <h1
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: '#09090b',
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: -1,
            }}
          >
            {data.campaign_name || 'Support Our Cause'}
          </h1>
          <p style={{ fontSize: 18, color: '#52525b', lineHeight: 1.5, margin: 0 }}>
            {data.tagline ||
              'Be part of something bigger. Your donation directly impacts lives and creates lasting change.'}
          </p>

          {data._type === 'center' && data.center_name && (
            <CenterBadge name={data.center_name} handle={data.center_handle} />
          )}

          <div
            style={{
              marginTop: 'auto',
              padding: '32px',
              background: '#f4f4f5',
              borderRadius: 24,
              display: 'flex',
              width: '100%',
            }}
          >
            <ProgressBar raised={data.raised} goal={data.goal} large />
          </div>
        </div>
      </div>

      {/* Dashed Separator */}
      <div
        style={{
          width: '100%',
          height: 2,
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ width: '100%', height: '100%', borderBottom: '4px dashed #d4d4d8' }} />
      </div>

      {/* Bottom Footer */}
      <div
        style={{
          padding: '40px 48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#fafafa',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
          <span style={{ fontSize: 28, fontWeight: 900, color: '#09090b' }}>
            Scan to Donate Instantly
          </span>
          <span style={{ fontSize: 16, color: '#71717a' }}>
            Your support makes all the difference. Scan the code to access our secure payment
            gateway.
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <DonationLink url={data.qr_code_url} />
          <QRCode url={data.qr_code_url} size={140} />
        </div>
      </div>
    </div>
  </div>
);

/* ================= STYLE 4: STORY MODE ================= */
const Style4 = ({ data }: { data: Flier }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}
  >
    <div style={{ height: '48%', position: 'relative', display: 'flex' }}>
      <img
        src={data.campaign_logo_url}
        alt="Campaign"
        width={1200}
        height={1200}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, #0f172a 0%, transparent 80%)',
          display: 'flex',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 32,
          left: 40,
          right: 40,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <ChariTLogo size={40} theme="dark" />
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#ffffff',
            background: 'rgba(0,0,0,0.5)',
            padding: '8px 16px',
            borderRadius: 20,
            letterSpacing: 2,
          }}
        >
          CAMPAIGN #{data.campaign_id}
        </span>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <h1
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: '#ffffff',
            lineHeight: 1.1,
            margin: 0,
            letterSpacing: -1.5,
          }}
        >
          {data.campaign_name || 'Support Our Cause'}
        </h1>
      </div>
    </div>

    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px', gap: 32 }}>
      {data._type === 'center' && data.center_name && (
        <CenterBadge name={data.center_name} handle={data.center_handle} />
      )}

      <p style={{ fontSize: 22, color: '#334155', lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
        {data.tagline ||
          'When you give, you are not just donating money. You are giving hope, opportunity, and a chance at a better tomorrow.'}
      </p>

      {data.details && (
        <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{data.details}</p>
      )}

      <div
        style={{
          display: 'flex',
          gap: 24,
          padding: '32px',
          background: '#ffffff',
          borderRadius: 24,
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
        }}
      >
        <div
          style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        >
          <ProgressBar raised={data.raised} goal={data.goal} large />
        </div>
      </div>

      <div
        style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px',
          background: '#0f172a',
          borderRadius: 24,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: '#ffffff' }}>
            Ready to make an impact?
          </span>
          <span style={{ fontSize: 15, color: '#94a3b8' }}>Scan the code to donate securely.</span>
          <div style={{ display: 'flex', marginTop: 8 }}>
            <PaystackBadge theme="dark" />
          </div>
        </div>
        <QRCode url={data.qr_code_url} size={130} />
      </div>
    </div>
  </div>
);

/* ================= STYLE 5: MINIMAL IMPACT ================= */
const Style5 = ({ data }: { data: Flier }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: 48,
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 48,
      }}
    >
      <ChariTLogo size={44} />
      <span
        style={{
          fontSize: 14,
          fontWeight: 800,
          color: '#a1a1aa',
          textTransform: 'uppercase',
          letterSpacing: 2,
        }}
      >
        Campaign #{data.campaign_id}
      </span>
    </div>

    <div style={{ flex: 1, display: 'flex', gap: 48 }}>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
          justifyContent: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h1
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: '#09090b',
              lineHeight: 1.05,
              margin: 0,
              letterSpacing: -2,
            }}
          >
            {data.campaign_name || 'Support Our Cause'}
          </h1>
          <p
            style={{ fontSize: 20, color: '#52525b', lineHeight: 1.5, margin: 0, fontWeight: 500 }}
          >
            {data.tagline ||
              'Small acts, when multiplied by millions of people, can transform the world.'}
          </p>
        </div>

        {data._type === 'center' && data.center_name && (
          <CenterBadge name={data.center_name} handle={data.center_handle} />
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            padding: '40px',
            background: '#09090b',
            borderRadius: 32,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          }}
        >
          <span
            style={{
              fontSize: 14,
              color: '#a1a1aa',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 1.5,
            }}
          >
            Total Raised
          </span>
          <span
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: -2,
              lineHeight: 1,
            }}
          >
            {formatAmount(data.raised)}
          </span>
          {data.goal && (
            <span style={{ fontSize: 18, color: '#71717a', fontWeight: 600 }}>
              of {formatAmount(data.goal)} goal • {getProgress(data.raised, data.goal)}%
            </span>
          )}
          {data.goal && (
            <div
              style={{
                width: '100%',
                height: 12,
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 100,
                overflow: 'hidden',
                display: 'flex',
                marginTop: 8,
              }}
            >
              <div
                style={{
                  width: `${getProgress(data.raised, data.goal)}%`,
                  height: '100%',
                  background: '#ffffff',
                  borderRadius: 100,
                  display: 'flex',
                }}
              />
            </div>
          )}
        </div>

        {data.details && (
          <p
            style={{
              fontSize: 15,
              color: '#71717a',
              lineHeight: 1.6,
              margin: 0,
              padding: '20px',
              background: '#fafafa',
              borderRadius: 16,
              border: '1px solid #e4e4e7',
            }}
          >
            {data.details}
          </p>
        )}
      </div>

      <div style={{ width: 400, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div
          style={{
            flex: 1,
            borderRadius: 32,
            overflow: 'hidden',
            display: 'flex',
            boxShadow: '0 24px 48px rgba(0,0,0,0.08)',
          }}
        >
          <img
            src={data.campaign_logo_url}
            alt="Campaign"
            width={1200}
            height={1200}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 32px',
            background: '#f4f4f5',
            borderRadius: 24,
            border: '1px solid #e4e4e7',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#09090b' }}>Scan to Donate</span>
            <PaystackBadge />
          </div>
          <QRCode url={data.qr_code_url} size={110} />
        </div>
      </div>
    </div>
  </div>
);

const FlierImage = ({ data }: { data: Flier }) => {
  const renderStyle = () => {
    switch (data.style) {
      case 1:
        return <Style1 data={data} />;
      case 2:
        return <Style2 data={data} />;
      case 3:
        return <Style3 data={data} />;
      case 4:
        return <Style4 data={data} />;
      case 5:
        return <Style5 data={data} />;
      default:
        return <Style1 data={data} />;
    }
  };

  return new ImageResponse(renderStyle(), {
    width: 1200,
    height: 1600,
  });
};

export { FlierImage };
export type { Flier };
