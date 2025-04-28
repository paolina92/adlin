import { describe, it, expect } from 'vitest'
import { useTimeMessage } from './useTimeMessage'
import type { TimeColumn, Slot } from '@/types/slotGrid'
import { CalendarDate } from '@internationalized/date'

describe('useTimeMessage', () => {
  const mockColumns: TimeColumn[] = [
    { id: '9:00', label: '9:00' },
    { id: '10:00', label: '10:00' },
  ]

  const mockSlots: Slot[] = [
    { columnId: '9:00', rowId: '1' },
    { columnId: '10:00', rowId: '1' },
  ]

  it('should get correct columns from slots', () => {
    const { getColumns } = useTimeMessage()
    const result = getColumns(mockSlots, mockColumns)
    expect(result.startColumn).toEqual(mockColumns[0])
    expect(result.endColumn).toEqual(mockColumns[1])
  })

  it('should get correct end time', () => {
    const { getEndTime } = useTimeMessage()
    const result = getEndTime(mockColumns[1])

    expect(result).toBe('11:00')
  })

  it('should generate correct create message', () => {
    const { getCreateMessage } = useTimeMessage()
    const date = new CalendarDate(2024, 3, 15)
    const result = getCreateMessage(mockColumns[0], '11:00', date)

    expect(result).toBe('Create a reservation on March 15, 2024 from 9:00 to 11:00?')
  })

  it('should generate correct move message', () => {
    const { getMoveMessage } = useTimeMessage()
    const result = getMoveMessage(mockColumns[0], '11:00')

    expect(result).toBe('Move reservation to 9:00 - 11:00?')
  })

  it('should handle empty slots', () => {
    const { getMessage } = useTimeMessage()
    const result = getMessage([], mockColumns, () => 'test')

    expect(result).toBe('')
  })
})
