import Link from 'next/link'
import { getFortuneResult } from '@/lib/fortune'
import FortuneCard from '@/components/FortuneCard'

interface Props {
  searchParams: Promise<{ name?: string; birthday?: string; today?: string; petType?: string }>
}

export default async function ResultPage({ searchParams }: Props) {
  const { name, birthday, today: todayParam, petType: petTypeParam } = await searchParams

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

  // Parse as local time (not UTC) to avoid timezone offset issues
  const bParts = birthday.split('-').map(Number)
  const birthdayDate = bParts.length === 3 ? new Date(bParts[0], bParts[1] - 1, bParts[2]) : new Date('invalid')
  if (isNaN(birthdayDate.getTime())) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <p className="text-gray-500 mb-4">잘못된 접근이에요 🐾</p>
        <Link href="/" className="rounded-full bg-gradient-to-r from-pink-400 to-purple-400 px-8 py-3 font-black text-white">
          처음으로 돌아가기
        </Link>
      </main>
    )
  }

  // Use client's local date if provided, otherwise fall back to server date
  const tParts = todayParam?.split('-').map(Number)
  const today = tParts && tParts.length === 3 && !isNaN(tParts[0])
    ? new Date(tParts[0], tParts[1] - 1, tParts[2])
    : new Date()

  const petType = petTypeParam === 'cat' ? 'cat' : 'dog'
  const result = getFortuneResult(name, birthdayDate, today, petType)
  const todayFormatted = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-xs">
        <FortuneCard result={result} today={todayFormatted} petType={petType} />
        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-gray-400 underline underline-offset-2">
            ← 다른 반려동물 보기
          </Link>
        </div>
      </div>
    </main>
  )
}
