// app/api/og/route.tsx
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { fetchOneCauseById } from '@/app/lib/fetchRequests';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  // 1. Validate ID
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

  // 2. Fetch data with error handling
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

  // 3. Build absolute URLs for images
  const baseUrl = process.env.API_URL || 'http://localhost:3000';
  const logoSrc = `${baseUrl}/ct_logo1.png`;
  const bannerSrc = data.main_img?.url || `${baseUrl}/default-banner.png`;

  // 4. Return OG image
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Background */}
      <img
        src={bannerSrc}
        alt="Cause banner"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        }}
      />

      {/* Logo – whitespace removed + display:flex for safety */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          right: 40,
          fontSize: 24,
          fontWeight: 'bold',
   
          zIndex: 10,
          display: 'flex',
        }}
      ><img src={logoSrc} width={200} alt="Chari-T Logo" /></div>

      {/* Title – added display:flex to avoid whitespace error */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 40,
          right: 40,
          fontSize: 48,
          fontWeight: 'bold',
          color: '#ffffff',
          zIndex: 10,
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          display: 'flex',
        }}
      >
        {data.title || data.name || 'Untitled Cause'}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  );
}