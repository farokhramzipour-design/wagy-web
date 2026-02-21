"use client"

import {
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

export type CalendarJalaliProps = {
  mode?: "single"
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  className?: string
  classNames?: Record<string, string>
  defaultMonth?: Date
  disabled?: (date: Date) => boolean
}

function CalendarJalali({
  mode = "single",
  selected,
  onSelect,
  className,
  classNames,
  defaultMonth,
  disabled,
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

  return (
    <div className={cn("p-3", className)}>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0">
        <div className="space-y-4 w-full">
          <div className="flex justify-center pt-1 relative items-center">
            <div className="text-sm font-medium">
              {format(currentMonth, "MMMM yyyy", { locale: faIR })}
            </div>
            <button
              onClick={handlePreviousMonth}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
              )}
              type="button"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
              )}
              type="button"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
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
