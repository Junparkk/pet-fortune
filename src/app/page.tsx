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
