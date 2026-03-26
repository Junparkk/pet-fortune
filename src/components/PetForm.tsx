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
        <input
          id="pet-name"
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
        <label htmlFor="pet-birthday" className="text-sm font-bold text-purple-600">생년월일 🎂</label>
        <input
          id="pet-birthday"
          type="date"
          value={birthday}
          onChange={e => setBirthday(e.target.value)}
          max={todayStr}
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
