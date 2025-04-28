import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useReservations } from './useReservations'
import { useReservationStore } from '@/stores/reservation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { createReservation, deleteReservation, updateReservation } from '@/api/reservation'
import type { Reservation } from '@/types/reservation'

// Mock the dependencies
vi.mock('@tanstack/vue-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}))

vi.mock('@/stores/reservation', () => ({
  useReservationStore: vi.fn(),
}))

vi.mock('@/api/reservation', () => ({
  getReservations: vi.fn(),
  createReservation: vi.fn(),
  deleteReservation: vi.fn(),
  updateReservation: vi.fn(),
}))

describe('useReservations', () => {
  const mockStore = {
    selectedDate: new Date('2024-03-20'),
  }

  const mockReservations: Reservation[] = [
    {
      id: 1,
      roomId: 1,
      startDate: '2024-03-20T09:00:00Z',
      endDate: '2024-03-20T11:00:00Z',
    },
  ]

  const mockQueryClient = {
    invalidateQueries: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useReservationStore as any).mockReturnValue(mockStore)
    ;(useQueryClient as any).mockReturnValue(mockQueryClient)
    ;(useQuery as any).mockReturnValue({
      data: { value: mockReservations },
      isLoading: false,
      error: null,
    })
    ;(useMutation as any).mockImplementation(
      ({ mutationFn, onSuccess }: { mutationFn: Function; onSuccess: Function }) => ({
        mutateAsync: async (...args: unknown[]) => {
          const result = await mutationFn(...args)
          onSuccess()
          return result
        },
      })
    )
  })

  it('should initialize with correct state', () => {
    const { reservations, isLoading, error, currentGroups } = useReservations()

    expect(reservations.value).toEqual(mockReservations)
    expect(isLoading).toBe(false)
    expect(error).toBe(null)
    expect(currentGroups.value).toHaveLength(1)
  })

  it('should convert reservations to slots correctly', () => {
    const { slotsFor } = useReservations()
    const slots = slotsFor(mockReservations[0])

    expect(slots).toHaveLength(2)
    expect(slots[0]).toEqual({
      rowId: '1',
      columnId: '9:00',
      reservationId: 1,
    })
    expect(slots[1]).toEqual({
      rowId: '1',
      columnId: '10:00',
      reservationId: 1,
    })
  })

  it('should handle create reservation mutation', async () => {
    const { createReservationMutation } = useReservations()
    const newReservation = {
      roomId: 1,
      startDate: '2024-03-20T09:00:00Z',
      endDate: '2024-03-20T10:00:00Z',
    }

    await createReservationMutation(newReservation)

    expect(createReservation).toHaveBeenCalledWith(newReservation)
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['reservations'],
    })
  })

  it('should handle delete reservation mutation', async () => {
    const { deleteReservationMutation } = useReservations()

    await deleteReservationMutation({ reservationId: '1' })

    expect(deleteReservation).toHaveBeenCalledWith({ reservationId: '1' })
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['reservations'],
    })
  })

  it('should handle update reservation mutation', async () => {
    const { updateReservationMutation } = useReservations()
    const updateData = {
      reservationId: '1',
      startDate: '2024-03-20T10:00:00Z',
      endDate: '2024-03-20T12:00:00Z',
    }

    await updateReservationMutation(updateData)

    expect(updateReservation).toHaveBeenCalledWith(updateData)
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['reservations'],
    })
  })

  it('should update currentGroups when initialGroups changes', async () => {
    const { currentGroups } = useReservations()
    const newReservations: Reservation[] = [
      {
        id: 2,
        roomId: 2,
        startDate: '2024-03-20T13:00:00Z',
        endDate: '2024-03-20T14:00:00Z',
      },
    ]

    ;(useQuery as any).mockReturnValue({
      data: { value: newReservations },
      isLoading: false,
      error: null,
    })

    // Wait for the next tick to allow the watcher to update
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(currentGroups.value).toHaveLength(1)
  })

  it('should handle getReservations query with correct parameters', () => {
    useReservations()

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: expect.arrayContaining(['reservations']),
        staleTime: Infinity,
      })
    )
  })

  it('should handle getReservations error state', () => {
    const testError = new Error('Failed to fetch reservations')
    ;(useQuery as any).mockReturnValue({
      data: { value: null },
      isLoading: false,
      error: { value: testError },
    })

    const { error } = useReservations()
    expect(error.value).toEqual(testError)
  })

  it('should handle getReservations loading state', () => {
    ;(useQuery as any).mockReturnValue({
      data: { value: null },
      isLoading: true,
      error: null,
    })

    const { isLoading } = useReservations()
    expect(isLoading).toBe(true)
  })

  it('should handle empty reservations data', () => {
    ;(useQuery as any).mockReturnValue({
      data: { value: [] },
      isLoading: false,
      error: null,
    })

    const { reservations, currentGroups } = useReservations()
    expect(reservations.value).toEqual([])
    expect(currentGroups.value).toEqual([])
  })

  it('should convert reservation times to UTC hours correctly', () => {
    const { slotsFor } = useReservations()
    const reservation: Reservation = {
      id: 1,
      roomId: 1,
      startDate: '2024-03-20T09:30:00Z', // Test with minutes
      endDate: '2024-03-20T11:45:00Z', // Test with minutes
    }

    const slots = slotsFor(reservation)
    expect(slots).toHaveLength(2) // 9:00-10:00, 10:00-11:00
    expect(slots.map(s => s.columnId)).toEqual(['9:00', '10:00'])
  })

  it('should handle multiple reservations in the same time slot', () => {
    const multipleReservations: Reservation[] = [
      {
        id: 1,
        roomId: 1,
        startDate: '2024-03-20T09:00:00Z',
        endDate: '2024-03-20T10:00:00Z',
      },
      {
        id: 2,
        roomId: 2,
        startDate: '2024-03-20T09:00:00Z',
        endDate: '2024-03-20T10:00:00Z',
      },
    ]

    ;(useQuery as any).mockReturnValue({
      data: { value: multipleReservations },
      isLoading: false,
      error: null,
    })

    const { currentGroups } = useReservations()
    expect(currentGroups.value).toHaveLength(2)
    expect(currentGroups.value[0][0].rowId).toBe('1')
    expect(currentGroups.value[1][0].rowId).toBe('2')
  })
})
