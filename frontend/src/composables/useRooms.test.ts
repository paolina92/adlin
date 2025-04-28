import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useRooms } from './useRooms'
import { useQuery } from '@tanstack/vue-query'
import { useReservationStore } from '@/stores/reservation'
import { ref } from 'vue'

// Mock dependencies
vi.mock('@tanstack/vue-query', () => ({
  useQuery: vi.fn(),
}))

vi.mock('@/stores/reservation', () => ({
  useReservationStore: vi.fn(),
}))

vi.mock('@/api/room', () => ({
  getRooms: vi.fn(),
}))

// Mock Pinia's storeToRefs
vi.mock('pinia', () => ({
  storeToRefs: (store: any) => ({
    quantity: ref(store.quantity),
    selectedEquipment: ref(store.selectedEquipment),
  }),
}))

describe('useRooms', () => {
  const mockRooms = [
    {
      id: 1,
      name: 'Salle A',
      capacity: 10,
      equipements: [{ name: 'Retro Projecteur' }],
    },
    {
      id: 2,
      name: 'Salle B',
      capacity: 5,
      equipements: [{ name: 'TV' }],
    },
  ]

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Mock useQuery
    ;(useQuery as any).mockReturnValue({
      data: { value: mockRooms },
      isLoading: { value: false },
      error: { value: null },
    })

    // Mock store
    ;(useReservationStore as any).mockReturnValue({
      quantity: 0,
      selectedEquipment: null,
    })
  })

  it('should return rooms data', () => {
    const { rooms, isLoading, error } = useRooms()

    expect(rooms.value).toEqual(mockRooms)
    expect(isLoading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('should filter rooms by capacity', () => {
    // Mock store with specific quantity
    ;(useReservationStore as any).mockReturnValue({
      quantity: 8,
      selectedEquipment: null,
    })

    const { filteredRooms } = useRooms()

    expect(filteredRooms.value).toHaveLength(1)
    expect(filteredRooms.value[0].name).toBe('Salle A')
  })

  it('should filter rooms by equipment', () => {
    // Mock store with specific equipment
    ;(useReservationStore as any).mockReturnValue({
      quantity: 0,
      selectedEquipment: 'Retro Projecteur',
    })

    const { filteredRooms } = useRooms()

    expect(filteredRooms.value).toHaveLength(1)
    expect(filteredRooms.value[0].name).toBe('Salle A')
  })

  it('should format rooms correctly', () => {
    const { formattedRooms } = useRooms()

    expect(formattedRooms.value).toEqual([
      { id: '1', label: 'Salle A (10p)' },
      { id: '2', label: 'Salle B (5p)' },
    ])
  })
})
