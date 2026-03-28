# 정적 데이터 확충 설계

**날짜:** 2026-03-28
**대상 파일:** `src/lib/messages.ts`, `src/lib/fortune.ts`

## 목표

반복 체감을 줄이고 강아지 전용 콘텐츠로 통일한다.

## 변경 범위

### 1. MESSAGES: 20 → 100개

- 기존 톤 유지: 반려동물 시점 또는 운세 어투, 귀엽고 가벼운 문체
- 강아지 일상 테마: 간식, 산책, 낮잠, 장난감, 애교, 목욕, 냄새 맡기 등
- 구조 변경 없음 (`string[]`)

### 2. LUCKY_ITEMS: 10 → 50개

- 캣닢 장난감 제거 (고양이 전용 아이템)
- 강아지 전용 아이템으로 50개 채움: 간식 종류, 장난감, 산책 코스, 활동, 케어 등
- 구조 변경 없음 (`{ name: string, emoji: string }[]`)

### 3. MOODS[n].reason: 기분당 1개 → 3개

- `reason: string` → `reasons: string[]` (배열로 타입 변경)
- `fortune.ts`에서 선택 로직 추가:
  ```ts
  const reasonIdx = Math.abs(hash(petName + today.getDate())) % mood.reasons.length
  moodReason: mood.reasons[reasonIdx]
  ```
- 각 기분 톤에 맞는 3가지 변형 문장 작성

## 변경 파일 요약

| 파일 | 변경 내용 |
|------|-----------|
| `src/lib/messages.ts` | MESSAGES 100개, LUCKY_ITEMS 50개, MOODS.reason → reasons 배열 |
| `src/lib/fortune.ts` | moodReason 선택 로직 1줄 수정 |

## 비고

- 계절/날씨 기반 메시지 분기는 향후 과제로 남김
- 선택 로직(hash 기반)은 기존 방식과 동일하게 결정론적으로 유지
