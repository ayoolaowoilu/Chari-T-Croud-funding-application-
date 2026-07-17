// app/api/og/route.tsx
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { fetchOneCauseById } from '@/app/lib/fetchRequests';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  // ---------- Validation ----------
  const idParam = request.nextUrl.searchParams.get('id');
  const id = idParam ? Number(idParam) : null;
  if (!id || isNaN(id) || id <= 0) {
    return new ImageResponse(
      <div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a1a1a' }}>
        <span style={{ color: '#fff', fontSize: 32 }}>Invalid Cause ID</span>
      </div>,
      { width: 1200, height: 630 }
    );
  }

  // ---------- Fetch Data ----------
  let data;
  try {
    data = await fetchOneCauseById(id, 1);
  } catch {
    return new ImageResponse(
      <div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a1a1a' }}>
        <span style={{ color: '#fff', fontSize: 28 }}>Unable to load cause</span>
      </div>,
      { width: 1200, height: 630 }
    );
  }

  if (!data) {
    return new ImageResponse(
      <div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a1a1a' }}>
        <span style={{ color: '#fff', fontSize: 28 }}>Cause not found</span>
      </div>,
      { width: 1200, height: 630 }
    );
  }

  // ---------- Image URLs ----------
  const baseUrl = process.env.API_URL || 'http://localhost:3000';
  const logoSrc = `${baseUrl}/ct_logo1.png`;
  const bannerSrc = data.main_img?.url || `${baseUrl}/default-banner.png`;

  // ---------- Render ----------
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#0a0a0a',
      }}
    >
      {/* ---- Background Image ---- */}
      <img
        src={bannerSrc}
        alt=""
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

     
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)',
        }}
      />


      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 20,
          display: 'flex',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            padding: '12px 28px',
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: '100px',
            backdropFilter: 'blur(4px)',
          }}
        >
          <img src={logoSrc} alt="Chari-T" width={150}  />
        </div>
      </div>

      {/* ---- Main Title (centered) ---- */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: 60,
          right: 60,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.2,
            textShadow: '0 4px 20px rgba(0,0,0,0.6)',
            letterSpacing: '-0.02em',
            maxWidth: '80%',
          }}
        >
          {data.title || data.name || 'Untitled Cause'}
        </div>
        {/* Accent line – now blue (teal) instead of yellow */}
        <div
          style={{
            marginTop: 20,
            width: 80,
            height: 4,
            borderRadius: 2,
            backgroundColor: '#0ea5e9', // clean blue (or use #10b981 for green)
          }}
        />
      </div>


      <div
        style={{
          position: 'absolute',
          bottom: 30,
          right: 40,
          display: 'flex',
          zIndex: 10,
          fontSize: 16,
          fontWeight: 500,
          color: 'rgba(255,255,255,0.7)',
          letterSpacing: '0.5px',
        }}
      >
        Chari‑T · Giving Made Simple
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  );
}