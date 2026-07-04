import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default async function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        fontFamily: 'sans-serif',
      }}>
      <span
        style={{
          fontSize: 110,
          fontWeight: 'bold',
          background: 'linear-gradient(90deg, #ff675b, #ff8f85)',
          backgroundClip: 'text',
          color: 'transparent',
        }}>
        요
      </span>
    </div>,
    {
      ...size,
    },
  );
}
