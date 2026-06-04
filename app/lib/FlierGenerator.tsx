import { ImageResponse } from 'next/og';

// Types remain the same
type Flier = {
  _type: "center" | "normal";
  goal?: string;
  raised: string;
  campaign_id: number;
  campaign_name?: string;
  style: 1 | 2 | 3 | 4 | 5;
  center_logo_url?: string;
  campaign_logo_url: string;
};

// Helper: format currency
const formatAmount = (amount: string) => {
  const num = parseFloat(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num);
};

// Helper: calculate progress percentage
const getProgress = (raised: string, goal?: string) => {
  if (!goal) return null;
  const r = parseFloat(raised);
  const g = parseFloat(goal);
  return Math.min(Math.round((r / g) * 100), 100);
};

// ─── STYLE 1: Minimal Hero ───
const Style1 = ({ data }: { data: Flier }) => (
  <div style={{
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#ffffff',
    padding: 80,
    fontFamily: 'system-ui, -apple-system, sans-serif',
  }}>
    {data.center_logo_url && (
      <img
        src={data.center_logo_url}
        alt="Center Logo"
        style={{ width: 120, height: 120, objectFit: 'contain', marginBottom: 48 }}
      />
    )}

    <img
      src={data.campaign_logo_url}
      alt="Campaign"
      style={{
        width: '100%',
        height: 400,
        objectFit: 'cover',
        borderRadius: 16,
        marginBottom: 48,
      }}
    />

    <h1 style={{
      fontSize: 56,
      fontWeight: 800,
      color: '#1a1a1a',
      textAlign: 'center',
      lineHeight: 1.2,
      margin: 0,
      marginBottom: 24,
    }}>
      {data.campaign_name || 'Support Our Cause'}
    </h1>

    <div style={{
      display: 'flex',
      alignItems: 'baseline',
      gap: 16,
      marginBottom: 16,
    }}>
      <span style={{ fontSize: 72, fontWeight: 900, color: '#111111' }}>
        {formatAmount(data.raised)}
      </span>
      <span style={{ fontSize: 28, color: '#666666', fontWeight: 500 }}>
        raised
      </span>
    </div>

    {data.goal && (
      <div style={{
        width: '100%',
        height: 12,
        background: '#f0f0f0',
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: 16,
      }}>
        <div style={{
          width: `${getProgress(data.raised, data.goal)}%`,
          height: '100%',
          background: '#1a1a1a',
          borderRadius: 6,
        }} />
      </div>
    )}

    {data.goal && (
      <p style={{
        fontSize: 24,
        color: '#666666',
        margin: 0,
        fontWeight: 500,
      }}>
        Goal: {formatAmount(data.goal)}
      </p>
    )}

    <div style={{
      marginTop: 'auto',
      paddingTop: 48,
      borderTop: '2px solid #f0f0f0',
      width: '100%',
      textAlign: 'center',
    }}>
      <p style={{ fontSize: 20, color: '#999999', margin: 0 }}>
        Campaign #{data.campaign_id}
      </p>
    </div>
  </div>
);

// ─── STYLE 2: Split Layout ───
const Style2 = ({ data }: { data: Flier }) => (
  <div style={{
    width: '100%',
    height: '100%',
    display: 'flex',
    background: '#ffffff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  }}>
    <div style={{
      width: '50%',
      height: '100%',
      position: 'relative',
    }}>
      <img
        src={data.campaign_logo_url}
        alt="Campaign"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to right, rgba(0,0,0,0.4), transparent)',
      }} />
    </div>

    <div style={{
      width: '50%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: 60,
      background: '#fafafa',
    }}>
      {data.center_logo_url && (
        <img
          src={data.center_logo_url}
          alt="Center Logo"
          style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 40 }}
        />
      )}

      <h1 style={{
        fontSize: 44,
        fontWeight: 800,
        color: '#1a1a1a',
        lineHeight: 1.15,
        margin: 0,
        marginBottom: 32,
      }}>
        {data.campaign_name || 'Support Our Cause'}
      </h1>

      <div style={{ marginBottom: 32 }}>
        <p style={{
          fontSize: 18,
          color: '#888888',
          textTransform: 'uppercase',
          letterSpacing: 2,
          margin: 0,
          marginBottom: 8,
          fontWeight: 600,
        }}>
          Raised so far
        </p>
        <p style={{
          fontSize: 52,
          fontWeight: 900,
          color: '#111111',
          margin: 0,
        }}>
          {formatAmount(data.raised)}
        </p>
      </div>

      {data.goal && (
        <div>
          <div style={{
            width: '100%',
            height: 8,
            background: '#e5e5e5',
            borderRadius: 4,
            overflow: 'hidden',
            marginBottom: 12,
          }}>
            <div style={{
              width: `${getProgress(data.raised, data.goal)}%`,
              height: '100%',
              background: '#1a1a1a',
              borderRadius: 4,
            }} />
          </div>
          <p style={{ fontSize: 18, color: '#666666', margin: 0, fontWeight: 500 }}>
            {getProgress(data.raised, data.goal)}% of {formatAmount(data.goal)} goal
          </p>
        </div>
      )}

      <p style={{
        marginTop: 'auto',
        fontSize: 16,
        color: '#aaaaaa',
        margin: 0,
        paddingTop: 40,
      }}>
        Campaign #{data.campaign_id}
      </p>
    </div>
  </div>
);

