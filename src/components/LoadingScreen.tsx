interface LoadingScreenProps {
  petType?: 'dog' | 'cat'
}

export default function LoadingScreen({ petType = 'dog' }: LoadingScreenProps) {
  const petEmoji = petType === 'cat' ? '🐱' : '🐶'

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
        <span className="absolute text-base" style={{ top: '70%', left: '10%', animation: 'twinkle 1.8s ease-in-out infinite 1s' }}>⭐</span>
        <span className="absolute text-sm" style={{ top: '80%', right: '15%', animation: 'twinkle 2.2s ease-in-out infinite 0.3s' }}>✨</span>
        <span className="absolute text-xl" style={{ top: '60%', right: '8%', animation: 'twinkle 3s ease-in-out infinite 0.8s' }}>⭐</span>
      </div>

      {/* 동물 + 유리구슬 */}
      <div className="relative flex flex-col items-center">
        <div
          className="relative z-10 text-7xl"
          style={{ animation: 'bob 1.5s ease-in-out infinite', marginBottom: '-20px' }}
        >
          {petEmoji}
        </div>
        <div
          className="rounded-full relative overflow-hidden"
          style={{
            width: '180px',
            height: '180px',
            background: 'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.95) 0%, rgba(215,225,255,0.8) 18%, rgba(160,175,240,0.65) 38%, rgba(90,100,200,0.8) 62%, rgba(15,10,70,0.97) 100%)',
            boxShadow: '0 0 55px 22px rgba(120,90,255,0.55), 0 12px 40px rgba(0,0,60,0.5), inset 0 0 35px rgba(70,50,200,0.25)',
          }}
        >
          {/* 주 반사광 */}
          <div style={{ position:'absolute', width:'65px', height:'42px', top:'10%', left:'14%', background:'radial-gradient(ellipse, rgba(255,255,255,0.95), transparent 70%)', filter:'blur(5px)', borderRadius:'50%' }} />
          {/* 보조 반사광 */}
          <div style={{ position:'absolute', width:'26px', height:'16px', bottom:'19%', right:'18%', background:'radial-gradient(ellipse, rgba(255,255,255,0.55), transparent 70%)', filter:'blur(3px)', borderRadius:'50%' }} />
        </div>
      </div>

      {/* 텍스트 */}
      <p className="mt-8 text-white text-lg font-bold animate-pulse">
        🔮 운명을 읽는 중...
      </p>
    </div>
  )
}
