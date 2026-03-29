# shadcn Input & DatePicker 교체 설계

## 목표

`PetForm`의 이름 input과 생년월일 input을 shadcn/ui 컴포넌트로 교체해 높이/너비 불일치 문제를 해결한다.

## 스택 환경

- Next.js 16.2.1, React 19, Tailwind CSS v4
- shadcn/ui (Tailwind v4 모드로 초기화)

## 컴포넌트 교체 계획

| 필드 | 기존 | 교체 |
|------|------|------|
| 이름 | `<input type="text">` | shadcn `Input` |
| 생년월일 | `<input type="date">` | shadcn `Popover` + `Calendar` |

## DatePicker 동작

- 트리거: 선택된 날짜를 표시하는 버튼 (미선택 시 placeholder 텍스트)
- 클릭 시 `Popover`로 `Calendar` 팝업
- 날짜 선택 시 팝업 닫힘, `birthday` state 업데이트
- `max` 제한: 오늘 이전 날짜만 선택 가능 (`disabled` prop)

## 스타일

- 두 컴포넌트 모두 `w-full`, 동일한 높이
- 기존 핑크/퍼플 테마 유지 (shadcn CSS 변수를 `globals.css`에서 오버라이드)

## 설치 단계

1. `npx shadcn@latest init` (Tailwind v4, src 디렉토리 사용)
2. `npx shadcn@latest add input button calendar popover`
3. `PetForm.tsx` 수정
