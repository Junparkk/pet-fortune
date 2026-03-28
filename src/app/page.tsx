import Image from 'next/image'
import PetForm from '@/components/PetForm'

export default function Home() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{ background: 'linear-gradient(135deg, #f3f0ff 0%, #ede9fe 50%, #e9d5ff 100%)' }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Image src="/logo.png" alt="오늘의 댕운세" width={96} height={96} className="rounded-full" />
          </div>
          <h1 className="text-3xl font-black text-violet-700">오늘의 댕운세</h1>
          <p className="mt-2 text-sm text-violet-400">반려동물의 오늘 기분을 알아보세요!</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 overflow-hidden">
          <PetForm />
        </div>

        <p className="mt-6 text-center text-xs text-violet-300">🌙 매일 바뀌는 귀여운 운세</p>
      </div>
    </main>
  )
}
