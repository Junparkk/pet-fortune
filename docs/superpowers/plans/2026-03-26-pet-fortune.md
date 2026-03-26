# 반려동물 오늘의 운세 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first Next.js web app that takes a pet's name and birthday, then shows a cute saju-style daily fortune card optimized for Instagram story screenshots.

**Architecture:** Pure client-side Next.js 14/15 app with two routes — input form (/) and fortune result (/result?name=...&birthday=...). Fortune is calculated deterministically from pet name + birthday + today using 12지지 zodiac, 오행 five-element compatibility, and day factors. No backend or database.

**Tech Stack:** Next.js (latest via create-next-app), TypeScript, Tailwind CSS, Noto Sans KR (Google Fonts), Jest (unit tests for pure fortune logic)

---

## File Map

| File | Purpose |
|------|---------|
| `src/lib/messages.ts` | Message pools: moods, lucky items, fortune messages, zodiac/element data |
| `src/lib/fortune.ts` | Pure fortune calculation functions |
| `src/lib/__tests__/messages.test.ts` | Tests: message pool shape validation |
| `src/lib/__tests__/fortune.test.ts` | Tests: all fortune calculation functions |
| `src/components/PetForm.tsx` | Pet name + birthday input form with client navigation |
| `src/components/FortuneCard.tsx` | 9:16 result card with share button |
| `src/app/layout.tsx` | Root layout — Noto Sans KR font, metadata |
| `src/app/globals.css` | Global styles — pastel gradient background |
| `src/app/page.tsx` | Input page (/) |
| `src/app/result/page.tsx` | Result page — reads searchParams, calls getFortuneResult, renders card |
| `tailwind.config.ts` | Custom pastel color palette |
| `jest.config.ts` | Jest config for Next.js |

---

### Task 1: Initialize Project

**Files:**
- Create: entire Next.js project scaffold
- Create: `jest.config.ts`
- Modify: `package.json` (add test scripts)

- [ ] **Step 1: Scaffold Next.js app in current directory**

Run from `/Users/jun/Desktop/jun/pet`:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```
Answer prompts: Turbopack → Yes (default), any others → defaults.
Expected: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `src/app/` structure created.

- [ ] **Step 2: Install Jest dependencies**

```bash
npm install --save-dev jest jest-environment-jsdom @types/jest ts-jest
```

- [ ] **Step 3: Create jest.config.ts**

```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  testEnvironment: 'node',
}

export default createJestConfig(config)
```

- [ ] **Step 4: Add test scripts to package.json**

In `package.json` under `"scripts"`, add:
```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 5: Verify dev server starts**

```bash
npm run dev
```
Expected: Server starts at http://localhost:3000 with default Next.js page.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js project with Jest"
```

---

### Task 2: Configure Styling

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-noto-sans-kr)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 2: Replace src/app/layout.tsx**

```typescript
import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import './globals.css'

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-noto-sans-kr',
})

export const metadata: Metadata = {
  title: '🐾 오늘의 운세',
  description: '반려동물의 오늘 기분을 알아보세요!',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Replace src/app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
}

