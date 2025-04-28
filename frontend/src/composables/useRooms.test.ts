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
    search: ref(store.search),
  }),
}))

describe('useRooms', () => {
  const mockRooms = [
    {
      id: 1,
      name: 'Salle de réunion A',
      capacity: 10,
      equipements: [{ name: 'Retro Projecteur' }],
    },
    {
      id: 2,
      name: 'Salle de conférence B',
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
      search: '',
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
      search: '',
    })

    const { filteredRooms } = useRooms()

    expect(filteredRooms.value).toHaveLength(1)
    expect(filteredRooms.value[0].name).toBe('Salle de réunion A')
  })

  it('should filter rooms by equipment', () => {
    // Mock store with specific equipment
    ;(useReservationStore as any).mockReturnValue({
      quantity: 0,
      selectedEquipment: 'Retro Projecteur',
      search: '',
    })

    const { filteredRooms } = useRooms()

    expect(filteredRooms.value).toHaveLength(1)
    expect(filteredRooms.value[0].name).toBe('Salle de réunion A')
  })

  it('should filter rooms by search term', () => {
    // Mock store with search term
    ;(useReservationStore as any).mockReturnValue({
      quantity: 0,
      selectedEquipment: null,
      search: 'réunion',
    })

    const { filteredRooms } = useRooms()

    expect(filteredRooms.value).toHaveLength(1)
    expect(filteredRooms.value[0].name).toBe('Salle de réunion A')
  })

  it('should filter rooms by multiple search terms', () => {
    // Mock store with multiple search terms
    ;(useReservationStore as any).mockReturnValue({
      quantity: 0,
      selectedEquipment: null,
      search: 'salle conférence',
    })

    const { filteredRooms } = useRooms()

    expect(filteredRooms.value).toHaveLength(1)
    expect(filteredRooms.value[0].name).toBe('Salle de conférence B')
  })

  it('should format rooms correctly', () => {
    const { formattedRooms } = useRooms()

    expect(formattedRooms.value).toEqual([
      { id: '1', label: 'Salle de réunion A (10p)' },
      { id: '2', label: 'Salle de conférence B (5p)' },
    ])
  })
})
