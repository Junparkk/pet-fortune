'use client'

import { useState, FormEvent, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadFullScreenAd, showFullScreenAd } from '@apps-in-toss/web-framework'
import { Input } from '@/components/ui/input'
import DatePicker from './DatePicker'
import LoadingScreen from './LoadingScreen'

const AD_GROUP_ID = 'ait.v2.live.b0c2a9d520164320'
const AD_WAIT_TIMEOUT_MS = 10000

type PetType = 'dog' | 'cat'

export default function PetForm() {
  const router = useRouter()
  const [petType, setPetType] = useState<PetType>('dog')
  const [name, setName] = useState('')
  const [birthday, setBirthday] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigatedRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !birthday) return
    const params = new URLSearchParams({ name: name.trim(), birthday, today: todayStr, petType })
    const paramsStr = params.toString()
    setIsLoading(true)
    navigatedRef.current = false

    function navigate() {
      if (navigatedRef.current) return
      navigatedRef.current = true
      if (timerRef.current) clearTimeout(timerRef.current)
      router.push(`/result?${paramsStr}`)
    }

    let adSupported = false
    try {
      adSupported = loadFullScreenAd.isSupported()
      console.log('[AD] isSupported:', adSupported)
    } catch (e) {
      console.log('[AD] isSupported threw:', e)
    }

    if (!adSupported) {
      timerRef.current = setTimeout(navigate, 3000)
      return
    }

    // 광고 로드 실패/타임아웃 시 안전 이동
    timerRef.current = setTimeout(navigate, AD_WAIT_TIMEOUT_MS)

    loadFullScreenAd({
      options: { adGroupId: AD_GROUP_ID },
      onEvent: (event) => {
        console.log('[AD] loadFullScreenAd event:', event.type)
        if (event.type === 'loaded') {
          showFullScreenAd({
            options: { adGroupId: AD_GROUP_ID },
            onEvent: (showEvent) => {
              if (showEvent.type === 'dismissed' || showEvent.type === 'failedToShow') {
                navigate()
              }
            },
            onError: navigate,
          })
        }
      },
      onError: (e) => { console.log('[AD] loadFullScreenAd error:', e); navigate() },
    })
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
