
import { ImageResponse } from 'next/og';

type Flier = {
  _type: "center" | "normal";
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
  return "N" + new Intl.NumberFormat('en-US').format(Number(amount));
};

const getProgress = (raised: string, goal?: string) => {
  if (!goal) return null;
  const r = parseFloat(raised);
  const g = parseFloat(goal);
  if (isNaN(r) || isNaN(g) || g === 0) return null;
  return Math.min(Math.round((r / g) * 100), 100);
};

const ChariTLogo = ({ size = 40 }: { size?: number }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  }}>
    <div style={{
      width: size,
      height: size,
      background: '#111111',
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <span style={{
        color: '#ffffff',
        fontSize: size * 0.5,
        fontWeight: 900,
        fontFamily: 'system-ui',
      }}>C</span>
    </div>
    <span style={{
      fontSize: size * 0.55,
      fontWeight: 800,
      color: '#111111',
      letterSpacing: -0.5,
      fontFamily: 'system-ui',
    }}>Chari-T</span>
  </div>
);

const PaystackBadge = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 12px',
    background: '#f8f8f8',
    borderRadius: 20,
  }}>
    <span style={{
      fontSize: 11,
      color: '#888888',
      fontWeight: 600,
      fontFamily: 'system-ui',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    }}>Powered by</span>
    <span style={{
      fontSize: 13,
      color: '#00C3F7',
      fontWeight: 800,
      fontFamily: 'system-ui',
    }}>Paystack</span>
  </div>
);

const QRCode = ({ url, label }: { url: string; label?: string }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  }}>
    <div style={{
      width: 160,
      height: 160,
      background: '#ffffff',
      borderRadius: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid #e5e5e5',
      padding: 12,
    }}>
      <img
        src={url}
        alt="QR Code"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
    {label && (
      <span style={{
        fontSize: 13,
        fontWeight: 700,
        color: '#666666',
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontFamily: 'system-ui',
      }}>{label}</span>
    )}
  </div>
);

const DonationLink = ({ url }: { url: string }) => {
    const Url = new URL(url)
    const donate_url = Url.searchParams.get("data")

    return (
        <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    padding: '16px 24px',
    background: '#111111',
    borderRadius: 16,
    width: '100%',
  }}>
    <span style={{
      fontSize: 12,
      fontWeight: 700,
      color: '#888888',
      textTransform: 'uppercase',
      letterSpacing: 2,
      fontFamily: 'system-ui',
    }}>Go to this link</span>
    <span style={{
      fontSize: 18,
      fontWeight: 800,
      color: '#ffffff',
      fontFamily: 'system-ui',
      letterSpacing: 0.5,
      wordBreak: 'break-all',
      textAlign: 'center',
    }}>{donate_url}</span>
  </div>
    )

  };

const ProgressBar = ({ raised, goal, large = false }: { raised: string; goal?: string; large?: boolean }) => {
  const progress = getProgress(raised, goal);
  if (!progress) return null;
  return (
    <div style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: large ? 12 : 8,
    }}>
      <div style={{
        width: '100%',
        height: large ? 14 : 8,
        background: '#f0f0f0',
        borderRadius: large ? 7 : 4,
        overflow: 'hidden',
        display: 'flex',
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: '#111111',
          borderRadius: large ? 7 : 4,
          display: 'flex',
        }} />
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <span style={{
          fontSize: large ? 18 : 13,
          color: '#888888',
          fontWeight: 700,
          fontFamily: 'system-ui',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}>{progress}% funded</span>
        <span style={{
          fontSize: large ? 18 : 13,
          color: '#888888',
          fontWeight: 600,
          fontFamily: 'system-ui',
        }}>{formatAmount(raised)} of {formatAmount(goal || '0')}</span>
      </div>
    </div>
  );
};

const BigStat = ({ label, value, color = '#111111' }: { label: string; value: string; color?: string }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  }}>
    <span style={{
      fontSize: 14,
      color: '#888888',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      fontFamily: 'system-ui',
    }}>{label}</span>
    <span style={{
      fontSize: 64,
      fontWeight: 900,
      color,
      fontFamily: 'system-ui',
      letterSpacing: -2,
      lineHeight: 1,
    }}>{value}</span>
  </div>
);

