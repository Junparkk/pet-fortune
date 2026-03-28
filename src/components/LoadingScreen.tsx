export default function LoadingScreen() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      {/* 별 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <span className="absolute text-xl" style={{ top: '10%', left: '15%', animation: 'twinkle 2s ease-in-out infinite' }}>⭐</span>
        <span className="absolute text-sm" style={{ top: '15%', right: '20%', animation: 'twinkle 2.5s ease-in-out infinite 0.5s' }}>✨</span>
        <span className="absolute text-base" style={{ top: '25%', left: '70%', animation: 'twinkle 1.8s ease-in-out infinite 1s' }}>⭐</span>
        <span className="absolute text-sm" style={{ top: '8%', left: '50%', animation: 'twinkle 2.2s ease-in-out infinite 0.3s' }}>✨</span>
        <span className="absolute text-xl" style={{ top: '20%', left: '35%', animation: 'twinkle 3s ease-in-out infinite 0.8s' }}>⭐</span>
      </div>

      {/* 강아지 + 유리구슬 */}
      <div className="relative flex flex-col items-center">
        <div
          className="relative z-10 text-7xl"
          style={{ animation: 'bob 1.5s ease-in-out infinite', marginBottom: '-20px' }}
        >
          🐶
        </div>
        <div
          className="rounded-full"
          style={{
            width: '180px',
            height: '180px',
            background: 'radial-gradient(circle at 35% 35%, #e8e8e8, #a0a0a0 40%, #505050 80%, #202020)',
            boxShadow: '0 0 40px 15px rgba(160, 140, 255, 0.4), inset 0 0 20px rgba(255,255,255,0.2)',
          }}
        />
      </div>

      {/* 텍스트 */}
      <p className="mt-8 text-white text-lg font-bold animate-pulse">
        🔮 운명을 읽는 중...
      </p>
    </div>
  )
}
