'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  value: string
  onChange: (val: string) => void
  max: string
  className?: string
}

function parseDate(str: string): [number, number, number] {
  if (!str) return [0, 0, 0]
  const [y, m, d] = str.split('-').map(Number)
  return [y || 0, m || 0, d || 0]
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

const pad = (n: number) => String(n).padStart(2, '0')

export default function DatePicker({ value, onChange, max, className }: DatePickerProps) {
  const [maxY, maxM, maxD] = parseDate(max)
  const [initY, initM, initD] = parseDate(value)

  const [selYear, setSelYear] = useState(initY)
  const [selMonth, setSelMonth] = useState(initM)
  const [selDay, setSelDay] = useState(initD)

  const years = Array.from({ length: maxY - 2000 + 1 }, (_, i) => maxY - i)

  function emit(y: number, m: number, d: number) {
    if (y && m && d) onChange(`${y}-${pad(m)}-${pad(d)}`)
  }

  function handleYear(y: number) {
    let m = selMonth
    let d = selDay
    if (y === maxY && m > maxM) { m = 0; d = 0 }
    else if (m && d && y && d > daysInMonth(y, m)) d = 0
    setSelYear(y); setSelMonth(m); setSelDay(d)
    emit(y, m, d)
  }

  function handleMonth(m: number) {
    let d = selDay
    if (selYear && d > daysInMonth(selYear, m)) d = 0
    if (selYear === maxY && m === maxM && d > maxD) d = 0
    setSelMonth(m); setSelDay(d)
    emit(selYear, m, d)
  }

  function handleDay(d: number) {
    setSelDay(d)
    emit(selYear, selMonth, d)
  }

  const monthMax = selYear === maxY ? maxM : 12
  const dayMax = selYear && selMonth
    ? (selYear === maxY && selMonth === maxM ? maxD : daysInMonth(selYear, selMonth))
    : 31

  const selectCls = (active: boolean) => cn(
    'w-full rounded-2xl border-2 border-violet-200 bg-white px-3 py-3 text-lg font-normal',
    'focus:border-violet-400 focus:outline-none transition-colors cursor-pointer appearance-none',
    'disabled:opacity-40 disabled:cursor-not-allowed',
    active ? 'text-gray-800' : 'text-gray-300',
  )

  return (
    <div className={cn('flex w-full gap-2', className)}>
      <div className="relative flex-[2]">
        <select
          value={selYear || ''}
          onChange={e => handleYear(Number(e.target.value))}
          className={selectCls(!!selYear)}
        >
          <option value="" disabled>연도</option>
          {years.map(y => <option key={y} value={y}>{y}년</option>)}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-violet-300 text-sm">▾</span>
      </div>

      <div className="relative flex-1">
        <select
          value={selMonth || ''}
          onChange={e => handleMonth(Number(e.target.value))}
          disabled={!selYear}
          className={selectCls(!!selMonth)}
        >
          <option value="" disabled>월</option>
          {Array.from({ length: monthMax }, (_, i) => i + 1).map(m => (
            <option key={m} value={m}>{m}월</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-violet-300 text-sm">▾</span>
      </div>

      <div className="relative flex-1">
        <select
          value={selDay || ''}
          onChange={e => handleDay(Number(e.target.value))}
          disabled={!selMonth}
          className={selectCls(!!selDay)}
        >
          <option value="" disabled>일</option>
          {Array.from({ length: dayMax }, (_, i) => i + 1).map(d => (
            <option key={d} value={d}>{d}일</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-violet-300 text-sm">▾</span>
      </div>
    </div>
  )
}