// ─── STYLE 3: Card Stack ───
const Style3 = ({ data }: { data: Flier }) => (
  <div style={{
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f5f5f5',
    padding: 60,
    fontFamily: 'system-ui, -apple-system, sans-serif',
  }}>
    <div style={{
      width: '100%',
      maxWidth: 900,
      background: '#ffffff',
      borderRadius: 24,
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
    }}>
      <div style={{ position: 'relative', height: 500 }}>
        <img
          src={data.campaign_logo_url}
          alt="Campaign"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {data.center_logo_url && (
          <div style={{
            position: 'absolute',
            top: 24,
            left: 24,
            background: '#ffffff',
            borderRadius: 16,
            padding: 12,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}>
            <img
              src={data.center_logo_url}
              alt="Center Logo"
              style={{ width: 60, height: 60, objectFit: 'contain' }}
            />
          </div>
        )}
      </div>

      <div style={{ padding: 48 }}>
        <h1 style={{
          fontSize: 42,
          fontWeight: 800,
          color: '#1a1a1a',
          margin: 0,
          marginBottom: 32,
        }}>
          {data.campaign_name || 'Support Our Cause'}
        </h1>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 24,
        }}>
          <div>
            <p style={{
              fontSize: 16,
              color: '#888888',
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              margin: 0,
              marginBottom: 8,
              fontWeight: 600,
            }}>
              Raised
            </p>
            <p style={{
              fontSize: 48,
              fontWeight: 900,
              color: '#111111',
              margin: 0,
            }}>
              {formatAmount(data.raised)}
            </p>
          </div>

          {data.goal && (
            <div style={{ textAlign: 'right' }}>
              <p style={{
                fontSize: 16,
                color: '#888888',
                textTransform: 'uppercase',
                letterSpacing: 1.5,
                margin: 0,
                marginBottom: 8,
                fontWeight: 600,
              }}>
                Goal
              </p>
              <p style={{
                fontSize: 32,
                fontWeight: 700,
                color: '#444444',
                margin: 0,
              }}>
                {formatAmount(data.goal)}
              </p>
            </div>
          )}
        </div>

        {data.goal && (
          <div style={{
            width: '100%',
            height: 10,
            background: '#f0f0f0',
            borderRadius: 5,
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${getProgress(data.raised, data.goal)}%`,
              height: '100%',
              background: '#1a1a1a',
              borderRadius: 5,
            }} />
          </div>
        )}

        <p style={{
          marginTop: 24,
          fontSize: 16,
          color: '#bbbbbb',
          margin: 0,
          textAlign: 'right',
        }}>
          Campaign #{data.campaign_id}
        </p>
      </div>
    </div>
  </div>
);

// ─── STYLE 4: Bold Typography ───
const Style4 = ({ data }: { data: Flier }) => (
  <div style={{
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: '#111111',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  }}>
    <div style={{
      height: '55%',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <img
        src={data.campaign_logo_url}
        alt="Campaign"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.85,
        }}
      />
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60%',
        background: 'linear-gradient(to top, #111111, transparent)',
      }} />

      {data.center_logo_url && (
        <div style={{
          position: 'absolute',
          top: 40,
          right: 40,
          background: '#ffffff',
          borderRadius: 12,
          padding: 10,
        }}>
          <img
            src={data.center_logo_url}
            alt="Center Logo"
            style={{ width: 56, height: 56, objectFit: 'contain' }}
          />
        </div>
      )}
    </div>

    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 60px 60px',
    }}>
      <h1 style={{
        fontSize: 52,
        fontWeight: 900,
        color: '#ffffff',
        lineHeight: 1.1,
        margin: 0,
        marginBottom: 40,
        letterSpacing: -1,
      }}>
        {data.campaign_name || 'Support Our Cause'}
      </h1>

      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 24,
        marginBottom: 32,
      }}>
        <div>
          <p style={{
            fontSize: 16,
            color: '#888888',
            textTransform: 'uppercase',
            letterSpacing: 2,
            margin: 0,
            marginBottom: 8,
            fontWeight: 600,
          }}>
            Raised
          </p>
          <p style={{
            fontSize: 64,
            fontWeight: 900,
            color: '#ffffff',
            margin: 0,
            letterSpacing: -2,
          }}>
            {formatAmount(data.raised)}
          </p>
        </div>

        {data.goal && (
          <div style={{ paddingBottom: 8 }}>
            <p style={{
              fontSize: 20,
              color: '#666666',
              margin: 0,
              fontWeight: 500,
            }}>
              / {formatAmount(data.goal)} goal
            </p>
          </div>
        )}
      </div>

      {data.goal && (
        <div style={{
          width: '100%',
          height: 6,
          background: '#333333',
          borderRadius: 3,
          overflow: 'hidden',
          marginBottom: 16,
        }}>
          <div style={{
            width: `${getProgress(data.raised, data.goal)}%`,
            height: '100%',
            background: '#ffffff',
            borderRadius: 3,
          }} />
        </div>
      )}

      <p style={{
        marginTop: 'auto',
        fontSize: 16,
        color: '#555555',
        margin: 0,
      }}>
        Campaign #{data.campaign_id}
      </p>
    </div>
  </div>
);

// ─── STYLE 5: Clean Grid ───
const Style5 = ({ data }: { data: Flier }) => (
  <div style={{
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: '#ffffff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  }}>
    {/* Top bar */}
    <div style={{
      height: 80,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 60px',
      borderBottom: '1px solid #f0f0f0',
    }}>
      {data.center_logo_url ? (
        <img
          src={data.center_logo_url}
          alt="Center Logo"
          style={{ height: 48, objectFit: 'contain' }}
        />
      ) : (
        <div style={{ width: 48, height: 48, background: '#f0f0f0', borderRadius: 8 }} />
      )}
      <p style={{
        fontSize: 14,
        color: '#bbbbbb',
        fontWeight: 600,
        letterSpacing: 1,
        textTransform: 'uppercase',
        margin: 0,
      }}>
        Campaign #{data.campaign_id}
      </p>
    </div>

    {/* Main content */}
    <div style={{
      flex: 1,
      display: 'flex',
      padding: 60,
      gap: 60,
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <h1 style={{
          fontSize: 56,
          fontWeight: 800,
          color: '#1a1a1a',
          lineHeight: 1.15,
          margin: 0,
          marginBottom: 48,
        }}>
          {data.campaign_name || 'Support Our Cause'}
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 32,
        }}>
          <div style={{
            padding: 32,
            background: '#fafafa',
            borderRadius: 16,
          }}>
            <p style={{
              fontSize: 14,
              color: '#888888',
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              margin: 0,
              marginBottom: 12,
              fontWeight: 600,
            }}>
              Raised
            </p>
            <p style={{
              fontSize: 36,
              fontWeight: 900,
              color: '#111111',
              margin: 0,
            }}>
              {formatAmount(data.raised)}
            </p>
          </div>

          {data.goal && (
            <div style={{
              padding: 32,
              background: '#fafafa',
              borderRadius: 16,
            }}>
              <p style={{
                fontSize: 14,
                color: '#888888',
                textTransform: 'uppercase',
                letterSpacing: 1.5,
                margin: 0,
                marginBottom: 12,
                fontWeight: 600,
              }}>
                Goal
              </p>
              <p style={{
                fontSize: 36,
                fontWeight: 900,
                color: '#111111',
                margin: 0,
              }}>
                {formatAmount(data.goal)}
              </p>
            </div>
          )}
        </div>

        {data.goal && (
          <div style={{ marginTop: 32 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}>
              <span style={{
                fontSize: 16,
                color: '#666666',
                fontWeight: 600,
              }}>
                {getProgress(data.raised, data.goal)}% Complete
              </span>
            </div>
            <div style={{
              width: '100%',
              height: 8,
              background: '#f0f0f0',
              borderRadius: 4,
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${getProgress(data.raised, data.goal)}%`,
                height: '100%',
                background: '#1a1a1a',
                borderRadius: 4,
              }} />
            </div>
          </div>
        )}
      </div>

      <div style={{
        width: 420,
        borderRadius: 20,
        overflow: 'hidden',
      }}>
        <img
          src={data.campaign_logo_url}
          alt="Campaign"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
    </div>
  </div>
);

// ─── MAIN COMPONENT ───
const FlierImage = ({ data }: { data: Flier }): ImageResponse => {
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

export { FlierImage};