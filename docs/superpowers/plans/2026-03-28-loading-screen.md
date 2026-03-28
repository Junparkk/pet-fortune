# 로딩 화면 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 운세보기 버튼 클릭 후 결과 페이지 이동 전 3초짜리 강아지 점성술사 로딩 화면 표시

**Architecture:** `LoadingScreen.tsx` 신규 컴포넌트를 만들고, `PetForm.tsx`에 `isLoading` state를 추가해 submit 시 3초 후 navigate하는 방식. LoadingScreen은 `fixed inset-0`으로 전체 화면을 덮음. 커스텀 keyframe 애니메이션은 `globals.css`에 추가.

**Tech Stack:** Next.js App Router, React, Tailwind v4, inline CSS animations

---

### Task 1: LoadingScreen 컴포넌트 + 애니메이션 keyframes

**Files:**
- Create: `src/components/LoadingScreen.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: globals.css에 커스텀 keyframes 추가**

`src/app/globals.css` 파일 맨 끝에 아래를 추가:

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-8px); }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(0.9); }
  50%       { opacity: 1;   transform: scale(1.1); }
}
```

- [ ] **Step 2: LoadingScreen.tsx 생성**

`src/components/LoadingScreen.tsx`를 아래 내용으로 생성:

```tsx
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
```

- [ ] **Step 3: 개발 서버에서 시각 확인**

임시로 `src/app/page.tsx`에서 `<LoadingScreen />`을 import해서 렌더링해보고 비주얼 확인. 확인 후 바로 제거.

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 열어서 로딩 화면이 올바르게 보이는지 확인:
- 어두운 밤하늘 배경
- 강아지 🐶가 bob 애니메이션으로 위아래 움직임
- 유리구슬 (은빛 radial gradient + 보라빛 글로우)
- 별들이 반짝임
- 하단 "🔮 운명을 읽는 중..." pulse 텍스트

확인 후 `page.tsx`에서 임시 코드 제거.

- [ ] **Step 4: 빌드 타입 체크**

```bash
npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 5: 커밋**

```bash
git add src/components/LoadingScreen.tsx src/app/globals.css
git commit -m "feat: add LoadingScreen component with dog fortune-teller animation"
```

---

### Task 2: PetForm에 로딩 상태 연결

**Files:**
- Modify: `src/components/PetForm.tsx`

- [ ] **Step 1: PetForm.tsx 전체 교체**

`src/components/PetForm.tsx`를 아래로 교체:

```tsx
'use client'

import { useState, FormEvent, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import DatePicker from './DatePicker'
import LoadingScreen from './LoadingScreen'

export default function PetForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [birthday, setBirthday] = useState('')
  const [isLoading, setIsLoading] = useState(false)
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
    const params = new URLSearchParams({ name: name.trim(), birthday, today: todayStr })
    setIsLoading(true)
    timerRef.current = setTimeout(() => {
      router.push(`/result?${params.toString()}`)
    }, 3000)
  }

  if (isLoading) return <LoadingScreen />

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
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
          className="w-full rounded-2xl border-2 border-pink-200 bg-white px-4 py-3 text-lg outline-none focus-visible:ring-0 focus-visible:border-pink-400 transition-colors placeholder:text-gray-300 h-auto"
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
        className="mt-2 w-full rounded-full bg-gradient-to-r from-pink-400 to-purple-400 py-4 text-lg font-black text-white shadow-lg transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        오늘의 운세 보기 ✨
      </button>
    </form>
  )
}
```

- [ ] **Step 2: 동작 확인**

```bash
npm run dev
```

`http://localhost:3000` 에서:
1. 이름과 생년월일 입력
2. "오늘의 운세 보기 ✨" 클릭
3. 로딩 화면이 즉시 나타나고 약 3초 후 결과 페이지로 이동하는지 확인

- [ ] **Step 3: 빌드 타입 체크**

```bash
npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 4: 커밋**

```bash
git add src/components/PetForm.tsx
git commit -m "feat: show loading screen for 3s before navigating to result"
```
