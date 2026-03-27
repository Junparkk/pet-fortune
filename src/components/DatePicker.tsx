'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start rounded-2xl border-2 border-pink-200 bg-white px-4 py-3 text-lg font-normal text-left h-auto',
            'hover:bg-white hover:border-pink-400 focus:border-pink-400 focus-visible:ring-0 focus-visible:ring-offset-0',
            !value && 'text-gray-300',
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-5 w-5 text-pink-300 shrink-0" />
          {value
            ? format(selected!, 'yyyy.MM.dd')
            : '생년월일을 선택하세요'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          disabled={(date) => date > maxDate}
          captionLayout="dropdown"
          startMonth={new Date(2000, 0)}
          endMonth={maxDate}
        />
      </PopoverContent>
    </Popover>
  )
}
