'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  value: string
  onChange: (val: string) => void
  max: string
  className?: string
}

export default function DatePicker({ value, onChange, max, className }: DatePickerProps) {
  const [open, setOpen] = useState(false)

  const selected = value ? new Date(value + 'T00:00:00') : undefined
  const maxDate = new Date(max + 'T00:00:00')

  function handleSelect(date: Date | undefined) {
    if (!date) return
    const pad = (n: number) => String(n).padStart(2, '0')
    const str = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    onChange(str)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <PopoverTrigger
        className={cn(
          'flex w-full cursor-pointer items-center justify-start rounded-2xl border-2 border-violet-200 bg-white px-4 py-3 text-left text-lg font-normal',
          'transition-colors hover:border-violet-400 focus:border-violet-400 focus-visible:outline-none',
          !value && 'text-gray-300',
          className,
        )}
      >
        <CalendarIcon className="mr-2 h-5 w-5 shrink-0 text-pink-300" />
        {value ? format(selected!, 'yyyy.MM.dd') : '생년월일을 선택하세요'}
      </PopoverTrigger>
      <PopoverContent className="w-(--anchor-width) p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          disabled={(date) => date > maxDate}
          captionLayout="dropdown"
          startMonth={new Date(2000, 0)}
          endMonth={maxDate}
          classNames={{ root: 'w-full rdp-root' }}
        />
      </PopoverContent>
    </Popover>
  )
}
