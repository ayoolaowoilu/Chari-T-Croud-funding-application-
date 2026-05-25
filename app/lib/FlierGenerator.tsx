import { ImageResponse } from 'next/og';


const FlierImage = () =>{

  
     return new ImageResponse(
    (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        padding: 60,
      }}>
        <h1 style={{ fontSize: 64, color: '#1a1a1a' }}></h1>
        {/* Your clean professional layout here */}
      </div>
    ),
    { width: 1200, height: 1600 }
  );
}