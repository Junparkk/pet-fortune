# 정적 데이터 확충 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `messages.ts`의 정적 데이터를 강아지 전용으로 확충하고 (MESSAGES 100개, LUCKY_ITEMS 50개, MOODS reason 기분당 3개), `fortune.ts`의 reason 선택 로직 1줄 수정.

**Architecture:** `messages.ts`만 데이터를 보유하고, `fortune.ts`는 그걸 참조해 결과를 계산한다. MOODS의 `reason: string`을 `reasons: string[]`로 바꾸고, fortune.ts에서 hash 기반으로 하나를 선택한다.

**Tech Stack:** TypeScript, Jest

---

### Task 1: MOODS reasons 배열화 (TDD)

**Files:**
- Modify: `src/lib/messages.ts`
- Modify: `src/lib/fortune.ts`
- Create: `src/lib/__tests__/fortune.test.ts`

- [ ] **Step 1: 테스트 디렉토리 생성**

```bash
mkdir -p src/lib/__tests__
```

- [ ] **Step 2: 실패 테스트 작성**

`src/lib/__tests__/fortune.test.ts` 파일을 아래 내용으로 생성:

```ts
import { getFortuneResult } from '../fortune'
import { MOODS } from '../messages'

describe('getFortuneResult', () => {
  const today = new Date('2026-03-28')
  const birthday = new Date('2018-05-10')

  it('moodReason은 해당 기분의 reasons 배열 중 하나여야 한다', () => {
    const result = getFortuneResult('초코', birthday, today)
    const mood = MOODS[result.moodLevel]
    expect(mood.reasons).toContain(result.moodReason)
  })

  it('같은 입력은 항상 같은 moodReason을 반환한다', () => {
    const r1 = getFortuneResult('초코', birthday, today)
    const r2 = getFortuneResult('초코', birthday, today)
    expect(r1.moodReason).toBe(r2.moodReason)
  })

  it('MESSAGES 길이는 100이다', () => {
    const { MESSAGES } = require('../messages')
    expect(MESSAGES.length).toBe(100)
  })

  it('LUCKY_ITEMS 길이는 50이다', () => {
    const { LUCKY_ITEMS } = require('../messages')
    expect(LUCKY_ITEMS.length).toBe(50)
  })
})
```

- [ ] **Step 3: 테스트 실행 → 실패 확인**

```bash
npx jest src/lib/__tests__/fortune.test.ts --no-coverage
```

Expected: FAIL — `mood.reasons is not iterable` 또는 `Cannot read properties of undefined`

- [ ] **Step 4: messages.ts에서 MOODS의 reason → reasons 배열로 변경**

`src/lib/messages.ts`의 MOODS를 아래로 교체:

```ts
export const MOODS = [
  {
    label: '최고예요! ✨', emoji: '🌟',
    reasons: [
      '오늘은 온 우주가 나를 응원하는 날이에요!',
      '기운이 넘쳐흘러요! 오늘은 무엇이든 할 수 있는 날!',
      '행운의 파동이 온몸을 감싸고 있어요. 오늘은 특별한 날!',
    ],
  },
  {
    label: '신나요! 🐾', emoji: '🎉',
    reasons: [
      '기운이 팡팡! 뛰어놀고 싶은 날이에요.',
      '신나는 에너지가 가득! 산책하면 더 좋아질 거예요.',
      '꼬리가 저절로 흔들리는 날이에요!',
    ],
  },
  {
    label: '평화로워요 😌', emoji: '🌸',
    reasons: [
      '조용하고 평화로운 하루예요. 낮잠 자고 싶어요.',
      '햇살 아래 여유롭게 쉬고 싶은 날이에요.',
      '오늘은 그냥 평온하게 있고 싶어요.',
    ],
  },
  {
    label: '좀 졸려요 😴', emoji: '💤',
    reasons: [
      '오늘은 에너지가 좀 부족해요. 곁에 있어줘요.',
      '눈꺼풀이 자꾸 내려와요. 낮잠이 필요해요.',
      '아직 아침인가요? 조금만 더 자도 되나요?',
    ],
  },
  {
    label: '삐졌어요 🙄', emoji: '😤',
    reasons: [
      '오늘은 관심이 필요한 날이에요. 쓰다듬어줘요!',
      '왜 아무도 나한테 관심을 안 줘요? 심심해요.',
      '간식도 주고 놀아줘야 기분이 풀릴 것 같아요.',
    ],
  },
]
```

- [ ] **Step 5: fortune.ts에서 moodReason 선택 로직 수정**

