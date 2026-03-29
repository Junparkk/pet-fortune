# 오늘의 멍냥운세 — 강아지/고양이 분기 설계

## 목표

앱 이름을 '오늘의 멍냥운세'로 변경하고, 강아지/고양이 선택 토글을 추가한다.
고양이 선택 시 고양이 전용 운세 멘트, 로딩 화면, 결과 카드를 제공한다.

## 데이터 흐름

```
PetForm (petType 토글 선택)
  → URL: ?name=희동이&birthday=2020-01-01&today=2026-03-29&petType=cat
  → LoadingScreen(petType)
  → result/page.tsx → getFortuneResult(name, birthday, today, petType)
  → FortuneCard(result, petType)
```

`petType: 'dog' | 'cat'` — URL 파라미터로 전달, 기본값 `'dog'`

---

## 변경 파일 목록

| 파일 | 변경 내용 |
|------|----------|
| `src/lib/messages.ts` | `CAT_MESSAGES`, `CAT_LUCKY_ITEMS`, `CAT_BIRTHDAY_MESSAGE`, `MOODS`에 `catReasons` 추가 |
| `src/lib/fortune.ts` | `getFortuneResult`에 `petType` 파라미터 추가 |
| `src/components/PetForm.tsx` | 토글 UI 추가, URL에 petType 전달 |
| `src/components/LoadingScreen.tsx` | `petType` prop 받아서 🐶/🐱 분기 |
| `src/app/result/page.tsx` | searchParams에서 petType 읽어서 전달 |
| `src/components/FortuneCard.tsx` | petType prop 받아서 카드 타이틀 분기 |
| `src/app/layout.tsx` | 앱 이름 → '오늘의 멍냥운세' |
| `src/app/page.tsx` | 앱 이름 → '오늘의 멍냥운세' |

---

## messages.ts 설계

### MOODS — catReasons 추가

기존 MOODS 배열 각 항목에 `catReasons: string[]` 필드 추가.
`label`, `emoji`는 공통 유지.

```ts
export const MOODS = [
  {
    label: '최고예요! ✨', emoji: '🌟',
    reasons: ['오늘은 온 우주가 나를 응원하는 날이에요!', ...],    // 기존 강아지용
    catReasons: ['오늘은 온 세상이 내 발아래 있는 날이에요!', ...], // 새 고양이용
  },
  ...
]
```

각 mood마다 catReasons 3개씩 (총 15개).

### CAT_LUCKY_ITEMS — 50개

고양이에게 어울리는 아이템. 공통 가능한 것(창문 밖 구경, 따뜻한 햇살 낮잠, 폭신한 담요 등)은
양쪽 배열에 포함 가능. 고양이 전용 예시:
- 참치 간식 🐟, 연어 트릿 🍣, 깃털 장난감 🪶, 레이저 포인터 🔴, 박스 탐험 📦,
  스크래처 🪵, 캣닙 🌿, 쥐 인형 🐭, 창틀 낮잠 🪟, 그루밍 빗 🪮, 고양이 캔 간식 🥫 등

### CAT_MESSAGES — 100개

고양이 행동/성격에 맞는 멘트. 고양이는 독립적이고 도도하며 궁금증이 많고 낮잠을 즐기는 캐릭터.

예시 스타일:
- '오늘은 박스 안에 들어가면 우주 최고의 자리를 차지하는 날이에요!'
- '오늘은 그루밍을 세 번 하면 미모 운이 MAX!'
- '오늘 주인을 무시하면 더 매력적으로 보이는 날이에요.'
- '오늘은 창틀에서 바깥을 구경하면 철학적 깨달음이 찾아와요.'
- '오늘 캣닙을 받으면 오늘 하루가 완성돼요!'

### CAT_BIRTHDAY_MESSAGE

```ts
export const CAT_BIRTHDAY_MESSAGE = '🎂 생일이 다가오고 있어요! 오늘은 특별한 참치 캔이 행운을 불러와요!'
```

---

## fortune.ts 설계

### getFortuneResult 시그니처 변경

```ts
export function getFortuneResult(
  petName: string,
  birthday: Date,
  today: Date,
  petType: 'dog' | 'cat' = 'dog'
): FortuneResult
```

### 내부 분기

```ts
const messages    = petType === 'cat' ? CAT_MESSAGES    : MESSAGES
const luckyItems  = petType === 'cat' ? CAT_LUCKY_ITEMS : LUCKY_ITEMS
const bdayMessage = petType === 'cat' ? CAT_BIRTHDAY_MESSAGE : BIRTHDAY_MESSAGE
const moodReason  = MOODS[moodLevel][petType === 'cat' ? 'catReasons' : 'reasons'][...]
```

나머지 로직(hash, zodiac, element, 인덱스 계산)은 동일.

---

## PetForm.tsx 설계

### 토글 위치

반려동물 이름 레이블 바로 위 (폼 최상단).

### 토글 UI

pill 형태, 둘 중 하나만 선택. 기본값: 강아지.

```
[ 🐶 강아지 ]  [ 🐱 고양이 ]
  ↑ 선택됨 (채워진 배경)    ↑ 비선택 (아웃라인)
```

선택 상태: `bg-violet-500 text-white` / 미선택: `border-2 border-violet-200 text-violet-400`

### URL 파라미터 추가

```ts
const params = new URLSearchParams({ name, birthday, today: todayStr, petType })
```

---

## LoadingScreen.tsx 설계

### props 추가

```ts
interface LoadingScreenProps {
  petType?: 'dog' | 'cat'
}
```

### 분기

```tsx
const petEmoji = petType === 'cat' ? '🐱' : '🐶'
// 기존 🐶 위치에 petEmoji 사용
```

로딩 텍스트는 공통 유지: "🔮 운명을 읽는 중..."

---

## result/page.tsx 설계

### searchParams 추가

```ts
const { name, birthday, today: todayParam, petType: petTypeParam } = await searchParams
const petType = petTypeParam === 'cat' ? 'cat' : 'dog'
```

### 전달

```ts
const result = getFortuneResult(name, birthdayDate, today, petType)
// ...
<FortuneCard result={result} today={todayFormatted} petType={petType} />
```

---

## FortuneCard.tsx 설계

### props 추가

```ts
interface FortuneCardProps {
  result: FortuneResult
  today: string
  petType?: 'dog' | 'cat'
}
```

### 카드 타이틀 분기

카드 상단에 표시되는 타이틀:
- 강아지: '오늘의 멍운세'
- 고양이: '오늘의 냥운세'

---

## 앱 이름 변경

- `src/app/layout.tsx`: metadata title/og/twitter → '오늘의 멍냥운세'
- `src/app/page.tsx`: h1, description → '오늘의 멍냥운세'

---

## 테스트

- `fortune.test.ts`: `getFortuneResult` petType 파라미터 테스트 추가
  - petType='cat' → CAT_MESSAGES 범위 내 인덱스 사용 확인
  - petType='dog' (기본값) → 기존 테스트 통과
- 기존 테스트는 기본값으로 petType 생략 → 하위 호환 유지
