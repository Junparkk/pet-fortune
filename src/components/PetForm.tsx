'use client'

import { useState, FormEvent, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { GoogleAdMob } from '@apps-in-toss/web-framework'
import { Input } from '@/components/ui/input'
import DatePicker from './DatePicker'
import LoadingScreen from './LoadingScreen'

const AD_GROUP_ID = process.env.NODE_ENV === 'production'
  ? 'ait.v2.live.b0c2a9d520164320'
  : 'ait-ad-test-interstitial-id'

const AD_RETRY_CONFIG = {
  MAX_ATTEMPTS: 3,
  DELAYS_MS: [1000, 3000, 5000],
  WAIT_TIMEOUT_MS: 10000,
} as const

type PetType = 'dog' | 'cat'

export default function PetForm() {
  const router = useRouter()
  const [petType, setPetType] = useState<PetType>('dog')
  const [name, setName] = useState('')
  const [birthday, setBirthday] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [adLoaded, setAdLoaded] = useState(false)
  const [waitingForAd, setWaitingForAd] = useState(false)

  const paramsRef = useRef('')
  const cleanupRef = useRef<(() => void) | undefined>(undefined)
  const retryCountRef = useRef(0)
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const adWaitTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`

  // ----------------------------------------
  // 유틸
  // ----------------------------------------

  const clearAllTimers = () => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = undefined
    }
    if (adWaitTimeoutRef.current) {
      clearTimeout(adWaitTimeoutRef.current)
      adWaitTimeoutRef.current = undefined
    }
  }

  const navigate = () => {
    clearAllTimers()
    router.push(`/result?${paramsRef.current}`)
  }

  // ----------------------------------------
  // 광고 로드
  // ----------------------------------------

  const loadAd = () => {
    try {
      let supported = false
      try { supported = GoogleAdMob.loadAppsInTossAdMob.isSupported() } catch { return }
      if (supported !== true) return

      cleanupRef.current?.()
      cleanupRef.current = undefined
      setAdLoaded(false)

      const cleanup = GoogleAdMob.loadAppsInTossAdMob({
        options: { adGroupId: AD_GROUP_ID },
        onEvent: (event) => {
          if (event.type === 'loaded') {
            setAdLoaded(true)
            retryCountRef.current = 0
          }
        },
        onError: () => {
          setAdLoaded(false)
          if (retryCountRef.current < AD_RETRY_CONFIG.MAX_ATTEMPTS) {
            const delay = AD_RETRY_CONFIG.DELAYS_MS[retryCountRef.current] ?? 5000
            retryTimeoutRef.current = setTimeout(() => {
              retryCountRef.current += 1
              loadAd()
            }, delay)
          } else {
            retryCountRef.current = 0
          }
        },
      })
      cleanupRef.current = cleanup
    } catch {}
  }

  // 마운트 시 사전 로드
  useEffect(() => {
    loadAd()
    return () => {
      cleanupRef.current?.()
      cleanupRef.current = undefined
      clearAllTimers()
    }
  }, [])

  // ----------------------------------------
  // 광고 표시
  // ----------------------------------------

  const showAd = () => {
    try {
      let supported = false
      try { supported = GoogleAdMob.showAppsInTossAdMob.isSupported() } catch {}
      if (supported !== true) { navigate(); return }

      GoogleAdMob.showAppsInTossAdMob({
        options: { adGroupId: AD_GROUP_ID },
        onEvent: (event) => {
          if (event.type === 'dismissed' || event.type === 'failedToShow') {
            navigate()
            loadAd()
          }
        },
        onError: () => { navigate(); loadAd() },
      })
    } catch {
      navigate()
      loadAd()
    }
  }

  // 광고 로드 완료 시 대기 중이었다면 바로 표시
  useEffect(() => {
    if (waitingForAd && adLoaded) {
      setWaitingForAd(false)
      clearAllTimers()
      showAd()
    }
  }, [adLoaded, waitingForAd])

  // ----------------------------------------
  // 폼 제출
  // ----------------------------------------

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !birthday) return

    const params = new URLSearchParams({ name: name.trim(), birthday, today: todayStr, petType })
    paramsRef.current = params.toString()
    setIsLoading(true)

    let supported = false
    try { supported = GoogleAdMob.showAppsInTossAdMob.isSupported() } catch {}

    if (supported !== true) {
      // 광고 미지원 환경 - 3초 로딩 후 이동
      setTimeout(navigate, 3000)
      return
    }

    if (!adLoaded) {
      // 광고 아직 로드 중 - 대기 상태로 전환
      setWaitingForAd(true)
      adWaitTimeoutRef.current = setTimeout(() => {
        setWaitingForAd(false)
        navigate()
      }, AD_RETRY_CONFIG.WAIT_TIMEOUT_MS)
      return
    }

    // 광고 로드 완료 - 바로 표시
    showAd()
  }

  if (isLoading) return <LoadingScreen petType={petType} />

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      {/* 강아지/고양이 토글 */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setPetType('dog')}
          className={`flex-1 rounded-full py-2 text-base font-black transition-colors ${
            petType === 'dog'
              ? 'bg-violet-500 text-white'
              : 'border-2 border-violet-200 text-violet-400 bg-white'
          }`}
        >
          🐶 강아지
        </button>
        <button
          type="button"
          onClick={() => setPetType('cat')}
          className={`flex-1 rounded-full py-2 text-base font-black transition-colors ${
            petType === 'cat'
              ? 'bg-violet-500 text-white'
              : 'border-2 border-violet-200 text-violet-400 bg-white'
          }`}
        >
          🐱 고양이
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="pet-name" className="text-sm font-bold text-purple-600">반려동물 이름 🐾</label>
        <Input
          id="pet-name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="예) 희동이, 냥냥이"
          maxLength={10}
          required
          className="w-full rounded-2xl border-2 border-violet-200 bg-white px-4 py-3 text-lg md:text-lg outline-none focus-visible:ring-0 focus-visible:border-violet-400 transition-colors placeholder:text-gray-300 h-auto"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-purple-600">생년월일 🎂</label>
        <DatePicker
          value={birthday}
          onChange={setBirthday}
          max={todayStr}
        />
      </div>

      <button
        type="submit"
        disabled={!name.trim() || !birthday}
        className="mt-2 w-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600 py-4 text-lg font-black text-white shadow-lg transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        오늘의 운세 보기 ✨
      </button>
    </form>
  )
}
