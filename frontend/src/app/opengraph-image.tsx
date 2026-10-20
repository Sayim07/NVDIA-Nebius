import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'HermesShield — A personal AI assistant that keeps your secrets secret';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#F7F7F4',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '28px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#0B6E4F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '24px',
              marginRight: '16px',
            }}
          >
            🛡️
          </div>
          <span style={{ fontSize: '32px', fontWeight: 700, color: '#0F1A17' }}>
            HermesShield
          </span>
        </div>

        <div
          style={{
            fontSize: '56px',
            fontWeight: 700,
            lineHeight: 1.15,
            color: '#0F1A17',
            maxWidth: '960px',
            marginBottom: '24px',
          }}
        >
          A personal AI assistant that keeps your secrets secret.
        </div>

        <div
          style={{
            fontSize: '24px',
            lineHeight: 1.5,
            color: '#56625E',
            maxWidth: '880px',
            marginBottom: '40px',
          }}
        >
          Reads your project files and searches the web without leaking emails, keys or internal names.
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '18px',
            color: '#0B6E4F',
            fontWeight: 600,
          }}
        >
          <span>NVIDIA NemoClaw</span>
          <span style={{ margin: '0 12px' }}>·</span>
          <span>Nebius Token Factory</span>
          <span style={{ margin: '0 12px' }}>·</span>
          <span>Tavily Airlock</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
