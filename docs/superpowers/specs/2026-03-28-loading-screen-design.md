# 로딩 화면 설계

**날짜:** 2026-03-28

## 목표

운세보기 버튼 클릭 후 결과 페이지로 이동하기 전에 귀여운 강아지 점성술사가 유리구슬을 들여다보는 3초짜리 로딩 화면을 표시한다.

## 사용자 흐름

```
[운세보기 클릭]
      ↓
isLoading = true
      ↓
<LoadingScreen /> 풀스크린 표시 (3초)
      ↓
router.push('/result?...')
```

## 컴포넌트 구조

### 신규: `src/components/LoadingScreen.tsx`

독립 컴포넌트. props 없음. 순수 표시 전용.

**레이아웃:**
- 풀스크린 fixed 오버레이 (z-50)
- 배경: 딥 네이비 → 딥 퍼플 그라데이션 (밤하늘)
- 반짝이는 별 3~5개 (CSS keyframe 애니메이션, 각기 다른 위치/타이밍)
- 중앙: 유리구슬 위에 강아지 이모지
  - 유리구슬: CSS `radial-gradient` + box-shadow 글로우 효과 (회색/은빛)
  - 강아지: 구슬 위에 살짝 겹쳐 앉은 느낌 (`relative` 포지셔닝)
  - 강아지 이모지는 살짝 bob(위아래) 애니메이션
- 하단 텍스트: `"🔮 운명을 읽는 중..."` — 흰색, pulse 애니메이션

**Lottie 확장 고려:**
- 구조상 강아지 이모지 부분을 `<LottiePlayer />` 로 교체하기 쉽게 분리

### 수정: `src/components/PetForm.tsx`

- `isLoading` state 추가 (`useState(false)`)
- `handleSubmit`: 즉시 `isLoading = true`, `setTimeout(3000)` 후 `router.push(...)`
- `isLoading`이 `true`일 때 `<LoadingScreen />` 렌더링

## 비주얼 스펙

| 요소 | 스펙 |
|------|------|
| 배경 | `from-[#0f0c29] via-[#302b63] to-[#24243e]` 그라데이션 |
| 별 | ⭐ 또는 CSS `::before`, 3~5개, `animate-pulse` 각기 다른 delay |
| 유리구슬 | 지름 ~180px, `radial-gradient(circle at 35% 35%, #e0e0e0, #888, #444)`, 글로우 `box-shadow` |
| 강아지 | 🐶 이모지, 5rem, bob 애니메이션 (translateY -6px ↔ 0, 1.5s infinite) |
| 텍스트 | `"🔮 운명을 읽는 중..."`, white, `animate-pulse` |
| 등장 | fade-in 0.3s |

## 애니메이션

`tailwind.config`에 커스텀 keyframe 불필요 — Tailwind v4 임의 애니메이션 또는 인라인 style로 처리.

- `bob`: `translateY(0) → translateY(-8px) → translateY(0)`, 1.5s ease-in-out infinite
- `twinkle`: `opacity 0.3 → 1 → 0.3`, 2s ease-in-out infinite (각 별마다 delay 다르게)
- `fadein`: `opacity 0 → 1`, 0.3s ease-out

## 변경 파일 요약

| 파일 | 변경 내용 |
|------|-----------|
| `src/components/LoadingScreen.tsx` | 신규 생성 |
| `src/components/PetForm.tsx` | `isLoading` state + `LoadingScreen` 렌더링 |

## 비고

- Lottie 파일 확보 시 `LoadingScreen.tsx` 내 강아지 이모지 부분만 `<LottiePlayer />` 로 교체 가능
- 타임아웃은 `useRef`로 관리해 컴포넌트 언마운트 시 클리어
