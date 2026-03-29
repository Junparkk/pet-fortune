# 멍냥운세 — 강아지/고양이 분기 구현 플랜

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 앱에 강아지/고양이 토글을 추가하고 고양이 전용 운세 데이터, 로딩화면, 결과 카드를 구현한다.

**Architecture:** `petType: 'dog' | 'cat'`이 URL 파라미터로 전달되어 messages.ts의 cat 전용 데이터, fortune.ts의 분기 로직, 그리고 UI 컴포넌트 전체에 영향을 준다. 기존 강아지 로직은 기본값으로 완전히 하위 호환된다.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, Vitest

---

## 파일 구조

| 파일 | 변경 |
|------|------|
| `src/lib/messages.ts` | MOODS에 catReasons 추가, CAT_LUCKY_ITEMS/CAT_MESSAGES/CAT_BIRTHDAY_MESSAGE export 추가 |
| `src/lib/fortune.ts` | getFortuneResult에 petType 파라미터 추가 |
| `src/lib/__tests__/fortune.test.ts` | cat petType 테스트 추가 |
| `src/components/PetForm.tsx` | petType 토글 UI 추가, URL param 전달 |
| `src/components/LoadingScreen.tsx` | petType prop 추가, 🐶/🐱 분기 |
| `src/app/result/page.tsx` | petType searchParam 읽기, fortune/card에 전달 |
| `src/components/FortuneCard.tsx` | petType prop 추가, 카드 타이틀 분기 |
| `src/app/layout.tsx` | 앱 이름 → 오늘의 멍냥운세 |
| `src/app/page.tsx` | 앱 이름 → 오늘의 멍냥운세 |

---

### Task 1: messages.ts — 고양이 데이터 추가