`src/lib/fortune.ts` 80번째 줄 근방:

변경 전:
```ts
    moodReason:    MOODS[moodLevel].reason,
```

변경 후:
```ts
    moodReason:    MOODS[moodLevel].reasons[(nameHash + today.getDate()) % MOODS[moodLevel].reasons.length],
```

- [ ] **Step 6: 테스트 실행 → 통과 확인**

```bash
npx jest src/lib/__tests__/fortune.test.ts --no-coverage
```

Expected:
```
PASS src/lib/__tests__/fortune.test.ts
  getFortuneResult
    ✓ moodReason은 해당 기분의 reasons 배열 중 하나여야 한다
    ✓ 같은 입력은 항상 같은 moodReason을 반환한다
    ✗ MESSAGES 길이는 100이다  ← 아직 실패 (20개)
    ✗ LUCKY_ITEMS 길이는 50이다  ← 아직 실패 (10개)
```

- [ ] **Step 7: 빌드 타입 체크**

```bash
npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 8: 커밋**

```bash
git add src/lib/messages.ts src/lib/fortune.ts src/lib/__tests__/fortune.test.ts
git commit -m "feat: convert MOODS reason to reasons array with hash-based selection"
```

---

### Task 2: LUCKY_ITEMS 10 → 50개

**Files:**
- Modify: `src/lib/messages.ts`

- [ ] **Step 1: LUCKY_ITEMS 전체 교체**

`src/lib/messages.ts`의 `LUCKY_ITEMS`를 아래 50개로 교체:

```ts
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
  { name: '고구마 간식', emoji: '🍠' },
  { name: '사과 한 조각', emoji: '🍎' },
  { name: '당근 스틱', emoji: '🥕' },
  { name: '육포 간식', emoji: '🥩' },
  { name: '강아지 쿠키', emoji: '🍪' },
  { name: '시원한 물 한 그릇', emoji: '💧' },
  { name: '애견 카페 방문', emoji: '☕' },
  { name: '강아지 수영장', emoji: '🏊' },
  { name: '드라이브', emoji: '🚗' },
  { name: '주인과 낮잠', emoji: '😴' },
  { name: '공 던지기 놀이', emoji: '⚽' },
  { name: '밧줄 장난감 당기기', emoji: '🪢' },
  { name: '냄새 탐험 산책', emoji: '👃' },
  { name: '애견 공원 나들이', emoji: '🌿' },
  { name: '목욕 후 드라이', emoji: '🛁' },
  { name: '발바닥 마사지', emoji: '🐾' },
  { name: '새 간식 그릇', emoji: '🥣' },
  { name: '푹신한 강아지 침대', emoji: '🛏️' },
  { name: '귀 긁어주기', emoji: '👂' },
  { name: '잔디 위 뒹굴기', emoji: '🌱' },
  { name: '나뭇잎 밟기', emoji: '🍂' },
  { name: '해변 산책', emoji: '🏖️' },
  { name: '주인 무릎 위 앉기', emoji: '🦵' },
  { name: '새 목줄', emoji: '🎀' },
  { name: '인형 장난감', emoji: '🧸' },
  { name: '낙엽 냄새 맡기', emoji: '🍁' },
  { name: '폭신한 담요', emoji: '🛋️' },
  { name: '창가 햇빛 쬐기', emoji: '🌅' },
  { name: '새벽 산책', emoji: '🌙' },
  { name: '주인이랑 사진 찍기', emoji: '📸' },
  { name: '바람 맡기', emoji: '💨' },
  { name: '특별한 산책 코스', emoji: '🗺️' },
  { name: '소시지 간식', emoji: '🌭' },
  { name: '강아지 전용 아이스크림', emoji: '🍦' },
  { name: '치즈 한 조각', emoji: '🧀' },
  { name: '블루베리 간식', emoji: '🫐' },
  { name: '코코넛 오일 마사지', emoji: '🥥' },
  { name: '장난감 박스 뒤지기', emoji: '📦' },
  { name: '주인 양말 물고 달리기', emoji: '🧦' },
  { name: '공원 다람쥐 구경', emoji: '🐿️' },
  { name: '특별한 생일 간식', emoji: '🎂' },
]
```

- [ ] **Step 2: 테스트 실행**

```bash
npx jest src/lib/__tests__/fortune.test.ts --no-coverage
```

Expected:
```
✓ moodReason은 해당 기분의 reasons 배열 중 하나여야 한다
✓ 같은 입력은 항상 같은 moodReason을 반환한다
✗ MESSAGES 길이는 100이다  ← 아직 실패
✓ LUCKY_ITEMS 길이는 50이다
```

- [ ] **Step 3: 커밋**

```bash
git add src/lib/messages.ts
git commit -m "feat: expand LUCKY_ITEMS to 50 dog-specific items"
```

---

### Task 3: MESSAGES 20 → 100개

**Files:**
- Modify: `src/lib/messages.ts`

- [ ] **Step 1: MESSAGES 전체 교체**

`src/lib/messages.ts`의 `MESSAGES`를 아래 100개로 교체:

```ts
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
  '오늘은 멍멍 한 마디면 원하는 걸 다 얻을 수 있어요!',
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
  '오늘은 창문 너머로 지나가는 사람을 세 명 세면 행운이 찾아와요!',
  '오늘 산책에서 새로운 냄새를 맡으면 특별한 하루가 돼요!',
  '오늘의 행운 포즈: 앞발을 앞으로 쭉 뻗고 스트레칭!',
  '오늘은 주인 손을 핥으면 기분이 두 배로 좋아져요!',
  '오늘 간식 달라고 눈을 반짝이면 무조건 성공하는 날!',
  '오늘은 소파 쿠션 위에서 뒹굴면 풍수지리가 좋아져요!',
  '오늘 주인이 전화할 때 옆에 앉아 있으면 행운이 전달돼요!',
  '오늘은 뼈다귀 장난감을 세 번 던져달라고 하면 소원 성취!',
  '산책 중 비둘기를 발견하면 오늘의 행운이 시작돼요!',
  '오늘은 주인 옷에 털을 남기면 나의 영역이 완성돼요!',
  '오늘 가장 좋아하는 자리에서 낮잠을 자면 꿈이 달콤해요!',
  '오늘은 꼬리를 가장 빠르게 흔들어야 하는 날이에요!',
  '주인 신발 냄새를 맡으면 오늘 주인의 하루를 알 수 있어요!',
  '오늘은 공을 가져다주면 행운 스탬프 3개!',
  '오늘 처음 만나는 사람에게 앞발 인사를 하면 친구가 돼요!',
  '오늘은 주인 침대에서 자는 게 최고의 선택이에요!',
  '목욕 후 온몸을 털면 행운이 사방으로 퍼져요!',
  '오늘은 간식 봉지 소리에 제일 먼저 달려가야 해요!',
  '오늘 주인이 슬퍼 보이면 옆에 딱 붙어 앉아주세요. 그게 최고의 위로예요!',
  '오늘은 산책할 때 새로운 길을 가면 모험 운이 UP!',
  '오늘 아침 주인 얼굴을 핥으면 하루 종일 에너지가 넘쳐요!',
  '오늘은 장난감 상자를 뒤지면 잊었던 보물을 발견해요!',
  '오늘의 행운 숫자는 3! 간식도 3개, 산책도 3바퀴!',
  '오늘은 주인 무릎 위에서 하품하면 평화 에너지가 퍼져요!',
  '오늘 빗소리를 들으면서 쉬면 마음이 편안해져요!',
  '오늘은 주인이 요리할 때 주방 앞을 지키면 간식 확률 UP!',
  '오늘 강아지 친구를 만나면 기운이 두 배로 충전돼요!',
  '오늘은 발바닥 냄새가 행운을 부르는 날이에요!',
  '오늘 주인이 외출할 때 아쉬운 눈빛으로 배웅하면 선물이 생겨요!',
  '오늘은 햇살 드는 창가에서 낮잠을 자야 에너지가 충전돼요!',
  '오늘 꼬리를 크게 흔들면 행운이 온몸에 퍼져요!',
  '오늘은 주인 가방에 코를 대면 오늘의 일정을 파악할 수 있어요!',
  '오늘 저녁 주인과 함께 소파에 누우면 최고의 하루 마무리!',
  '오늘은 밥그릇을 핥아 깨끗이 비우면 내일 더 맛있는 밥이 와요!',
  '오늘 목줄을 차면 신나는 모험이 시작돼요!',
  '오늘은 주인 발뒤꿈치를 따라다니면 행운이 찾아와요!',
  '오늘 처음 본 강아지와 코인사를 하면 새 친구 운이 열려요!',
  '오늘은 주인 무릎에 앞발을 올리면 원하는 게 이루어져요!',
  '오늘 마당에서 흙냄새를 맡으면 기운이 충전돼요!',
  '오늘은 귀를 쫑긋 세우고 소리를 들으면 좋은 소식이 와요!',
  '오늘 주인이 웃는 모습을 보면 오늘 하루 행운이 두 배예요!',
  '오늘은 간식을 천천히 먹으면 더 오래 행복한 날이에요!',
  '오늘 새벽 산책을 하면 하루 종일 기운이 넘쳐요!',
  '오늘은 주인과 함께 낮잠을 자야 최고의 에너지가 충전돼요!',
  '오늘 주인이 부르면 전속력으로 달려가세요. 행운이 기다려요!',
  '오늘은 털 빗질을 받으면 운이 새로 정리되는 날이에요!',
  '오늘 창밖에서 새를 발견하면 특별한 하루가 시작돼요!',
  '오늘은 주인 손 냄새를 맡으면 오늘의 일정을 파악할 수 있어요!',
  '오늘 소파 쿠션 사이에 코를 박으면 보물이 나와요!',
  '오늘은 주인이 TV 볼 때 옆에 딱 붙어야 행운이 와요!',
  '오늘 산책에서 나뭇잎을 밟으면 풍요 운이 찾아와요!',
  '오늘은 주인 무릎 위에서 꿈을 꾸면 그 꿈이 이루어져요!',
  '오늘 뼈다귀를 발견하면 오늘의 미션 완료!',
  '오늘은 주인에게 앞발을 내밀면 최고의 인사가 돼요!',
  '오늘 산책 중 다른 강아지에게 먼저 다가가면 사교 운 UP!',
  '오늘은 간식 냄새를 제일 빨리 맡아야 행운이 와요!',
  '오늘 주인 침대 위에서 낮잠을 자면 꿈이 달콤해요!',
  '오늘은 오후 햇살 아래에서 뒹굴면 비타민 운이 채워져요!',
  '오늘 주인 옆에서 코를 골며 자면 주인도 기분 좋아져요!',
  '오늘은 물을 충분히 마셔야 체력 운이 좋아져요!',
  '오늘 주인이 안아줄 때 꼬리를 세게 흔들면 행복이 전달돼요!',
  '오늘은 털 손질을 받으면 기운이 새로워지는 날이에요!',
  '오늘 주인이 집에 올 때까지 창가를 지키면 기다림 운이 가득!',
  '오늘은 새로운 장난감을 받으면 오늘의 운이 활짝 열려요!',
  '오늘 공원에서 제일 신나게 달리면 오늘 하루가 활기차요!',
  '오늘은 오전에 산책을 가면 하루 종일 행운이 따라와요!',
  '오늘 주인 손을 핥으면 기분이 서로 좋아지는 마법이 생겨요!',
  '오늘은 바닥에 배를 깔고 쉬면 여유 운이 가득해요!',
  '오늘 간식을 받고 빙글빙글 돌면 기쁨이 두 배예요!',
  '오늘은 주인이 퇴근할 때 가장 크게 반겨주면 행운이 와요!',
  '오늘 첫 산책에서 냄새를 오래 맡으면 오늘의 날씨 운을 알 수 있어요!',
  '오늘은 주인이 먹는 거 옆에서 지켜보면 간식 확률이 높아요!',
  '오늘 앞발로 주인 다리를 톡톡 치면 원하는 게 이루어져요!',
  '오늘은 강아지 침대에서 둥글게 말고 자면 아늑 운이 가득해요!',
  '오늘 주인이랑 눈 마주치면 서로 마음이 전달되는 날이에요!',
  '오늘은 털이 빠져도 괜찮아요. 복이 사방에 퍼지는 날이에요!',
  '오늘 주인이 부를 때 전속력으로 달려오면 사랑 운이 MAX!',
  '오늘은 배 마사지를 받으면 모든 걱정이 사라져요!',
  '오늘 장난감을 물고 신나게 흔들면 나쁜 기운이 사라져요!',
  '오늘은 주인과 함께 있는 것만으로도 충분히 행운이에요!',
]
```

- [ ] **Step 2: 테스트 실행 → 전체 통과 확인**

```bash
npx jest src/lib/__tests__/fortune.test.ts --no-coverage
```

Expected:
```
PASS src/lib/__tests__/fortune.test.ts
  getFortuneResult
    ✓ moodReason은 해당 기분의 reasons 배열 중 하나여야 한다
    ✓ 같은 입력은 항상 같은 moodReason을 반환한다
    ✓ MESSAGES 길이는 100이다
    ✓ LUCKY_ITEMS 길이는 50이다
```

- [ ] **Step 3: 최종 빌드 확인**

```bash
npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 4: 커밋**

```bash
git add src/lib/messages.ts
git commit -m "feat: expand MESSAGES to 100 dog fortune messages"
```
