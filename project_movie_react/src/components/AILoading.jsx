import { useState, useEffect } from 'react'

const steps = [
  { text: '최근 감상 영화 분석 중', delay: 800 },
  { text: '선호 장르 추출 중', delay: 1600 },
  { text: '비슷한 작품 탐색 중...', delay: 2400 },
  { text: '맞춤 추천 생성 완료!', delay: 3200 },
]

export default function AILoading({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const timers = steps.map((step, i) =>
      setTimeout(() => {
        setCurrentStep(i + 1)
        if (i === steps.length - 1 && onComplete) {
          setTimeout(onComplete, 600)
        }
      }, step.delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-black/60 z-[1000] grid place-items-center backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-10 w-full max-w-[400px] shadow-2xl text-center animate-[modalIn_0.3s_ease]">
        {/* AI Icon */}
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-br from-[#7c5cff] to-[#9b85ff] grid place-items-center text-3xl animate-pulse">
          🤖
        </div>

        <h2 className="text-lg font-extrabold mb-2">AI 추천 생성 중</h2>
        <p className="text-sm text-gray-500 mb-6">🎬 당신의 영화 취향을 분석 중입니다...</p>

        {/* Steps */}
        <div className="flex flex-col gap-3 text-left">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 transition-all duration-300 ${
                i < currentStep ? 'opacity-100' : 'opacity-30'
              }`}
            >
              {i < currentStep - 1 || (i === steps.length - 1 && currentStep > steps.length - 1) ? (
                <span className="w-6 h-6 rounded-full bg-green-500 grid place-items-center text-white text-xs font-bold shrink-0">✓</span>
              ) : i === currentStep - 1 && i !== steps.length - 1 ? (
                <span className="w-6 h-6 rounded-full border-2 border-[#7c5cff] grid place-items-center shrink-0">
                  <span className="w-3 h-3 border-2 border-[#7c5cff]/30 border-t-[#7c5cff] rounded-full animate-spin" />
                </span>
              ) : (
                <span className="w-6 h-6 rounded-full border-2 border-gray-200 grid place-items-center text-xs text-gray-400 shrink-0">
                  {i + 1}
                </span>
              )}
              <span className={`text-sm font-semibold ${
                i < currentStep ? (i === steps.length - 1 && currentStep > steps.length - 1 ? 'text-green-600' : 'text-gray-800') : 'text-gray-400'
              }`}>
                {i < currentStep && i < steps.length - 1 ? '✔ ' : ''}{step.text}
              </span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-6 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#7c5cff] to-[#9b85ff] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
