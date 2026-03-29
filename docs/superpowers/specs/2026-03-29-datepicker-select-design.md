# DatePicker → Select 드롭다운 교체 설계

## 목표

달력 팝오버 방식의 DatePicker를 연도/월/일 세 개의 `<select>` 드롭다운으로 교체한다.
모바일에서 더 빠르고 편하게 날짜를 선택할 수 있도록 한다.

## 변경 파일

| 파일 | 변경 내용 |
|------|----------|
| `src/components/DatePicker.tsx` | 전체 교체 — calendar/popover 제거, 세 select로 대체 |

PetForm.tsx, 기타 파일 수정 없음. 인터페이스 동일하게 유지.

## 인터페이스 (불변)

```ts
interface DatePickerProps {
  value: string         // YYYY-MM-DD 또는 '' (미선택)
  onChange: (val: string) => void
  max: string           // YYYY-MM-DD (이 날짜 이후 선택 불가)
  className?: string
}
```

## UI 레이아웃

세 select를 가로로 배치:

```
[ 2020년 ▾ ]  [ 5월 ▾ ]  [ 15일 ▾ ]
```

- 연도 select: flex-none 또는 flex 비율 조정
- 세 select 사이 간격: `gap-2`
- 컨테이너: `flex w-full gap-2`

## 연도 옵션

- 범위: 2000년 ~ max의 연도 (포함)
- 정렬: 내림차순 (최근 연도가 위)
- placeholder: `연도` (value="")

## 월 옵션

- 범위: 1월 ~ 12월
- 연도 미선택 시: disabled (select 전체 비활성)
- max 제약: 선택된 연도 === max의 연도이면 max의 월 초과 옵션 disabled
- placeholder: `월` (value="")

## 일 옵션

- 범위: 1일 ~ 해당 월의 마지막 날 (윤년 자동 처리)
  - `new Date(year, month, 0).getDate()` 로 계산
- 월 미선택 시: disabled
- max 제약: 선택된 연도/월 === max의 연도/월이면 max의 일 초과 옵션 disabled
- placeholder: `일` (value="")

## 연도/월 변경 시 하위 select 리셋

- 연도 변경 시: 선택된 월이 새 연도의 max 제약을 초과하면 월과 일을 리셋
- 월 변경 시: 선택된 일이 새 월의 마지막 날을 초과하면 일을 리셋
  (예: 3월 31일 선택 후 4월로 변경 → 일 리셋)

## onChange 호출 조건

연도, 월, 일 세 가지 모두 선택된 경우에만 `onChange("YYYY-MM-DD")` 호출.
하나라도 미선택이면 호출하지 않음.

## value prop 파싱 (초기값 처리)

```ts
const [year, month, day] = value ? value.split('-').map(Number) : ['', '', '']
```

value가 있으면 각 select의 초기값으로 설정.
value가 ''이면 세 select 모두 placeholder 상태.

## 스타일

기존 폼 스타일과 일치:

```tsx
// 각 select 공통 className
'rounded-2xl border-2 border-violet-200 bg-white px-3 py-3 text-lg font-normal
 text-gray-800 focus:border-violet-400 focus:outline-none transition-colors
 appearance-none cursor-pointer'

// placeholder (미선택) 상태
value === '' → text-gray-300 class 추가
```

연도 select: `flex-[2]`
월/일 select: `flex-1` 각각

## 제거되는 의존성 (DatePicker.tsx 한정)

- `date-fns` (format 함수)
- `lucide-react` (CalendarIcon)
- `@/components/ui/popover`
- `@/components/ui/calendar`
- `useRef`, `useState` (popoverWidth 관련)

## 테스트

`src/components/__tests__/DatePicker.test.tsx` 업데이트:
- 기존 calendar 관련 테스트 제거
- 새 테스트: 연도/월/일 select 렌더링 확인
- 새 테스트: 세 select 모두 선택 시 onChange 호출
- 새 테스트: max 제약 (max 초과 옵션 disabled)
- 새 테스트: value prop으로 초기값 설정 확인