const CenterBadge = ({ name, handle }: { name: string; handle?: string }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '16px 24px',
    background: '#f8f8f8',
    borderRadius: 16,
    border: '1px solid #e5e5e5',
  }}>
    <div style={{
      width: 48,
      height: 48,
      background: '#111111',
      borderRadius: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <span style={{ color: '#ffffff', fontSize: 20, fontWeight: 900 }}>{name.charAt(0)}</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          fontSize: 18,
          fontWeight: 800,
          color: '#111111',
          fontFamily: 'system-ui',
        }}>{name}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#1DA1F2">
          <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/>
        </svg>
      </div>
      {handle && (
        <span style={{
          fontSize: 14,
          color: '#888888',
          fontWeight: 600,
          fontFamily: 'system-ui',
        }}>@{handle}</span>
      )}
    </div>
  </div>
);


const Style1 = ({ data }: { data: Flier }) => (
  <div style={{
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: '#ffffff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    position: 'relative',
  }}>
    {/* Hero Image */}
    <div style={{
      height: '45%',
      position: 'relative',
      display: 'flex',
    }}>
      <img
        src={data.campaign_logo_url}
        alt="Campaign"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7))',
        display: 'flex',
      }} />

      {/* Top bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '30px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <ChariTLogo size={36} />
        <PaystackBadge />
      </div>

      {/* Campaign title overlay */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '0 40px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        <span style={{
          fontSize: 12,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.7)',
          textTransform: 'uppercase',
          letterSpacing: 2,
        }}>Campaign #{data.campaign_id}</span>
        <h1 style={{
          fontSize: 52,
          fontWeight: 900,
          color: '#ffffff',
          lineHeight: 1.1,
          margin: 0,
          letterSpacing: -1,
        }}>
          {data.campaign_name || 'Support Our Cause'}
        </h1>
      </div>
    </div>

    {/* Content */}
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '36px 40px',
      gap: 24,
    }}>
      {data._type === 'center' && data.center_name && (
        <CenterBadge name={data.center_name} handle={data.center_handle} />
      )}

      <div style={{
        display: 'flex',
        gap: 40,
      }}>
        <BigStat label="Raised" value={formatAmount(data.raised)} />
        {data.goal && (
          <BigStat label="Goal" value={formatAmount(data.goal)} color="#666666" />
        )}
      </div>

      <ProgressBar raised={data.raised} goal={data.goal} large />

      <p style={{
        fontSize: 17,
        color: '#444444',
        lineHeight: 1.5,
        margin: 0,
        fontWeight: 500,
      }}>
        {data.tagline || "Every contribution brings us closer to making a real difference. Join thousands of donors who believe in this cause."}
      </p>

      {data.details && (
        <p style={{
          fontSize: 14,
          color: '#666666',
          lineHeight: 1.6,
          margin: 0,
        }}>
          {data.details}
        </p>
      )}

      {/* Bold Donation Link */}
      <DonationLink url={data.qr_code_url} />

      {/* Bottom: QR + CTA */}
      <div style={{
        marginTop: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 20,
        borderTop: '1px solid #f0f0f0',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#111111' }}>Scan to Donate</span>
          <span style={{ fontSize: 13, color: '#888888', maxWidth: 280 }}>
            Quick, secure payments powered by Paystack. Every naira counts.
          </span>
        </div>
        <QRCode url={data.qr_code_url} label="Scan Me" />
      </div>
    </div>
  </div>
);


const Style2 = ({ data }: { data: Flier }) => (
  <div style={{
    width: '100%',
    height: '100%',
    display: 'flex',
    background: '#0a0a0a',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  }}>
    {/* Left: Image */}
    <div style={{
      width: '40%',
      height: '100%',
      position: 'relative',
      display: 'flex',
    }}>
      <img
        src={data.campaign_logo_url}
        alt="Campaign"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to right, transparent 30%, #0a0a0a)',
        display: 'flex',
      }} />
    </div>

    {/* Right: Content */}
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '40px',
      justifyContent: 'center',
      gap: 22,
    }}>
      <ChariTLogo size={32} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          color: '#555555',
          textTransform: 'uppercase',
          letterSpacing: 2,
        }}>Campaign #{data.campaign_id}</span>
        <h1 style={{
          fontSize: 38,
          fontWeight: 900,
          color: '#ffffff',
          lineHeight: 1.1,
          margin: 0,
          letterSpacing: -1,
        }}>
          {data.campaign_name || 'Support Our Cause'}
        </h1>
      </div>

      {data._type === 'center' && data.center_name && (
        <CenterBadge name={data.center_name} handle={data.center_handle} />
      )}

      <p style={{
        fontSize: 15,
        color: '#888888',
        lineHeight: 1.6,
        margin: 0,
      }}>
        {data.tagline || "Your generosity creates ripples of change. Together, we can transform lives and build a brighter future for those who need it most."}
      </p>

      {data.details && (
        <p style={{
          fontSize: 13,
          color: '#666666',
          lineHeight: 1.6,
          margin: 0,
        }}>
          {data.details}
        </p>
      )}

      <div style={{
        display: 'flex',
        gap: 32,
        padding: '24px',
        background: '#1a1a1a',
        borderRadius: 16,
      }}>
        <BigStat label="Raised" value={formatAmount(data.raised)} color="#ffffff" />
        {data.goal && (
          <BigStat label="Goal" value={formatAmount(data.goal)} color="#aaaaaa" />
        )}
      </div>

      {data.goal && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{
            width: '100%',
            height: 8,
            background: '#222222',
            borderRadius: 4,
            overflow: 'hidden',
            display: 'flex',
          }}>
            <div style={{
              width: `${getProgress(data.raised, data.goal)}%`,
              height: '100%',
              background: '#ffffff',
              borderRadius: 4,
              display: 'flex',
            }} />
          </div>
          <span style={{ fontSize: 13, color: '#555555', fontWeight: 700 }}>
            {getProgress(data.raised, data.goal)}% of goal reached
          </span>
        </div>
      )}

      {/* Bold Donation Link */}
      <div style={{
        padding: '14px 20px',
        background: '#ffffff',
        borderRadius: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}>
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          color: '#888888',
          textTransform: 'uppercase',
          letterSpacing: 2,
          fontFamily: 'system-ui',
        }}>Go to this link</span>
        <span style={{
          fontSize: 16,
          fontWeight: 800,
          color: '#111111',
          fontFamily: 'system-ui',
          wordBreak: 'break-all',
        }}>{new URL(data.qr_code_url).searchParams.get("data")}</span>
      </div>

      {/* QR + Footer */}
      <div style={{
        marginTop: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 20,
        borderTop: '1px solid #222222',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#ffffff' }}>Scan to Give</span>
          <PaystackBadge />
        </div>
        <QRCode url={data.qr_code_url} />
      </div>
    </div>
  </div>
);

// ─── STYLE 3: TICKET STYLE ─────────────────────────────────────────
const Style3 = ({ data }: { data: Flier }) => (
  <div style={{
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#e8e8e8',
    padding: 32,
    fontFamily: 'system-ui, -apple-system, sans-serif',
  }}>
    <div style={{
      width: '100%',
      maxWidth: 900,
      background: '#ffffff',
      borderRadius: 24,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 4px 40px rgba(0,0,0,0.08)',
    }}>
      {/* Ticket header */}
      <div style={{
        padding: '24px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '2px dashed #e5e5e5',
      }}>
        <ChariTLogo size={32} />
        <span style={{
          fontSize: 12,
          fontWeight: 700,
          color: '#aaaaaa',
          textTransform: 'uppercase',
          letterSpacing: 2,
        }}>Campaign #{data.campaign_id}</span>
      </div>

      {/* Ticket body */}
      <div style={{
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        gap: 22,
      }}>
        <div style={{
          width: '100%',
          height: 240,
          borderRadius: 16,
          overflow: 'hidden',
          display: 'flex',
        }}>
          <img
            src={data.campaign_logo_url}
            alt="Campaign"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h1 style={{
            fontSize: 32,
            fontWeight: 900,
            color: '#111111',
            margin: 0,
            lineHeight: 1.2,
          }}>
            {data.campaign_name || 'Support Our Cause'}
          </h1>
          <p style={{
            fontSize: 15,
            color: '#666666',
            lineHeight: 1.5,
            margin: 0,
          }}>
            {data.tagline || "Be part of something bigger. Your donation directly impacts lives and creates lasting change in communities that need it most."}
          </p>
        </div>

        {data._type === 'center' && data.center_name && (
          <CenterBadge name={data.center_name} handle={data.center_handle} />
        )}

        <div style={{
          display: 'flex',
          gap: 16,
        }}>
          <div style={{
            flex: 1,
            padding: 20,
            background: '#fafafa',
            borderRadius: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            alignItems: 'center',
            textAlign: 'center',
          }}>
            <span style={{ fontSize: 11, color: '#888888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Raised</span>
            <span style={{ fontSize: 32, fontWeight: 900, color: '#111111' }}>{formatAmount(data.raised)}</span>
          </div>
          {data.goal && (
            <div style={{
              flex: 1,
              padding: 20,
              background: '#fafafa',
              borderRadius: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              alignItems: 'center',
              textAlign: 'center',
            }}>
              <span style={{ fontSize: 11, color: '#888888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Goal</span>
              <span style={{ fontSize: 32, fontWeight: 900, color: '#111111' }}>{formatAmount(data.goal)}</span>
            </div>
          )}
          <div style={{
            flex: 1,
            padding: 20,
            background: '#fafafa',
            borderRadius: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            alignItems: 'center',
            textAlign: 'center',
          }}>
            <span style={{ fontSize: 11, color: '#888888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Status</span>
            <span style={{ fontSize: 32, fontWeight: 900, color: '#111111' }}>
              {getProgress(data.raised, data.goal) || 0}%
            </span>
          </div>
        </div>

        <ProgressBar raised={data.raised} goal={data.goal} large />

        {data.details && (
          <p style={{
            fontSize: 13,
            color: '#666666',
            lineHeight: 1.6,
            margin: 0,
            padding: '14px',
            background: '#fafafa',
            borderRadius: 12,
          }}>
            {data.details}
          </p>
        )}

        {/* Bold Donation Link */}
        <DonationLink url={data.qr_code_url} />
      </div>

      {/* Ticket footer */}
      <div style={{
        padding: '24px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '2px dashed #e5e5e5',
        background: '#fafafa',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#111111' }}>Scan to Donate Instantly</span>
          <PaystackBadge />
        </div>
        <QRCode url={data.qr_code_url} label="Scan Me" />
      </div>
    </div>
  </div>
);

// ─── STYLE 4: FULL BLEED STORY ────────────────────────────────────
const Style4 = ({ data }: { data: Flier }) => (
  <div style={{
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: '#ffffff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  }}>
    {/* Full bleed image */}
    <div style={{
      height: '42%',
      position: 'relative',
      display: 'flex',
    }}>
      <img
        src={data.campaign_logo_url}
        alt="Campaign"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
        display: 'flex',
      }} />

      {/* Floating header */}
      <div style={{
        position: 'absolute',
        top: 24,
        left: 32,
        right: 32,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <ChariTLogo size={34} />
        <PaystackBadge />
      </div>

      {/* Title on image */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '0 32px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.6)',
          textTransform: 'uppercase',
          letterSpacing: 2,
        }}>Campaign #{data.campaign_id}</span>
        <h1 style={{
          fontSize: 44,
          fontWeight: 900,
          color: '#ffffff',
          lineHeight: 1.1,
          margin: 0,
        }}>
          {data.campaign_name || 'Support Our Cause'}
        </h1>
      </div>
    </div>

    {/* Story section */}
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '32px',
      gap: 20,
    }}>
      {data._type === 'center' && data.center_name && (
        <CenterBadge name={data.center_name} handle={data.center_handle} />
      )}

      <p style={{
        fontSize: 18,
        color: '#333333',
        lineHeight: 1.6,
        margin: 0,
        fontWeight: 500,
      }}>
        {data.tagline || "When you give, you are not just donating money. You are giving hope, opportunity, and a chance at a better tomorrow. Join our community of changemakers."}
      </p>

      {data.details && (
        <p style={{
          fontSize: 14,
          color: '#555555',
          lineHeight: 1.6,
          margin: 0,
        }}>
          {data.details}
        </p>
      )}

      {/* Impact stats */}
      <div style={{
        display: 'flex',
        gap: 20,
        padding: '24px',
        background: '#f8f8f8',
        borderRadius: 16,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          <span style={{ fontSize: 36, fontWeight: 900, color: '#111111' }}>{formatAmount(data.raised)}</span>
          <span style={{ fontSize: 11, color: '#888888', fontWeight: 700, textTransform: 'uppercase' }}>Raised so far</span>
        </div>
        {data.goal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
            <span style={{ fontSize: 36, fontWeight: 900, color: '#666666' }}>{formatAmount(data.goal)}</span>
            <span style={{ fontSize: 11, color: '#888888', fontWeight: 700, textTransform: 'uppercase' }}>Our target</span>
          </div>
        )}
      </div>

      <ProgressBar raised={data.raised} goal={data.goal} large />

      {/* Bold Donation Link */}
      <DonationLink url={data.qr_code_url} />

      {/* CTA */}
      <div style={{
        marginTop: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 20,
        borderTop: '1px solid #f0f0f0',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#111111' }}>Ready to make an impact?</span>
          <span style={{ fontSize: 13, color: '#888888' }}>Scan the code to donate securely via Paystack</span>
        </div>
        <QRCode url={data.qr_code_url} label="Scan Me" />
      </div>
    </div>
  </div>
);

// ─── STYLE 5: EDITORIAL GRID ──────────────────────────────────────
const Style5 = ({ data }: { data: Flier }) => (
  <div style={{
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: '#fafafa',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: 40,
  }}>
    {/* Top */}
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 24,
    }}>
      <ChariTLogo size={36} />
      <span style={{
        fontSize: 12,
        fontWeight: 700,
        color: '#bbbbbb',
        textTransform: 'uppercase',
        letterSpacing: 2,
      }}>Campaign #{data.campaign_id}</span>
    </div>

    {/* Main grid */}
    <div style={{
      flex: 1,
      display: 'flex',
      gap: 32,
    }}>
      {/* Left: Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        justifyContent: 'center',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h1 style={{
            fontSize: 48,
            fontWeight: 900,
            color: '#111111',
            lineHeight: 1.1,
            margin: 0,
            letterSpacing: -1.5,
          }}>
            {data.campaign_name || 'Support Our Cause'}
          </h1>
          <p style={{
            fontSize: 16,
            color: '#555555',
            lineHeight: 1.6,
            margin: 0,
          }}>
            {data.tagline || "Small acts, when multiplied by millions of people, can transform the world. Your donation is the spark that ignites change."}
          </p>
        </div>

        {data._type === 'center' && data.center_name && (
          <CenterBadge name={data.center_name} handle={data.center_handle} />
        )}

        {/* Big number */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          padding: '28px',
          background: '#111111',
          borderRadius: 20,
        }}>
          <span style={{ fontSize: 12, color: '#666666', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Total Raised</span>
          <span style={{ fontSize: 52, fontWeight: 900, color: '#ffffff', letterSpacing: -2 }}>{formatAmount(data.raised)}</span>
          {data.goal && (
            <span style={{ fontSize: 15, color: '#444444', fontWeight: 600 }}>
              of {formatAmount(data.goal)} goal ({getProgress(data.raised, data.goal)}%)
            </span>
          )}
        </div>

        {data.goal && (
          <div style={{
            width: '100%',
            height: 10,
            background: '#e5e5e5',
            borderRadius: 5,
            overflow: 'hidden',
            display: 'flex',
          }}>
            <div style={{
              width: `${getProgress(data.raised, data.goal)}%`,
              height: '100%',
              background: '#111111',
              borderRadius: 5,
              display: 'flex',
            }} />
          </div>
        )}

        {data.details && (
          <p style={{
            fontSize: 13,
            color: '#666666',
            lineHeight: 1.6,
            margin: 0,
            padding: '14px',
            background: '#ffffff',
            borderRadius: 12,
            border: '1px solid #e5e5e5',
          }}>
            {data.details}
          </p>
        )}

        {/* Bold Donation Link */}
        <DonationLink url={data.qr_code_url} />
      </div>

      {/* Right: Image + QR */}
      <div style={{
        width: 360,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        <div style={{
          flex: 1,
          borderRadius: 20,
          overflow: 'hidden',
          display: 'flex',
        }}>
          <img
            src={data.campaign_logo_url}
            alt="Campaign"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 22px',
          background: '#ffffff',
          borderRadius: 16,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#111111' }}>Scan to Donate</span>
            <PaystackBadge />
          </div>
          <QRCode url={data.qr_code_url} />
        </div>
      </div>
    </div>
  </div>
);

// ─── MAIN EXPORT ────────────────────────────────────────────────────

const FlierImage = ({ data }: { data: Flier }) => {
  const renderStyle = () => {
    switch (data.style) {
      case 1: return <Style1 data={data} />;
      case 2: return <Style2 data={data} />;
      case 3: return <Style3 data={data} />;
      case 4: return <Style4 data={data} />;
      case 5: return <Style5 data={data} />;
      default: return <Style1 data={data} />;
    }
  };

  return new ImageResponse(renderStyle(), {
    width: 1200,
    height: 1600,
  });
};

export { FlierImage };
export type { Flier };
