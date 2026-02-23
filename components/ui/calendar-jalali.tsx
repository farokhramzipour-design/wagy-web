"use client"

import {
  getYear,
  getMonth,
  setYear,
  setMonth,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns-jalali"
import { faIR } from "date-fns-jalali/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import * as React from "react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type CalendarJalaliProps = {
  mode?: "single"
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  className?: string
  classNames?: Record<string, string>
  defaultMonth?: Date
  disabled?: (date: Date) => boolean
  fromYear?: number
  toYear?: number
}

function CalendarJalali({
  mode = "single",
  selected,
  onSelect,
  className,
  classNames,
  defaultMonth,
  disabled,
  fromYear,
  toYear,
}: CalendarJalaliProps) {
  const [currentMonth, setCurrentMonth] = React.useState(
    defaultMonth || selected || new Date()
  )

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1))
  }

  const handleMonthChange = (value: string) => {
    const month = parseInt(value)
    setCurrentMonth((prev) => setMonth(prev, month))
  }

  const handleYearChange = (value: string) => {
    const year = parseInt(value)
    setCurrentMonth((prev) => setYear(prev, year))
  }

  const handleDayClick = (day: Date) => {
    if (disabled?.(day)) return
    if (onSelect) {
      onSelect(day)
    }
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { locale: faIR })
  const endDate = endOfWeek(monthEnd, { locale: faIR })

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  })

  // Group days into weeks
  const weeks: Date[][] = []
  let week: Date[] = []
  calendarDays.forEach((day) => {
    week.push(day)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  })
  if (week.length > 0) {
    weeks.push(week)
  }

  const weekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"]
  
  // Jalali months
  const months = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
  ]

  // Generate years range
  const currentYearJalali = getYear(new Date())
  const startYear = fromYear ? getYear(new Date(fromYear, 0, 1)) : currentYearJalali - 100
  const endYear = toYear ? getYear(new Date(toYear, 0, 1)) : currentYearJalali + 10
  
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)
  
  // Current selections for dropdowns
  const selectedMonth = getMonth(currentMonth)
  const selectedYear = getYear(currentMonth)

  return (
    <div className={cn("p-3", className)}>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0">
        <div className="space-y-4 w-full">
          <div className="flex justify-between pt-1 relative items-center px-1">
            <div className="flex items-center gap-1">
               {/* Month Select */}
              <Select
                value={selectedMonth.toString()}
                onValueChange={handleMonthChange}
              >
                <SelectTrigger className="h-7 w-[100px] text-xs font-medium">
                  <SelectValue>{months[selectedMonth]}</SelectValue>
                </SelectTrigger>
                <SelectContent position="popper" className="max-h-[200px]">
                  {months.map((month, index) => (
                    <SelectItem key={index} value={index.toString()} className="text-xs">
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Year Select */}
              <Select
                value={selectedYear.toString()}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className="h-7 w-[70px] text-xs font-medium">
                  <SelectValue>{selectedYear}</SelectValue>
                </SelectTrigger>
                <SelectContent position="popper" className="max-h-[200px]">
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()} className="text-xs">
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-1 space-x-reverse">
              <button
                onClick={handlePreviousMonth}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                )}
                type="button"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                )}
                type="button"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          </div>
          <table className="w-full border-collapse space-y-1">
            <thead>
              <tr className="flex">
                {weekDays.map((day, i) => (
                  <th
                    key={i}
                    className="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="mt-2 block">
              {weeks.map((week, i) => (
                <tr key={i} className="flex w-full mt-2">
                  {week.map((day, j) => {
                    const isSelected = selected && isSameDay(day, selected)
                    const isTodayDate = isToday(day)
                    const isOutside = !isSameMonth(day, currentMonth)

                    return (
                      <td
                        key={j}
                        className={cn(
                          "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                          isSelected ? "bg-primary text-primary-foreground rounded-md" : "",
                          !isSelected && isTodayDate ? "bg-accent text-accent-foreground rounded-md" : "",
                          !isSelected && !isTodayDate && isOutside ? "text-muted-foreground opacity-50" : ""
                        )}
                      >
                        <button
                          onClick={() => handleDayClick(day)}
                          disabled={disabled?.(day)}
                          className={cn(
                            buttonVariants({ variant: "ghost" }),
                            "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                            isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                            !isSelected && isTodayDate && "bg-accent text-accent-foreground",
                            !isSelected && !isTodayDate && isOutside && "text-muted-foreground opacity-50"
                          )}
                          type="button"
                        >
                          {format(day, "d", { locale: faIR })}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export { CalendarJalali }
