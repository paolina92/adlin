import type { TimeColumn, Slot } from '@/types/slotGrid'
import { monthNames } from '@/constants/date'
import { CalendarDate } from '@internationalized/date'
import type { UseTimeMessageReturn } from '@/types/slotGrid'

/**
 * Composable for generating time messages.
 *
 * @returns {UseTimeMessageReturn} The time message functions.
 */
export const useTimeMessage = (): UseTimeMessageReturn => {
  const getColumns = (slots: Slot[], columns: TimeColumn[]) => {
    if (slots.length === 0) return { startColumn: undefined, endColumn: undefined }

    const startColumn = columns.find(col => col.id === slots[0].columnId)
    const endColumn = columns.find(col => col.id === slots[slots.length - 1].columnId)

    return { startColumn, endColumn }
  }

  const getEndTime = (endColumn: TimeColumn) => {
    const currentHour = parseInt(endColumn.id.split(':')[0])
    const nextHour = currentHour + 1
    return `${nextHour}:00`
  }

  const getCreateMessage = (
    startColumn: TimeColumn,
    endTime: string | undefined,
    selectedDate: CalendarDate
  ) => {
    const month = selectedDate.month
    const day = selectedDate.day
    const year = selectedDate.year
    return `Create a reservation on ${monthNames[month - 1]} ${day}, ${year} from ${startColumn.label} to ${endTime}?`
  }

  const getMoveMessage = (startColumn: TimeColumn, endTime: string | undefined) => {
    return `Move reservation to ${startColumn.label} - ${endTime}?`
  }

  const getMessage = (
    slots: Slot[],
    columns: TimeColumn[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getMessageFn: (startColumn: TimeColumn, endTime: string | undefined, ...args: any[]) => string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) => {
    const { startColumn, endColumn } = getColumns(slots, columns)
    if (!startColumn || !endColumn) return ''

    const endTime = getEndTime(endColumn)
    return getMessageFn(startColumn, endTime, ...args)
  }

  return {
    getColumns,
    getEndTime,
    getCreateMessage,
    getMoveMessage,
    getMessage,
  }
}