body {
  background: linear-gradient(135deg, #FFE5F0 0%, #F0E8FF 50%, #FFF5E0 100%);
  min-height: 100vh;
}
```

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.ts src/app/layout.tsx src/app/globals.css
git commit -m "style: configure Tailwind and Noto Sans KR"
```

---

### Task 3: Message Pool

**Files:**
- Create: `src/lib/messages.ts`
- Create: `src/lib/__tests__/messages.test.ts`

- [ ] **Step 1: Write failing test**

Create `src/lib/__tests__/messages.test.ts`:
```typescript
import { MOODS, LUCKY_ITEMS, MESSAGES, ZODIAC_ANIMALS, ZODIAC_EMOJIS, ELEMENT_NAMES, ELEMENT_EMOJIS } from '../messages'

describe('message pools', () => {
  it('MOODS has exactly 5 entries', () => {
    expect(MOODS).toHaveLength(5)
    MOODS.forEach(mood => {
      expect(mood.label).toBeTruthy()
      expect(mood.emoji).toBeTruthy()
      expect(mood.reason).toBeTruthy()
    })
  })

  it('LUCKY_ITEMS has at least 10 entries with name and emoji', () => {
    expect(LUCKY_ITEMS.length).toBeGreaterThanOrEqual(10)
    LUCKY_ITEMS.forEach(item => {
      expect(item.name).toBeTruthy()
      expect(item.emoji).toBeTruthy()
    })
  })

  it('MESSAGES has at least 20 entries', () => {
    expect(MESSAGES.length).toBeGreaterThanOrEqual(20)
    MESSAGES.forEach(msg => expect(msg).toBeTruthy())
  })

  it('ZODIAC arrays have exactly 12 entries', () => {
    expect(ZODIAC_ANIMALS).toHaveLength(12)
    expect(ZODIAC_EMOJIS).toHaveLength(12)
  })

  it('ELEMENT arrays have exactly 5 entries', () => {
    expect(ELEMENT_NAMES).toHaveLength(5)
    expect(ELEMENT_EMOJIS).toHaveLength(5)
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npx jest src/lib/__tests__/messages.test.ts --no-coverage
```
Expected: FAIL — "Cannot find module '../messages'"

- [ ] **Step 3: Create src/lib/messages.ts**

```typescript
export const MOODS = [
  { label: '최고예요! ✨', emoji: '🌟', reason: '오늘은 온 우주가 나를 응원하는 날이에요!' },
  { label: '신나요! 🐾', emoji: '🎉', reason: '기운이 팡팡! 뛰어놀고 싶은 날이에요.' },
  { label: '평화로워요 😌', emoji: '🌸', reason: '조용하고 평화로운 하루예요. 낮잠 자고 싶어요.' },
  { label: '좀 졸려요 😴', emoji: '💤', reason: '오늘은 에너지가 좀 부족해요. 곁에 있어줘요.' },
  { label: '삐졌어요 🙄', emoji: '😤', reason: '오늘은 관심이 필요한 날이에요. 쓰다듬어줘요!' },
]

export const LUCKY_ITEMS = [
  { name: '치킨 간식', emoji: '🍗' },
  { name: '특별한 뼈다귀', emoji: '🦴' },
  { name: '공원 산책', emoji: '🌳' },
  { name: '새 장난감', emoji: '🎾' },
  { name: '따뜻한 햇살 낮잠', emoji: '☀️' },
  { name: '배 마사지', emoji: '🫶' },
  { name: '창문 밖 구경', emoji: '🪟' },
  { name: '털 빗질', emoji: '🪮' },
  { name: '친구 강아지와 만남', emoji: '🐾' },
  { name: '캣닢 장난감', emoji: '🌿' },
]

export const MESSAGES = [
  '오늘은 간식을 3개 주면 주인을 더 사랑하게 됩니다!',
  '오늘의 행운의 산책 코스는 공원!',
  '오늘 주인이 퇴근할 때까지 창문을 지키면 행운이 찾아와요!',
  '오늘은 소파 위에서만 자야 에너지가 충전돼요.',
  '오늘 주인에게 뽀뽀 한 번이면 만사 오케이!',
  '오늘은 배를 보여주면 행운이 두 배!',
  '간식 달라고 눈을 초롱초롱 뜨면 100% 성공하는 날이에요!',
  '오늘은 주인의 발 위에 올라가서 자면 최고의 하루가 돼요.',
  '오늘의 미션: 장난감을 주인 앞에 가져다 놓기!',
  '오늘은 야옹/멍멍 한 마디면 원하는 걸 다 얻을 수 있어요!',
  '오늘 주인이랑 10분 눈 맞추기 하면 행운 레벨 MAX!',
  '오늘은 산책하다 만나는 첫 번째 강아지가 행운을 가져다줘요.',
  '오늘은 주인 무릎에서 잠들면 꿈이 달콤해요!',
  '오늘의 파워 아이템은 담요! 그 위에서 뒹굴뒹굴하면 OK.',
  '오늘은 간식 그릇을 비우면 내일 두 배로 채워질 거예요!',
  '주인이 나를 보고 웃을 때마다 행운 포인트 +1!',
  '오늘은 꼬리를 세 번 흔들면 소원이 이루어져요!',
  '오늘의 행운은 주인 옆에 딱 붙어있기!',
  '오늘 주인이 집에 오면 가장 격렬하게 환영해주세요. 행운이 와요!',
  '오늘은 제일 좋아하는 장난감과 함께하면 기운이 충전돼요!',
]

export const ZODIAC_ANIMALS = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지']
export const ZODIAC_EMOJIS  = ['🐭', '🐮', '🐯', '🐰', '🐲', '🐍', '🐴', '🐑', '🐵', '🐔', '🐕', '🐷']
export const ELEMENT_NAMES  = ['나무', '불', '흙', '금', '물']
export const ELEMENT_EMOJIS = ['🌿', '🔥', '🌍', '⚡', '💧']
```

- [ ] **Step 4: Run test to confirm it passes**

```bash
npx jest src/lib/__tests__/messages.test.ts --no-coverage
```
Expected: PASS — 5 tests pass

- [ ] **Step 5: Commit**

```bash
git add src/lib/messages.ts src/lib/__tests__/messages.test.ts
git commit -m "feat: add fortune message pool"
```

---

### Task 4: Fortune Calculation Engine

**Files:**
- Create: `src/lib/fortune.ts`
- Create: `src/lib/__tests__/fortune.test.ts`

Element mapping used throughout:
- Month 0–1 (Jan–Feb) → 0 (木 나무)
- Month 2–3 (Mar–Apr) → 1 (火 불)
- Month 4–5 (May–Jun) → 2 (土 흙)
- Month 6–7 (Jul–Aug) → 3 (金 금)
- Month 8–9 (Sep–Oct) → 4 (水 물)
- Month 10–11 (Nov–Dec) → 0 (木 나무)

Compatibility (diff = (todayElement - petElement + 5) % 5):
- diff 0 → 0 (same)
- diff 1 → +2 (generating: Wood→Fire)
- diff 4 → +1 (being generated: Water→Wood)
- diff 2 → -1 (controlling: Wood→Earth)
- diff 3 → -2 (being controlled: Metal→Wood)

- [ ] **Step 1: Write failing tests**

Create `src/lib/__tests__/fortune.test.ts`:
```typescript
import {
  hashString,
  getZodiacIndex,
  getPetElement,
  getElementCompatibility,
  checkBirthdayWeek,
  getFortuneResult,
} from '../fortune'

describe('hashString', () => {
  it('is deterministic', () => {
    expect(hashString('희동이')).toBe(hashString('희동이'))
  })
  it('returns different values for different strings', () => {
    expect(hashString('멍멍이')).not.toBe(hashString('야옹이'))
  })
  it('returns 0 for empty string', () => {
    expect(hashString('')).toBe(0)
  })
})

describe('getZodiacIndex', () => {
  it('returns 0 for 2020 (year of the rat)', () => {
    // (2020 - 4) % 12 = 2016 % 12 = 0
    expect(getZodiacIndex(2020)).toBe(0)
  })
  it('returns 2 for 2022 (year of the tiger)', () => {
    // (2022 - 4) % 12 = 2018 % 12 = 2
    expect(getZodiacIndex(2022)).toBe(2)
  })
  it('always returns value in 0-11', () => {
    [1980, 1990, 2000, 2019, 2020, 2021, 2022, 2023, 2024].forEach(year => {
      const idx = getZodiacIndex(year)
      expect(idx).toBeGreaterThanOrEqual(0)
      expect(idx).toBeLessThanOrEqual(11)
    })
  })
})

describe('getPetElement', () => {
  it('maps January (0) to Wood (0)', () => {
    expect(getPetElement(0)).toBe(0)
  })
  it('maps May (4) to Earth (2)', () => {
    expect(getPetElement(4)).toBe(2)
  })
  it('maps July (6) to Metal (3)', () => {
    expect(getPetElement(6)).toBe(3)
  })
  it('always returns value in 0-4', () => {
    for (let m = 0; m < 12; m++) {
      const el = getPetElement(m)
      expect(el).toBeGreaterThanOrEqual(0)
      expect(el).toBeLessThanOrEqual(4)
    }
  })
})

describe('getElementCompatibility', () => {
  it('returns 0 for same element', () => {
    expect(getElementCompatibility(0, 0)).toBe(0)
  })
  it('returns 2 for generating cycle (Wood→Fire)', () => {
    expect(getElementCompatibility(0, 1)).toBe(2)
  })
  it('returns -2 for being controlled (Wood←Metal, diff=3)', () => {
    expect(getElementCompatibility(0, 3)).toBe(-2)
  })
  it('always returns value in -2 to 2', () => {
    for (let p = 0; p < 5; p++) {
      for (let t = 0; t < 5; t++) {
        const c = getElementCompatibility(p, t)
        expect(c).toBeGreaterThanOrEqual(-2)
        expect(c).toBeLessThanOrEqual(2)
      }
    }
  })
})

describe('checkBirthdayWeek', () => {
  it('returns true when birthday is today', () => {
    const today = new Date(2026, 2, 26)
    const birthday = new Date(2020, 2, 26)
    expect(checkBirthdayWeek(birthday, today)).toBe(true)
  })
  it('returns true when birthday is 5 days away', () => {
    const today = new Date(2026, 2, 26)
    const birthday = new Date(2020, 2, 31)
    expect(checkBirthdayWeek(birthday, today)).toBe(true)
  })
  it('returns false when birthday is 30 days away', () => {
    const today = new Date(2026, 2, 26)
    const birthday = new Date(2020, 3, 25)
    expect(checkBirthdayWeek(birthday, today)).toBe(false)
  })
})

describe('getFortuneResult', () => {
  const petName = '희동이'
  const birthday = new Date(2020, 4, 15) // May 15, 2020
  const today = new Date(2026, 2, 26)    // March 26, 2026

  it('returns a complete FortuneResult', () => {
    const r = getFortuneResult(petName, birthday, today)
    expect(r.moodLevel).toBeGreaterThanOrEqual(0)
    expect(r.moodLevel).toBeLessThanOrEqual(4)
    expect(r.moodLabel).toBeTruthy()
    expect(r.moodEmoji).toBeTruthy()
    expect(r.moodReason).toBeTruthy()
    expect(r.luckyItem).toBeTruthy()
    expect(r.luckyItemEmoji).toBeTruthy()
    expect(r.message).toBeTruthy()
    expect(r.zodiacAnimal).toBeTruthy()
    expect(r.zodiacEmoji).toBeTruthy()
    expect(r.element).toBeTruthy()
    expect(r.elementEmoji).toBeTruthy()
    expect(r.petName).toBe(petName)
  })

  it('is deterministic — same inputs always give same output', () => {
    const r1 = getFortuneResult(petName, birthday, today)
    const r2 = getFortuneResult(petName, birthday, today)
    expect(r1).toEqual(r2)
  })

  it('produces different output on a different day', () => {
    const tomorrow = new Date(2026, 2, 27)
    const r1 = getFortuneResult(petName, birthday, today)
    const r2 = getFortuneResult(petName, birthday, tomorrow)
    const differs = r1.moodLevel !== r2.moodLevel ||
                    r1.luckyItem !== r2.luckyItem ||
                    r1.message   !== r2.message
    expect(differs).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npx jest src/lib/__tests__/fortune.test.ts --no-coverage
```
Expected: FAIL — "Cannot find module '../fortune'"

- [ ] **Step 3: Create src/lib/fortune.ts**

```typescript
import {
  MOODS, LUCKY_ITEMS, MESSAGES,
  ZODIAC_ANIMALS, ZODIAC_EMOJIS,
  ELEMENT_NAMES, ELEMENT_EMOJIS,
} from './messages'

export interface FortuneResult {
  moodLevel:     number
  moodLabel:     string
  moodEmoji:     string
  moodReason:    string
  luckyItem:     string
  luckyItemEmoji:string
  message:       string
  zodiacAnimal:  string
  zodiacEmoji:   string
  element:       string
  elementEmoji:  string
  isBirthdayWeek:boolean
  petName:       string
}

// Month index (0=Jan) → element index (0=木 1=火 2=土 3=金 4=水)
const MONTH_TO_ELEMENT = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 0, 0]

export function hashString(s: string): number {
  return s.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
}

export function getZodiacIndex(birthYear: number): number {
  return ((birthYear - 4) % 12 + 12) % 12
}

export function getPetElement(birthMonth: number): number {
  return MONTH_TO_ELEMENT[birthMonth]
}

// diff = (todayElement - petElement + 5) % 5
// 0 → 0, 1 → +2 (생), 4 → +1 (역생), 2 → -1 (극), 3 → -2 (역극)
export function getElementCompatibility(petElement: number, todayElement: number): number {
  const diff = ((todayElement - petElement) % 5 + 5) % 5
  if (diff === 0) return  0
  if (diff === 1) return  2
  if (diff === 4) return  1
  if (diff === 2) return -1
  return -2
}

export function checkBirthdayWeek(birthday: Date, today: Date): boolean {
  const yr = today.getFullYear()
  let next = new Date(yr, birthday.getMonth(), birthday.getDate())
  if (next.getTime() < today.getTime()) {
    next = new Date(yr + 1, birthday.getMonth(), birthday.getDate())
  }
  const diffDays = Math.floor((next.getTime() - today.getTime()) / 86_400_000)
  return diffDays <= 7
}

export function getFortuneResult(petName: string, birthday: Date, today: Date): FortuneResult {
  const nameHash     = hashString(petName)
  const petElement   = getPetElement(birthday.getMonth())
  const todayElement = today.getDate() % 5
  const compat       = getElementCompatibility(petElement, todayElement)
  const zodiacIndex  = getZodiacIndex(birthday.getFullYear())

  const dayFactor  = (today.getDay() + today.getDate() + nameHash) % 5
  const moodLevel  = ((compat + 2) + dayFactor) % 5

  const luckyIndex   = (nameHash + zodiacIndex + today.getMonth() + today.getDate()) % LUCKY_ITEMS.length
  const messageIndex = (nameHash + today.getDate() * 7 + today.getMonth() * 31) % MESSAGES.length

  const isBirthdayWeek = checkBirthdayWeek(birthday, today)

  return {
    moodLevel,
    moodLabel:     MOODS[moodLevel].label,
    moodEmoji:     MOODS[moodLevel].emoji,
    moodReason:    MOODS[moodLevel].reason,
    luckyItem:     LUCKY_ITEMS[luckyIndex].name,
    luckyItemEmoji:LUCKY_ITEMS[luckyIndex].emoji,
    message: isBirthdayWeek
      ? '🎂 생일이 다가오고 있어요! 오늘은 특별한 간식이 행운을 불러와요!'
      : MESSAGES[messageIndex],
    zodiacAnimal:  ZODIAC_ANIMALS[zodiacIndex],
    zodiacEmoji:   ZODIAC_EMOJIS[zodiacIndex],
    element:       ELEMENT_NAMES[petElement],
    elementEmoji:  ELEMENT_EMOJIS[petElement],
    isBirthdayWeek,
    petName,
  }
}
```

- [ ] **Step 4: Run all lib tests**

```bash
npx jest src/lib/__tests__/ --no-coverage
```
Expected: PASS — all tests pass

- [ ] **Step 5: Commit**

```bash
git add src/lib/fortune.ts src/lib/__tests__/fortune.test.ts
git commit -m "feat: add saju-style fortune calculation engine"
```

---

### Task 5: PetForm Component

**Files:**
- Create: `src/components/PetForm.tsx`

- [ ] **Step 1: Create src/components/PetForm.tsx**

```typescript
'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function PetForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [birthday, setBirthday] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !birthday) return
    const params = new URLSearchParams({ name: name.trim(), birthday })
    router.push(`/result?${params.toString()}`)
  }

  const maxDate = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-purple-600">반려동물 이름 🐾</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="예) 희동이, 냥냥이"
          maxLength={10}
          required
          className="w-full rounded-2xl border-2 border-pink-200 bg-white px-4 py-3 text-lg outline-none focus:border-pink-400 transition-colors placeholder:text-gray-300"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-purple-600">생년월일 🎂</label>
        <input
          type="date"
          value={birthday}
          onChange={e => setBirthday(e.target.value)}
          max={maxDate}
          required
          className="w-full rounded-2xl border-2 border-pink-200 bg-white px-4 py-3 text-lg outline-none focus:border-pink-400 transition-colors text-gray-700"
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

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/PetForm.tsx
git commit -m "feat: add PetForm input component"
```

---

### Task 6: Input Page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace src/app/page.tsx**

```typescript
import PetForm from '@/components/PetForm'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🐾</div>
          <h1 className="text-3xl font-black text-purple-700">오늘의 운세</h1>
          <p className="mt-2 text-sm text-gray-500">반려동물의 오늘 기분을 알아보세요!</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6">
          <PetForm />
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">🌙 매일 바뀌는 귀여운 운세</p>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Visual check in mobile DevTools**

```bash
npm run dev
```
Open http://localhost:3000 at 390px width (iPhone view).
Expected: Pastel gradient background, white card with form, button disabled until inputs filled.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: build input page"
```

---

### Task 7: FortuneCard Component

**Files:**
- Create: `src/components/FortuneCard.tsx`

- [ ] **Step 1: Create src/components/FortuneCard.tsx**

```typescript
'use client'

import { FortuneResult } from '@/lib/fortune'

interface Props {
  result: FortuneResult
  today: string
}

const MOOD_GRADIENTS = [
  'from-yellow-200 to-orange-200',
  'from-pink-200 to-purple-200',
  'from-blue-100 to-purple-100',
  'from-indigo-100 to-blue-200',
  'from-rose-200 to-pink-200',
]

export default function FortuneCard({ result, today }: Props) {
  async function handleShare() {
    const text = `${result.petName}의 오늘 기분: ${result.moodLabel}\n"${result.message}"\n\n🐾 오늘의 운세`
    if (navigator.share) {
      await navigator.share({ title: `${result.petName}의 오늘 운세`, text })
    } else {
      await navigator.clipboard.writeText(text)
      alert('클립보드에 복사됐어요! 📋')
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* 9:16 card */}
      <div className={`w-full max-w-xs aspect-[9/16] rounded-3xl bg-gradient-to-b ${MOOD_GRADIENTS[result.moodLevel]} p-6 flex flex-col shadow-2xl`}>

        {/* Header */}
        <div className="text-center mb-3">
          <p className="text-xs font-bold text-gray-500">{today}</p>
          <h2 className="text-xl font-black text-gray-800 mt-1">{result.petName}의 오늘 운세</h2>
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
        className="mt-6 flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 px-8 py-3 text-base font-black text-white shadow-lg active:scale-95 transition-all"
      >
        📤 공유하기
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/FortuneCard.tsx
git commit -m "feat: add FortuneCard 9:16 result card"
```

---

### Task 8: Result Page

**Files:**
- Create: `src/app/result/page.tsx`

- [ ] **Step 1: Create src/app/result/page.tsx**

```typescript
import Link from 'next/link'
import { getFortuneResult } from '@/lib/fortune'
import FortuneCard from '@/components/FortuneCard'

interface Props {
  searchParams: Promise<{ name?: string; birthday?: string }>
}

export default async function ResultPage({ searchParams }: Props) {
  const { name, birthday } = await searchParams

  if (!name || !birthday) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <p className="text-gray-500 mb-4">잘못된 접근이에요 🐾</p>
        <Link href="/" className="rounded-full bg-gradient-to-r from-pink-400 to-purple-400 px-8 py-3 font-black text-white">
          처음으로 돌아가기
        </Link>
      </main>
    )
  }

  const birthdayDate = new Date(birthday)
  const today = new Date()
  const result = getFortuneResult(name, birthdayDate, today)
  const todayFormatted = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-xs">
        <FortuneCard result={result} today={todayFormatted} />
        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-gray-400 underline underline-offset-2">
            ← 다른 반려동물 보기
          </Link>
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: End-to-end visual check**

```bash
npm run dev
```
1. Open http://localhost:3000 at 390px (iPhone view in DevTools)
2. Enter name "희동이", birthday "2020-05-15"
3. Tap "오늘의 운세 보기"
4. Expected: Fortune card with mood emoji, lucky item, today's message, share button

- [ ] **Step 3: Run all tests**

```bash
npm test
```
Expected: All tests pass

- [ ] **Step 4: Commit**

```bash
git add src/app/result/
git commit -m "feat: add fortune result page — completes full app flow"
```
