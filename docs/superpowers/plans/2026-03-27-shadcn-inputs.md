# shadcn Input & DatePicker 교체 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `PetForm`의 이름 input과 생년월일 input을 shadcn/ui 컴포넌트로 교체해 높이/너비 일관성을 맞춘다.

**Architecture:** shadcn/ui를 Tailwind v4 모드로 초기화한 뒤, `Input` 컴포넌트로 이름 필드를 교체하고, `Popover` + `Calendar` 조합의 `DatePicker` 래퍼 컴포넌트를 새로 만들어 생년월일 필드에 사용한다. 기존 핑크/퍼플 테마는 shadcn 컴포넌트에 `className` prop으로 오버라이드한다.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, shadcn/ui (input, button, calendar, popover), react-day-picker

---

## File Map

| 파일 | 역할 |
|------|------|
| `components.json` | shadcn 설정 (자동 생성) |
| `src/lib/utils.ts` | `cn` 헬퍼 (자동 생성) |
| `src/app/globals.css` | shadcn CSS 변수 추가 (자동 수정) |
| `src/components/ui/input.tsx` | shadcn Input (자동 생성) |
| `src/components/ui/button.tsx` | shadcn Button (자동 생성) |
| `src/components/ui/calendar.tsx` | shadcn Calendar (자동 생성) |
| `src/components/ui/popover.tsx` | shadcn Popover (자동 생성) |
| `src/components/DatePicker.tsx` | Popover+Calendar 래퍼, 날짜 선택 UI |
| `src/components/__tests__/DatePicker.test.tsx` | DatePicker 동작 테스트 |
| `src/components/PetForm.tsx` | Input, DatePicker 사용하도록 수정 |

---

## Task 1: shadcn/ui 초기화

**Files:**
- Create: `components.json`
- Modify: `src/app/globals.css`
- Create: `src/lib/utils.ts`

- [ ] **Step 1: shadcn 초기화 실행**

```bash
npx shadcn@latest init
```

프롬프트 응답:
```
Which style would you like to use? › Default
Which color would you like to use as the base color? › Neutral
Do you want to use CSS variables for theming? › yes
```

- [ ] **Step 2: 설치 결과 확인**

```bash
ls src/lib/utils.ts components.json
```

Expected output:
```
src/lib/utils.ts  components.json
```

- [ ] **Step 3: 빌드 확인**

```bash
npm run build
```

Expected: 빌드 성공 (에러 없음)

- [ ] **Step 4: 커밋**

```bash
git add components.json src/lib/utils.ts src/app/globals.css
git commit -m "chore: initialize shadcn/ui with tailwind v4"
```

---

## Task 2: shadcn 컴포넌트 추가

**Files:**
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/calendar.tsx`
- Create: `src/components/ui/popover.tsx`

- [ ] **Step 1: 컴포넌트 추가**

```bash
npx shadcn@latest add input button calendar popover
```

- [ ] **Step 2: 추가된 파일 확인**

```bash
ls src/components/ui/
```

Expected:
```
button.tsx  calendar.tsx  input.tsx  popover.tsx
```

- [ ] **Step 3: 빌드 확인**

```bash
npm run build
```

Expected: 빌드 성공

- [ ] **Step 4: 커밋**

```bash
git add src/components/ui/
git commit -m "chore: add shadcn input, button, calendar, popover"
```

---

## Task 3: DatePicker 컴포넌트 작성 (TDD)

**Files:**
- Create: `src/components/__tests__/DatePicker.test.tsx`
- Create: `src/components/DatePicker.tsx`

- [ ] **Step 1: 테스트 파일 작성**

`src/components/__tests__/DatePicker.test.tsx`:

```tsx
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import DatePicker from '../DatePicker'

// Popover는 포털 렌더링을 쓰므로 jsdom에서 간단히 mock
jest.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PopoverTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PopoverContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// Calendar도 간단히 mock — 날짜 선택 동작만 검증
jest.mock('@/components/ui/calendar', () => ({
  Calendar: ({ onSelect, disabled }: { onSelect: (d: Date) => void; disabled: (d: Date) => boolean }) => (
    <button
      data-testid="calendar-select"
      onClick={() => onSelect(new Date(2023, 4, 15))}
    >
      select
    </button>
  ),
}))

