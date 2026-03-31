'use client'

import { useRef, useState, useEffect } from 'react'
import { TossAds } from '@apps-in-toss/web-framework'
import { FortuneResult } from '@/lib/fortune'

const BANNER_AD_GROUP_ID = process.env.NODE_ENV === 'production'
  ? 'ait.v2.live.fa0e92cb2de943a1'
  : 'ait-ad-test-banner-id'

interface Props {
  result: FortuneResult
  today: string
  petType?: 'dog' | 'cat'
}

const MOOD_GRADIENTS = [
  'from-yellow-200 to-orange-200',
  'from-pink-200 to-purple-200',
  'from-blue-100 to-purple-100',
  'from-indigo-100 to-blue-200',
  'from-rose-200 to-pink-200',
]

export default function FortuneCard({ result, today, petType = 'dog' }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const bannerRef = useRef<HTMLDivElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [captured, setCaptured] = useState<{ file: File; dataUrl: string } | null>(null)
  const [isCapturing, setIsCapturing] = useState(true)
  const [isBannerReady, setIsBannerReady] = useState(false)

  useEffect(() => {
    try {
      if (TossAds.initialize.isSupported() !== true) return
      TossAds.initialize({
        callbacks: {
          onInitialized: () => setIsBannerReady(true),
          onInitializationFailed: () => {},
        },
      })
    } catch {}
  }, [])

  useEffect(() => {
    if (!isBannerReady || !bannerRef.current) return
    try {
      const attached = TossAds.attachBanner(BANNER_AD_GROUP_ID, bannerRef.current, {
        theme: 'auto',
        variant: 'expanded',
      })
      return () => attached?.destroy()
    } catch {}
  }, [isBannerReady])

  // Pre-capture card as image on mount so share can be called synchronously
  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const timer = setTimeout(async () => {
      try {
        const { toPng, toBlob } = await import('html-to-image')
        const dataUrl = await toPng(el, { pixelRatio: 2 })
        const blob = await toBlob(el, { pixelRatio: 2 })
        if (!blob) throw new Error('toBlob returned null')
        setCaptured({ file: new File([blob], `${result.petName}-운세.png`, { type: 'image/png' }), dataUrl })
      } catch (err) {
        console.error('[FortuneCard] capture failed:', err)
      } finally {
        setIsCapturing(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [result.petName])

  // Called synchronously within user gesture — no await before navigator.share
  function handleShare() {
    const fortuneTitle = petType === 'cat' ? '오늘의 냥운세' : '오늘의 멍운세'
    // Image captured — try file share, then overlay fallback
    if (captured) {
      const { file, dataUrl } = captured
      if (navigator.share) {
        try {
          navigator.share({ files: [file], title: `${result.petName}의 ${fortuneTitle}` })
            .catch(err => {
              if (err instanceof Error && err.name === 'AbortError') return
              setPreviewUrl(dataUrl)
            })
          return
        } catch {
          // synchronous throw — browser doesn't support files param, fall through
        }
      }
      setPreviewUrl(dataUrl)
      return
    }

    // Capture failed — fall back to text share
    const shareText = `${result.petName}의 ${fortuneTitle}\n${result.moodEmoji} ${result.moodLabel}\n${result.message}`
    if (navigator.share) {
      navigator.share({ title: `${result.petName}의 ${fortuneTitle}`, text: shareText })
        .catch(err => { if (!(err instanceof Error && err.name === 'AbortError')) console.error(err) })
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText)
        .then(() => alert('운세가 클립보드에 복사되었어요!'))
        .catch(() => alert(shareText))
    }
  }

  const safeLevel = Math.max(0, Math.min(4, result.moodLevel))

  return (
    <div className="flex flex-col items-center">
      {/* 9:16 card */}
      <div ref={cardRef} className={`w-full max-w-xs aspect-[9/16] rounded-3xl bg-gradient-to-b ${MOOD_GRADIENTS[safeLevel]} p-6 flex flex-col shadow-2xl`}>

        {/* Header */}
        <div className="text-center mb-3">
          <p className="text-xs font-bold text-gray-500">{today}</p>
          <h2 className="text-xl font-black text-gray-800 mt-1">
            {result.petName}의 {petType === 'cat' ? '오늘의 냥운세' : '오늘의 멍운세'}
          </h2>
        </div>

        {/* Zodiac + Element badges */}
        <div className="flex justify-center gap-2 mb-3">
          <span className="bg-white/70 rounded-full px-3 py-1 text-xs font-bold text-gray-600">
            {result.zodiacEmoji} {result.zodiacAnimal}띠
          </span>
          <span className="bg-white/70 rounded-full px-3 py-1 text-xs font-bold text-gray-600">
            {result.elementEmoji} {result.element}의 기운
          </span>
        </div>

        {/* Mood — center piece */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-7xl mb-3">{result.moodEmoji}</div>
          <div className="text-xl font-black text-gray-800">{result.moodLabel}</div>
          <p className="mt-2 text-sm text-gray-600 text-center px-2">{result.moodReason}</p>
        </div>

        {/* Lucky item */}
        <div className="bg-white/60 rounded-2xl p-3 mb-3 text-center">
          <p className="text-xs font-bold text-gray-500 mb-1">오늘의 행운 아이템</p>
          <p className="text-lg font-black text-gray-800">{result.luckyItemEmoji} {result.luckyItem}</p>
        </div>

        {/* Shareable quote */}
        <div className="bg-white/80 rounded-2xl p-4 text-center">
          <p className="text-xs font-bold text-purple-500 mb-1">✨ 오늘의 한 마디</p>
          <p className="text-sm font-bold text-gray-800 leading-relaxed">{result.message}</p>
        </div>

        {/* Birthday special */}
        {result.isBirthdayWeek && (
          <div className="mt-3 text-center">
            <span className="bg-yellow-300/80 rounded-full px-3 py-1 text-xs font-black text-yellow-800">
              🎂 생일이 다가오고 있어요!
            </span>
          </div>
        )}
      </div>

      {/* Share button */}
      <button
        onClick={handleShare}
        disabled={isCapturing}
        aria-label="운세 공유하기"
        className="mt-6 flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 px-8 py-3 text-base font-black text-white shadow-lg active:scale-95 transition-all disabled:opacity-50"
      >
        {isCapturing ? '⏳ 준비 중...' : '📤 공유하기'}
      </button>

      {/* Banner ad */}
      <div ref={bannerRef} style={{ width: '100%', height: '96px', marginTop: '16px' }} />

      {/* Image preview overlay */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 px-4"
          onClick={() => setPreviewUrl(null)}
        >
          <p className="mb-4 text-sm font-bold text-white">꾹 눌러서 이미지 저장하세요 📸</p>
          <img
            src={previewUrl}
            alt="운세 카드"
            className="max-w-xs w-full rounded-2xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
          <button
            onClick={() => setPreviewUrl(null)}
            className="mt-6 rounded-full bg-white/20 px-6 py-2 text-sm font-bold text-white"
          >
            닫기
          </button>
        </div>
      )}
    </div>
  )
}
