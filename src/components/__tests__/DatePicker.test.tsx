import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import DatePicker from '../DatePicker'

// Popover uses portal rendering — mock for jsdom
jest.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PopoverTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PopoverContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// Calendar mock — only test date selection behavior
jest.mock('@/components/ui/calendar', () => ({
  Calendar: ({ onSelect }: { onSelect: (d: Date) => void; disabled: (d: Date) => boolean }) => (
    <button
      data-testid="calendar-select"
      onClick={() => onSelect(new Date(2023, 4, 15))}
    >
      select
    </button>
  ),
}))

describe('DatePicker', () => {
  it('renders placeholder when no date selected', () => {
    render(<DatePicker value="" onChange={() => {}} max="2026-03-27" />)
    expect(screen.getByText('생년월일을 선택하세요')).toBeInTheDocument()
  })

  it('renders selected date as YYYY.MM.DD', () => {
    render(<DatePicker value="2023-05-15" onChange={() => {}} max="2026-03-27" />)
    expect(screen.getByText('2023.05.15')).toBeInTheDocument()
  })

  it('calls onChange with YYYY-MM-DD string when calendar selects a date', () => {
    const onChange = jest.fn()
    render(<DatePicker value="" onChange={onChange} max="2026-03-27" />)
    fireEvent.click(screen.getByTestId('calendar-select'))
    expect(onChange).toHaveBeenCalledWith('2023-05-15')
  })
})
