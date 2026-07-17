// app/api/og/route.tsx
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { fetchOneCauseById } from '@/app/lib/fetchRequests';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const id = Number(request.nextUrl.searchParams.get('id'));
  const data = await fetchOneCauseById(id, 1);

  return new ImageResponse(
    (
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
  
        <img
          src={data.main_img.url}
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
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          }}
        />


        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 40,
            fontSize: 24,
            fontWeight: 'bold',
            color: '#ffffff',
            zIndex: 10,
          }}
        >
         <img src={"/ct_logo_texts.png"} />
        </div>

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
          }}
        >
          {data.title || data.name || 'Untitled Cause'}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}