**Files:**
- Modify: `src/lib/messages.ts`
- Test: `src/lib/__tests__/fortune.test.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

`src/lib/__tests__/fortune.test.ts`의 기존 import 라인 (line 9) 을 업데이트한다:

```ts
// 변경 전:
import { MOODS, MESSAGES, LUCKY_ITEMS } from '../messages'
// 변경 후:
import { MOODS, MESSAGES, LUCKY_ITEMS, CAT_MESSAGES, CAT_LUCKY_ITEMS } from '../messages'
```

그 다음 파일 끝에 다음을 추가한다:

```ts
describe('cat 데이터', () => {
  it('CAT_MESSAGES 길이는 100이다', () => {
    expect(CAT_MESSAGES.length).toBe(100)
  })

  it('CAT_LUCKY_ITEMS 길이는 50이다', () => {
    expect(CAT_LUCKY_ITEMS.length).toBe(50)
  })

  it('모든 MOODS에 catReasons가 3개씩 있다', () => {
    MOODS.forEach(mood => {
      expect(mood.catReasons).toBeDefined()
      expect(mood.catReasons.length).toBe(3)
    })
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
cd /Users/jun/Desktop/jun/pet && npx vitest run src/lib/__tests__/fortune.test.ts
```

Expected: `CAT_MESSAGES is not exported` 또는 유사한 오류로 FAIL

- [ ] **Step 3: messages.ts에 고양이 데이터 추가**

`src/lib/messages.ts`의 MOODS를 다음으로 교체 (catReasons 추가):

```ts
export const MOODS = [
  {
    label: '최고예요! ✨', emoji: '🌟',
    reasons: [
      '오늘은 온 우주가 나를 응원하는 날이에요!',
      '기운이 넘쳐흘러요! 오늘은 무엇이든 할 수 있는 날!',
      '행운의 파동이 온몸을 감싸고 있어요. 오늘은 특별한 날!',
    ],
    catReasons: [
      '온 세상이 내 발아래 있는 날이에요!',
      '오늘은 내가 이 집의 왕이에요! 모두가 날 섬겨요!',
      '행운의 파동이 수염 끝까지 전달되는 특별한 날!',
    ],
  },
  {
    label: '신나요! 🐾', emoji: '🎉',
    reasons: [
      '기운이 팡팡! 뛰어놀고 싶은 날이에요.',
      '신나는 에너지가 가득! 산책하면 더 좋아질 거예요.',
      '꼬리가 저절로 흔들리는 날이에요!',
    ],
    catReasons: [
      '꼬리를 세우고 온 집을 누비고 싶은 날이에요!',
      '에너지가 팡팡! 레이저 포인터를 쫓아다니고 싶어요!',
      '수염이 팽팽하게 서는 신나는 날이에요!',
    ],
  },
  {
    label: '평화로워요 😌', emoji: '🌸',
    reasons: [
      '조용하고 평화로운 하루예요. 낮잠 자고 싶어요.',
      '햇살 아래 여유롭게 쉬고 싶은 날이에요.',
      '오늘은 그냥 평온하게 있고 싶어요.',
    ],
    catReasons: [
      '따뜻한 햇살 아래 그루밍하고 싶은 날이에요.',
      '창틀에서 바깥을 바라보며 조용히 쉬고 싶어요.',
      '오늘은 아무것도 안 하는 게 최고의 선택이에요.',
    ],
  },
  {
    label: '좀 졸려요 😴', emoji: '💤',
    reasons: [
      '오늘은 에너지가 좀 부족해요. 곁에 있어줘요.',
      '눈꺼풀이 자꾸 내려와요. 낮잠이 필요해요.',
      '아직 아침인가요? 조금만 더 자도 되나요?',
    ],
    catReasons: [
      '오늘은 하루 종일 자도 모자란 날이에요.',
      '눈꺼풀이 자꾸 내려와요. 낮잠이 필요해요.',
      '아직도 잘 시간인가요? 조금만 더 자도 되나요?',
    ],
  },
  {
    label: '삐졌어요 🙄', emoji: '😤',
    reasons: [
      '오늘은 관심이 필요한 날이에요. 쓰다듬어줘요!',
      '왜 아무도 나한테 관심을 안 줘요? 심심해요.',
      '간식도 주고 놀아줘야 기분이 풀릴 것 같아요.',
    ],
    catReasons: [
      '오늘은 관심이 필요한 날이에요. 쓰다듬어줘요!',
      '왜 나한테 집중을 안 해요? 무시당하는 느낌이에요.',
      '캣닙이라도 줘야 기분이 풀릴 것 같아요.',
    ],
  },
]
```

그 다음 파일 끝에 (BIRTHDAY_MESSAGE 아래) 고양이 데이터를 추가한다:

```ts
export const CAT_LUCKY_ITEMS = [
  { name: '참치 간식', emoji: '🐟' },
  { name: '연어 트릿', emoji: '🍣' },
  { name: '깃털 장난감', emoji: '🪶' },
  { name: '레이저 포인터', emoji: '🔴' },
  { name: '박스 탐험', emoji: '📦' },
  { name: '스크래처', emoji: '🪵' },
  { name: '캣닙', emoji: '🌿' },
  { name: '쥐 인형', emoji: '🐭' },
  { name: '창틀 낮잠', emoji: '🪟' },
  { name: '그루밍 빗', emoji: '🪮' },
  { name: '고양이 캔 간식', emoji: '🥫' },
  { name: '따뜻한 햇살 낮잠', emoji: '☀️' },
  { name: '폭신한 담요', emoji: '🛋️' },
  { name: '창문 밖 구경', emoji: '🪟' },
  { name: '주인 무릎 위 앉기', emoji: '🦵' },
  { name: '털 빗질', emoji: '🪮' },
  { name: '캣타워 탐험', emoji: '🏰' },
  { name: '주인 가슴팍 꾹꾹이', emoji: '🫶' },
  { name: '치킨 간식', emoji: '🍗' },
  { name: '건식 사료 한 그릇', emoji: '🥣' },
  { name: '선반 위 자리', emoji: '📚' },
  { name: '비닐봉지 탐험', emoji: '🛍️' },
  { name: '끈 장난감', emoji: '🧵' },
  { name: '햇빛 아래 스트레칭', emoji: '🌅' },
  { name: '주인 옷 위 낮잠', emoji: '👕' },
  { name: '조용한 은신처 발견', emoji: '🏠' },
  { name: '물그릇 앞발 첨벙', emoji: '💧' },
  { name: '미니 터널 장난감', emoji: '🕳️' },
  { name: '고양이 전용 풀', emoji: '🌱' },
  { name: '유리창 햇살', emoji: '🌤️' },
  { name: '주인 책 위 앉기', emoji: '📖' },
  { name: '새벽 점프 연습', emoji: '🌙' },
  { name: '주인 목도리 위 낮잠', emoji: '🧣' },
  { name: '귀 긁어주기', emoji: '👂' },
  { name: '특별한 생일 간식', emoji: '🎂' },
  { name: '새 스크래처 패드', emoji: '📋' },
  { name: '깃털 낚시대 장난감', emoji: '🎣' },
  { name: '따뜻한 노트북 위 자리', emoji: '💻' },
  { name: '주인이랑 눈 맞추기', emoji: '👀' },
  { name: '버블 장난감', emoji: '🫧' },
  { name: '빈 종이봉투 탐험', emoji: '🗂️' },
  { name: '주인 머리 냄새 맡기', emoji: '👃' },
  { name: '소파 뒤 숨기', emoji: '🛋️' },
  { name: '주인과 함께 있기', emoji: '🐱' },
  { name: '시원한 물 한 그릇', emoji: '💧' },
  { name: '폭신한 고양이 침대', emoji: '🛏️' },
  { name: '창가 햇빛 쬐기', emoji: '🌅' },
  { name: '주인이랑 사진 찍기', emoji: '📸' },
  { name: '새벽 산책 구경', emoji: '🌙' },
  { name: '특별한 간식 봉지 소리', emoji: '🎶' },
]

export const CAT_MESSAGES = [
  '오늘은 박스 안에 들어가면 우주 최고의 자리를 차지하는 날이에요!',
  '오늘은 그루밍을 세 번 하면 미모 운이 MAX!',
  '오늘 주인을 무시하면 더 매력적으로 보이는 날이에요.',
  '오늘은 창틀에서 바깥을 구경하면 철학적 깨달음이 찾아와요.',
  '오늘 캣닙을 받으면 오늘 하루가 완성돼요!',
  '오늘은 물건을 테이블에서 밀어뜨리면 중력 실험 성공 운이 UP!',
  '오늘 레이저 포인터를 끝까지 추적하면 집중력 운이 올라가요.',
  '오늘은 주인 키보드 위에 앉으면 모든 일이 잘 풀려요.',
  '오늘 느린 눈 깜빡임으로 주인에게 사랑을 전하면 행운이 두 배!',
  '오늘은 주인 얼굴을 가만히 쳐다보면 원하는 게 이루어져요.',
  '오늘은 새벽 3시에 뛰어다니면 하루 종일 에너지가 넘쳐요!',
  '오늘 따뜻한 창가에서 낮잠을 자면 행복이 가득해요.',
  '오늘은 주인 다리 사이에서 자면 최고의 포근함이 찾아와요.',
  '오늘 스크래처를 힘껏 긁으면 나쁜 기운이 사라져요!',
  '오늘은 수염을 가다듬으면 운이 새로 정리돼요.',
  '오늘 주인이 오면 일부러 쳐다보지 않아야 더 사랑스러워 보여요.',
  '오늘 간식 봉지 소리가 들리면 전속력으로 달려가세요. 행운이에요!',
  '오늘은 참치 향이 나는 곳을 찾으면 오늘의 보물을 발견해요.',
  '오늘 주인 배 위에서 꾹꾹이 하면 모든 소원이 이루어져요.',
  '오늘은 높은 곳에 올라가면 세상이 더 넓어 보이는 날이에요.',
  '오늘 구석에 숨어있으면 신비로운 힘이 생겨요.',
  '오늘은 주인이 자는 동안 얼굴을 살짝 건드리면 오늘의 미션 완료!',
  '오늘 창밖에서 새를 발견하면 사냥 운이 MAX!',
  '오늘은 담요 아래 숨으면 아늑한 행운이 찾아와요.',
  '오늘 주인에게 야옹 한 마디면 원하는 간식을 얻을 수 있어요!',
  '오늘은 꼬리를 세우고 당당하게 걸으면 카리스마가 빛나요.',
  '오늘 주인 책 위에 앉으면 지식이 전달돼요.',
  '오늘은 물그릇 앞발로 저어보면 오늘의 날씨 운을 알 수 있어요.',
  '오늘 주인이 열심히 일할 때 옆에 앉아주면 생산성이 올라가요.',
  '오늘은 낮잠을 4번 자면 체력 운이 최고예요.',
  '오늘 쥐 인형을 물고 흔들면 나쁜 기운이 사라져요!',
  '오늘은 주인 머리 위에서 자면 특별한 에너지가 전달돼요.',
  '오늘 냉장고 앞을 지키면 간식 운이 열려요!',
  '오늘은 햇살이 드는 자리를 찾아 이동하면 비타민 운이 UP!',
  '오늘 주인 발치에서 뒹굴면 애교 운이 폭발해요.',
  '오늘은 창문 너머 비를 구경하면 평화로운 하루가 완성돼요.',
  '오늘 그루밍을 오래 하면 아름다움 운이 빛나요.',
  '오늘은 박스를 새로 발견하면 탐험 운이 열려요!',
  '오늘 주인이 슬퍼 보이면 조용히 옆에 앉아주세요. 그게 마법이에요.',
  '오늘은 꼬리로 물건을 툭 치면 오늘의 스트레스가 사라져요.',
  '오늘 밖에서 바람 냄새를 맡으면 모험 운이 가득해요.',
  '오늘은 주인이 먹는 걸 뚫어지게 쳐다보면 한 조각 얻을 수 있어요.',
  '오늘 앞발로 문을 두드리면 원하는 방에 들어갈 수 있어요!',
  '오늘은 주인 가방 안에서 자면 여행 운이 생겨요.',
  '오늘 자고 일어나서 기지개를 크게 펴면 하루 운이 활짝 열려요!',
  '오늘은 햇빛에 등을 대고 자면 에너지가 충전돼요.',
  '오늘 주인이랑 눈 마주치면 서로의 마음이 전해지는 날이에요.',
  '오늘은 조용히 앉아 주인을 관찰하면 오늘의 비밀을 알 수 있어요.',
  '오늘 간식을 천천히 음미하면 더 오래 행복한 날이에요.',
  '오늘은 집 안에서 새로운 숨을 자리를 찾으면 행운이 찾아와요!',
  '오늘 주인이 전화할 때 옆에서 야옹 하면 존재감 UP!',
  '오늘은 부드러운 담요 위에서 꾹꾹이 하면 행복 운이 MAX!',
  '오늘 새벽에 주인을 깨우면 오늘 하루 내가 주인공이에요.',
  '오늘은 화분 흙을 살짝 파보면 탐험 에너지가 생겨요.',
  '오늘 주인 옷 위에 털을 남기면 나의 영역이 완성돼요!',
  '오늘 창가에서 비둘기를 보면 오늘의 흥분 운이 MAX!',
  '오늘은 주인이 일찍 일어나도록 얼굴에 앉아주세요. 사랑이에요.',
  '오늘 냉장고 소리에 귀 기울이면 간식의 존재를 알 수 있어요.',
  '오늘은 낮잠 장소를 바꾸면 새로운 행운이 찾아와요!',
  '오늘 주인이 돌아오면 일부러 느리게 다가가세요. 더 사랑스러워요.',
  '오늘은 스트레칭을 크게 하면 유연성 운이 UP!',
  '오늘 친구 고양이를 만나면 소셜 운이 활짝 열려요.',
  '오늘은 높은 선반에 올라가면 왕좌의 기운을 얻어요.',
  '오늘 주인의 따뜻한 무릎에 앉으면 행복 에너지가 가득해요.',
  '오늘은 물그릇 옆에서 앞발을 적시면 기분 전환 운이 생겨요.',
  '오늘 장난감 쥐를 잡으면 오늘의 사냥 미션 완료!',
  '오늘은 캣닙 냄새를 맡으면 오늘 하루 행복 운이 두 배예요.',
  '오늘 주인이 요가할 때 매트 위에 앉으면 평화 에너지가 전달돼요.',
  '오늘은 어두운 구석을 탐험하면 신비로운 행운이 기다려요.',
  '오늘 창틀에서 낮잠을 자면 세상에서 제일 편안한 하루예요.',
  '오늘은 주인 발을 툭툭 건드리면 놀아달라는 신호가 통해요!',
  '오늘 간식 냄새를 먼저 맡으면 미각 운이 올라가요.',
  '오늘은 털을 곤두세우며 점프하면 용기 운이 MAX!',
  '오늘 주인이랑 함께 TV를 보면 오늘 하루가 완성돼요.',
  '오늘은 주인 손등을 핥으면 친밀도가 높아지는 날이에요.',
  '오늘 박스에 들어가서 나오지 않으면 신비감이 올라가요.',
  '오늘은 주인이 자는 동안 발 위에 올라가서 자면 온기 운이 UP!',
  '오늘 야옹을 3번 하면 주인의 관심을 100% 받을 수 있어요!',
  '오늘은 꼬리를 느리게 흔들면 심리적 여유가 생겨요.',
  '오늘 창밖 나비를 발견하면 오늘의 행운이 날아와요.',
  '오늘은 주인 품에 파고들면 따뜻한 에너지가 전달돼요.',
  '오늘 그루밍 후 주인을 쳐다보면 "예쁘죠?" 운이 발동해요!',
  '오늘은 소파 뒤에 숨으면 신비로운 존재감이 빛나는 날이에요.',
  '오늘 털을 고르고 나서 낮잠을 자면 최고의 뷰티 루틴 완성!',
  '오늘은 주인이 바쁠 때 도와주러 올라가면 진정한 협력 운이 생겨요.',
  '오늘 야식 시간에 부엌에 등장하면 간식 운이 열려요!',
  '오늘은 주인과 함께 있는 것만으로도 충분히 완벽한 하루예요.',
  '오늘 새로운 냄새를 탐험하면 오늘의 세계가 넓어져요.',
  '오늘은 주인 가슴팍에서 꾹꾹이 하면 사랑 운이 폭발해요!',
  '오늘 물을 앞발로 저어 마시면 개성 운이 빛나요.',
  '오늘은 주인 머리 냄새를 맡으면 오늘의 안심 에너지를 얻어요.',
  '오늘 계단을 빠르게 달려 올라가면 활력 운이 UP!',
  '오늘은 자다가 발을 꿈틀거리면 꿈속에서도 행운이 찾아와요.',
  '오늘 주인이 집에 오면 천천히 눈 깜빡이며 인사하세요. 그게 최고예요.',
  '오늘은 낮잠을 자다 깨서 기지개 한 번이면 하루 후반 운이 UP!',
  '오늘 주인 냄새 나는 옷 위에서 자면 안심 운이 가득해요.',
  '오늘은 스크래처를 힘껏 긁고 나서 주인을 보면 인정받는 날이에요.',
  '오늘 주인이 부를 때 한 번 무시하고 두 번째에 가면 품위가 살아요.',
  '오늘은 주인과 함께 있는 것만으로도 충분히 행복한 하루예요.',
]

export const CAT_BIRTHDAY_MESSAGE = '🎂 생일이 다가오고 있어요! 오늘은 특별한 참치 캔이 행운을 불러와요!'
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
cd /Users/jun/Desktop/jun/pet && npx vitest run src/lib/__tests__/fortune.test.ts
```

Expected: 모든 테스트 PASS (기존 + 새 cat 데이터 테스트)

- [ ] **Step 5: 커밋**

```bash
cd /Users/jun/Desktop/jun/pet && git add src/lib/messages.ts src/lib/__tests__/fortune.test.ts && git commit -m "feat: add cat fortune data (CAT_MESSAGES, CAT_LUCKY_ITEMS, catReasons)"
```

---

### Task 2: fortune.ts — petType 파라미터 지원

**Files:**
- Modify: `src/lib/fortune.ts`
- Modify: `src/lib/__tests__/fortune.test.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

`src/lib/__tests__/fortune.test.ts`의 기존 `getFortuneResult — reasons array` describe 블록 아래에 추가한다 (import는 Task 1에서 이미 업데이트됨):

```ts
describe('getFortuneResult — petType cat', () => {
  const petName = '야옹이'
  const birthday = new Date(2021, 3, 10) // April 10, 2021
  const today = new Date(2026, 2, 29)    // March 29, 2026

  it('petType=cat이면 CAT_MESSAGES 범위 내 메시지를 반환한다', () => {
    const r = getFortuneResult(petName, birthday, today, 'cat')
    expect(CAT_MESSAGES).toContain(r.message)
  })

  it('petType=cat이면 CAT_LUCKY_ITEMS 범위 내 아이템을 반환한다', () => {
    const r = getFortuneResult(petName, birthday, today, 'cat')
    const found = CAT_LUCKY_ITEMS.some(item => item.name === r.luckyItem)
    expect(found).toBe(true)
  })

  it('petType=cat이면 catReasons 중 하나를 반환한다', () => {
    const r = getFortuneResult(petName, birthday, today, 'cat')
    const mood = MOODS[r.moodLevel]
    expect(mood.catReasons).toContain(r.moodReason)
  })

  it('petType=cat은 결정론적이다', () => {
    const r1 = getFortuneResult(petName, birthday, today, 'cat')
    const r2 = getFortuneResult(petName, birthday, today, 'cat')
    expect(r1).toEqual(r2)
  })

  it('petType 기본값(dog)은 기존 동작을 유지한다', () => {
    const r = getFortuneResult(petName, birthday, today)
    const mood = MOODS[r.moodLevel]
    expect(mood.reasons).toContain(r.moodReason)
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
cd /Users/jun/Desktop/jun/pet && npx vitest run src/lib/__tests__/fortune.test.ts
```

Expected: FAIL — `getFortuneResult` 4번째 인자가 없어 cat 분기가 없음

- [ ] **Step 3: fortune.ts 업데이트**

`src/lib/fortune.ts`를 다음으로 교체:

```ts
import {
  MOODS, LUCKY_ITEMS, MESSAGES,
  CAT_LUCKY_ITEMS, CAT_MESSAGES, CAT_BIRTHDAY_MESSAGE,
  ZODIAC_ANIMALS, ZODIAC_EMOJIS,
  ELEMENT_NAMES, ELEMENT_EMOJIS,
  BIRTHDAY_MESSAGE,
} from './messages'

export interface FortuneResult {
  moodLevel:     number
  moodLabel:     string
  moodEmoji:     string
  moodReason:    string
  luckyItem:     string
  luckyItemEmoji:string
  message:       string
  zodiacAnimal:  string
  zodiacEmoji:   string
  element:       string
  elementEmoji:  string
  isBirthdayWeek:boolean
  petName:       string
}

// Month index (0=Jan) → element index (0=木 1=火 2=土 3=金 4=水)
const MONTH_TO_ELEMENT = [4, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 0]

export function hashString(s: string): number {
  return s.split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 0)
}

export function getZodiacIndex(birthYear: number): number {
  return ((birthYear - 4) % 12 + 12) % 12
}

export function getPetElement(birthMonth: number): number {
  return MONTH_TO_ELEMENT[birthMonth]
}

// diff = (todayElement - petElement + 5) % 5
// 0 → 0, 1 → +2 (생), 4 → +1 (역생), 2 → -1 (극), 3 → -2 (역극)
export function getElementCompatibility(petElement: number, todayElement: number): number {
  const diff = ((todayElement - petElement) % 5 + 5) % 5
  if (diff === 0) return  0
  if (diff === 1) return  2
  if (diff === 4) return  1
  if (diff === 2) return -1
  return -2
}

export function checkBirthdayWeek(birthday: Date, today: Date): boolean {
  const yr = today.getFullYear()
  const todayDateOnly = new Date(yr, today.getMonth(), today.getDate())
  let next = new Date(yr, birthday.getMonth(), birthday.getDate())
  if (next < todayDateOnly) {
    next = new Date(yr + 1, birthday.getMonth(), birthday.getDate())
  }
  const diffDays = Math.floor((next.getTime() - todayDateOnly.getTime()) / 86_400_000)
  return diffDays <= 7
}

export function getFortuneResult(
  petName: string,
  birthday: Date,
  today: Date,
  petType: 'dog' | 'cat' = 'dog',
): FortuneResult {
  const isCat       = petType === 'cat'
  const nameHash    = hashString(petName)
  const petElement  = getPetElement(birthday.getMonth())
  const todayElement= today.getDate() % 5
  const compat      = getElementCompatibility(petElement, todayElement)
  const zodiacIndex = getZodiacIndex(birthday.getFullYear())

  const dayFactor  = (today.getDay() + today.getDate() + nameHash) % 5
  const moodLevel  = ((compat + 2) + dayFactor) % 5

  const messages   = isCat ? CAT_MESSAGES   : MESSAGES
  const luckyItems = isCat ? CAT_LUCKY_ITEMS : LUCKY_ITEMS
  const bdayMsg    = isCat ? CAT_BIRTHDAY_MESSAGE : BIRTHDAY_MESSAGE
  const reasons    = isCat ? MOODS[moodLevel].catReasons : MOODS[moodLevel].reasons

  const luckyIndex   = (nameHash + zodiacIndex + today.getMonth() + today.getDate()) % luckyItems.length
  const messageIndex = (nameHash + today.getDate() * 7 + today.getMonth() * 31) % messages.length

  const isBirthdayWeek = checkBirthdayWeek(birthday, today)

  return {
    moodLevel,
    moodLabel:     MOODS[moodLevel].label,
    moodEmoji:     MOODS[moodLevel].emoji,
    moodReason:    reasons[(nameHash + today.getDate()) % reasons.length],
    luckyItem:     luckyItems[luckyIndex].name,
    luckyItemEmoji:luckyItems[luckyIndex].emoji,
    message: isBirthdayWeek ? bdayMsg : messages[messageIndex],
    zodiacAnimal:  ZODIAC_ANIMALS[zodiacIndex],
    zodiacEmoji:   ZODIAC_EMOJIS[zodiacIndex],
    element:       ELEMENT_NAMES[petElement],
    elementEmoji:  ELEMENT_EMOJIS[petElement],
    isBirthdayWeek,
    petName,
  }
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
cd /Users/jun/Desktop/jun/pet && npx vitest run src/lib/__tests__/fortune.test.ts
```

Expected: 모든 테스트 PASS

- [ ] **Step 5: 커밋**

```bash
cd /Users/jun/Desktop/jun/pet && git add src/lib/fortune.ts src/lib/__tests__/fortune.test.ts && git commit -m "feat: add petType parameter to getFortuneResult"
```

---

### Task 3: PetForm.tsx — 강아지/고양이 토글

**Files:**
- Modify: `src/components/PetForm.tsx`

- [ ] **Step 1: PetForm.tsx 업데이트**

`src/components/PetForm.tsx`를 다음으로 교체:

```tsx
'use client'

import { useState, FormEvent, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import DatePicker from './DatePicker'
import LoadingScreen from './LoadingScreen'

type PetType = 'dog' | 'cat'

export default function PetForm() {
  const router = useRouter()
  const [petType, setPetType] = useState<PetType>('dog')
  const [name, setName] = useState('')
  const [birthday, setBirthday] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !birthday) return
    const params = new URLSearchParams({ name: name.trim(), birthday, today: todayStr, petType })
    setIsLoading(true)
    timerRef.current = setTimeout(() => {
      router.push(`/result?${params.toString()}`)
    }, 3000)
  }

  if (isLoading) return <LoadingScreen petType={petType} />

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      {/* 강아지/고양이 토글 */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setPetType('dog')}
          className={`flex-1 rounded-full py-2 text-base font-black transition-colors ${
            petType === 'dog'
              ? 'bg-violet-500 text-white'
              : 'border-2 border-violet-200 text-violet-400 bg-white'
          }`}
        >
          🐶 강아지
        </button>
        <button
          type="button"
          onClick={() => setPetType('cat')}
          className={`flex-1 rounded-full py-2 text-base font-black transition-colors ${
            petType === 'cat'
              ? 'bg-violet-500 text-white'
              : 'border-2 border-violet-200 text-violet-400 bg-white'
          }`}
        >
          🐱 고양이
        </button>
      </div>

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
          className="w-full rounded-2xl border-2 border-violet-200 bg-white px-4 py-3 text-lg md:text-lg outline-none focus-visible:ring-0 focus-visible:border-violet-400 transition-colors placeholder:text-gray-300 h-auto"
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
        className="mt-2 w-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600 py-4 text-lg font-black text-white shadow-lg transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        오늘의 운세 보기 ✨
      </button>
    </form>
  )
}
```

- [ ] **Step 2: 커밋**

```bash
cd /Users/jun/Desktop/jun/pet && git add src/components/PetForm.tsx && git commit -m "feat: add dog/cat toggle to PetForm"
```

---

### Task 4: LoadingScreen.tsx — petType prop 추가

**Files:**
- Modify: `src/components/LoadingScreen.tsx`

- [ ] **Step 1: LoadingScreen.tsx 업데이트**

`src/components/LoadingScreen.tsx`를 다음으로 교체:

```tsx
interface LoadingScreenProps {
  petType?: 'dog' | 'cat'
}

export default function LoadingScreen({ petType = 'dog' }: LoadingScreenProps) {
  const petEmoji = petType === 'cat' ? '🐱' : '🐶'

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      {/* 별 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <span className="absolute text-xl" style={{ top: '10%', left: '15%', animation: 'twinkle 2s ease-in-out infinite' }}>⭐</span>
        <span className="absolute text-sm" style={{ top: '15%', right: '20%', animation: 'twinkle 2.5s ease-in-out infinite 0.5s' }}>✨</span>
        <span className="absolute text-base" style={{ top: '70%', left: '10%', animation: 'twinkle 1.8s ease-in-out infinite 1s' }}>⭐</span>
        <span className="absolute text-sm" style={{ top: '80%', right: '15%', animation: 'twinkle 2.2s ease-in-out infinite 0.3s' }}>✨</span>
        <span className="absolute text-xl" style={{ top: '60%', right: '8%', animation: 'twinkle 3s ease-in-out infinite 0.8s' }}>⭐</span>
      </div>

      {/* 동물 + 유리구슬 */}
      <div className="relative flex flex-col items-center">
        <div
          className="relative z-10 text-7xl"
          style={{ animation: 'bob 1.5s ease-in-out infinite', marginBottom: '-20px' }}
        >
          {petEmoji}
        </div>
        <div
          className="rounded-full relative overflow-hidden"
          style={{
            width: '180px',
            height: '180px',
            background: 'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.95) 0%, rgba(215,225,255,0.8) 18%, rgba(160,175,240,0.65) 38%, rgba(90,100,200,0.8) 62%, rgba(15,10,70,0.97) 100%)',
            boxShadow: '0 0 55px 22px rgba(120,90,255,0.55), 0 12px 40px rgba(0,0,60,0.5), inset 0 0 35px rgba(70,50,200,0.25)',
          }}
        >
          {/* 주 반사광 */}
          <div style={{ position:'absolute', width:'65px', height:'42px', top:'10%', left:'14%', background:'radial-gradient(ellipse, rgba(255,255,255,0.95), transparent 70%)', filter:'blur(5px)', borderRadius:'50%' }} />
          {/* 보조 반사광 */}
          <div style={{ position:'absolute', width:'26px', height:'16px', bottom:'19%', right:'18%', background:'radial-gradient(ellipse, rgba(255,255,255,0.55), transparent 70%)', filter:'blur(3px)', borderRadius:'50%' }} />
        </div>
      </div>

      {/* 텍스트 */}
      <p className="mt-8 text-white text-lg font-bold animate-pulse">
        🔮 운명을 읽는 중...
      </p>
    </div>
  )
}
```

- [ ] **Step 2: 커밋**

```bash
cd /Users/jun/Desktop/jun/pet && git add src/components/LoadingScreen.tsx && git commit -m "feat: add petType prop to LoadingScreen (🐶/🐱 above crystal ball)"
```

---

### Task 5: result/page.tsx — petType searchParam 추가

**Files:**
- Modify: `src/app/result/page.tsx`

- [ ] **Step 1: result/page.tsx 업데이트**

`src/app/result/page.tsx`를 다음으로 교체:

```tsx
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
```

- [ ] **Step 2: 커밋**

```bash
cd /Users/jun/Desktop/jun/pet && git add src/app/result/page.tsx && git commit -m "feat: read petType from URL in result page"
```

---

### Task 6: FortuneCard.tsx — petType prop 추가

**Files:**
- Modify: `src/components/FortuneCard.tsx`

- [ ] **Step 1: FortuneCard.tsx 업데이트**

`src/components/FortuneCard.tsx`에서 `interface Props`와 컴포넌트 시그니처를 변경한다.

변경 전:
```tsx
interface Props {
  result: FortuneResult
  today: string
}
```

변경 후:
```tsx
interface Props {
  result: FortuneResult
  today: string
  petType?: 'dog' | 'cat'
}
```

변경 전:
```tsx
export default function FortuneCard({ result, today }: Props) {
```

변경 후:
```tsx
export default function FortuneCard({ result, today, petType = 'dog' }: Props) {
```

변경 전 (FortuneCard 내부 Header 섹션):
```tsx
        {/* Header */}
        <div className="text-center mb-3">
          <p className="text-xs font-bold text-gray-500">{today}</p>
          <h2 className="text-xl font-black text-gray-800 mt-1">{result.petName}의 오늘 운세</h2>
        </div>
```

변경 후:
```tsx
        {/* Header */}
        <div className="text-center mb-3">
          <p className="text-xs font-bold text-gray-500">{today}</p>
          <h2 className="text-xl font-black text-gray-800 mt-1">
            {result.petName}의 {petType === 'cat' ? '오늘의 냥운세' : '오늘의 멍운세'}
          </h2>
        </div>
```

- [ ] **Step 2: 커밋**

```bash
cd /Users/jun/Desktop/jun/pet && git add src/components/FortuneCard.tsx && git commit -m "feat: show 멍운세/냥운세 title in FortuneCard based on petType"
```

---

### Task 7: 앱 이름 → 오늘의 멍냥운세

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: layout.tsx 이름 변경**

`src/app/layout.tsx`에서 다음을 변경한다.

변경 전:
```ts
export const metadata: Metadata = {
  title: '오늘의 멍운세',
  description: '우리 강아지 오늘의 운세를 확인해보세요!',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: '오늘의 멍운세',
    description: '우리 강아지 오늘의 운세를 확인해보세요!',
    images: [{ url: '/logo.png', width: 600, height: 600 }],
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary',
    title: '오늘의 멍운세',
    description: '우리 강아지 오늘의 운세를 확인해보세요!',
    images: ['/logo.png'],
  },
}
```

변경 후:
```ts
export const metadata: Metadata = {
  title: '오늘의 멍냥운세',
  description: '우리 강아지, 고양이 오늘의 운세를 확인해보세요!',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: '오늘의 멍냥운세',
    description: '우리 강아지, 고양이 오늘의 운세를 확인해보세요!',
    images: [{ url: '/logo.png', width: 600, height: 600 }],
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary',
    title: '오늘의 멍냥운세',
    description: '우리 강아지, 고양이 오늘의 운세를 확인해보세요!',
    images: ['/logo.png'],
  },
}
```

- [ ] **Step 2: page.tsx 이름 변경**

`src/app/page.tsx`에서 다음을 변경한다.

변경 전:
```tsx
          <h1 className="text-3xl font-black text-violet-700">오늘의 멍운세</h1>
          <p className="mt-2 text-sm text-violet-400">반려동물의 오늘 기분을 알아보세요!</p>
```

변경 후:
```tsx
          <h1 className="text-3xl font-black text-violet-700">오늘의 멍냥운세</h1>
          <p className="mt-2 text-sm text-violet-400">강아지와 고양이의 오늘 기분을 알아보세요!</p>
```

- [ ] **Step 3: 전체 테스트 확인**

```bash
cd /Users/jun/Desktop/jun/pet && npx vitest run
```

Expected: 모든 테스트 PASS

- [ ] **Step 4: 커밋**

```bash
cd /Users/jun/Desktop/jun/pet && git add src/app/layout.tsx src/app/page.tsx && git commit -m "feat: rename app to 오늘의 멍냥운세"
```