describe('DatePicker', () => {
  it('renders placeholder when no date selected', () => {
    render(<DatePicker value="" onChange={() => {}} max="2026-03-27" />)
    expect(screen.getByText('생년월일을 선택하세요')).toBeInTheDocument()
  })

  it('renders selected date as YYYY.MM.DD', () => {
    render(<DatePicker value="2023-05-15" onChange={() => {}} max="2026-03-27" />)
    expect(screen.getByText('2023.05.15')).toBeInTheDocument()
  })

  it('calls onChange with YYYY-MM-DD string when calendar selects a date', () => {
    const onChange = jest.fn()
    render(<DatePicker value="" onChange={onChange} max="2026-03-27" />)
    fireEvent.click(screen.getByTestId('calendar-select'))
    expect(onChange).toHaveBeenCalledWith('2023-05-15')
  })
})
```

- [ ] **Step 2: @testing-library/react 설치**

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 3: 테스트 실행 — 실패 확인**

```bash
npm test -- --testPathPattern=DatePicker
```

Expected: FAIL — `DatePicker` 모듈 없음

- [ ] **Step 5: DatePicker 컴포넌트 작성**

`src/components/DatePicker.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  value: string          // 'YYYY-MM-DD' or ''
  onChange: (val: string) => void
  max: string            // 'YYYY-MM-DD'
  className?: string
}

export default function DatePicker({ value, onChange, max, className }: DatePickerProps) {
  const [open, setOpen] = useState(false)

  const selected = value ? new Date(value + 'T00:00:00') : undefined
  const maxDate = new Date(max + 'T00:00:00')

  function handleSelect(date: Date | undefined) {
    if (!date) return
    const pad = (n: number) => String(n).padStart(2, '0')
    const str = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    onChange(str)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start rounded-2xl border-2 border-pink-200 bg-white px-4 py-3 text-lg font-normal text-left h-auto',
            'hover:bg-white hover:border-pink-400 focus:border-pink-400 focus-visible:ring-0 focus-visible:ring-offset-0',
            !value && 'text-gray-300',
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-5 w-5 text-pink-300 shrink-0" />
          {value
            ? format(selected!, 'yyyy.MM.dd')
            : '생년월일을 선택하세요'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          disabled={(date) => date > maxDate}
          captionLayout="dropdown"
          fromYear={2000}
          toYear={maxDate.getFullYear()}
        />
      </PopoverContent>
    </Popover>
  )
}
```

- [ ] **Step 6: lucide-react 설치**

```bash
npm install lucide-react date-fns
```

- [ ] **Step 7: 테스트 실행 — 통과 확인**

```bash
npm test -- --testPathPattern=DatePicker
```

Expected:
```
PASS src/components/__tests__/DatePicker.test.tsx
  DatePicker
    ✓ renders placeholder when no date selected
    ✓ renders selected date as YYYY.MM.DD
    ✓ calls onChange with YYYY-MM-DD string when calendar selects a date
```

- [ ] **Step 8: 커밋**

```bash
git add src/components/DatePicker.tsx src/components/__tests__/DatePicker.test.tsx
git commit -m "feat: add DatePicker component with shadcn Popover + Calendar"
```

---

## Task 4: PetForm 업데이트

**Files:**
- Modify: `src/components/PetForm.tsx`

- [ ] **Step 1: PetForm 수정**

`src/components/PetForm.tsx` 전체를 아래로 교체:

```tsx
'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import DatePicker from './DatePicker'

export default function PetForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [birthday, setBirthday] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !birthday) return
    const params = new URLSearchParams({ name: name.trim(), birthday, today: todayStr })
    router.push(`/result?${params.toString()}`)
  }

  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`

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

- [ ] **Step 2: 전체 테스트 실행**

```bash
npm test
```

Expected: All tests pass

- [ ] **Step 3: 개발 서버 실행 후 시각 확인**

```bash
npm run dev
```

브라우저에서 확인:
- 이름 input과 생년월일 버튼 높이가 동일한지
- 날짜 클릭 시 달력 팝업이 뜨는지
- 날짜 선택 후 `2023.05.15` 형식으로 표시되는지
- 제출이 정상 동작하는지

- [ ] **Step 4: 커밋**

```bash
git add src/components/PetForm.tsx
git commit -m "feat: replace native inputs with shadcn Input and DatePicker"
```
