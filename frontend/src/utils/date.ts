import { CalendarDate, type AnyCalendarDate } from '@internationalized/date'

export const toISODate = (date: AnyCalendarDate, hour: number): string => {
  const jsDate = new Date(date.year, date.month - 1, date.day, hour, 0, 0)
  return jsDate.toLocaleString('sv', { timeZone: 'Europe/Paris' }).replace(' ', 'T')
}

export const fromISODate = (isoDate: string): { date: CalendarDate; hour: number } => {
  const date = new Date(isoDate)
  return {
    date: new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate()),
    hour: date.getHours(),
  }
}

export const getStartOfDay = (date: AnyCalendarDate): string => {
  return toISODate(date, 0)
}

export const getEndOfDay = (date: AnyCalendarDate): string => {
  return toISODate(date, 23)
}
