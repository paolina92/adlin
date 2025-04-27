import { ApiService } from '@/services/apiService'
import type { Room } from '@/types/interfaces'

export const getRooms = async ({
  capacity,
  equipment,
}: {
  capacity?: number
  equipment?: string
}): Promise<Room[]> => {
  try {
    const searchParams = new URLSearchParams()

    if (capacity) {
      searchParams.append('capacity', capacity.toString())
    }
    if (equipment) {
      searchParams.append('equipment', equipment)
    }

    const queryString = searchParams.toString()
    const url = `rooms${queryString ? `?${queryString}` : ''}`

    return await ApiService.get(url)
  } catch (error) {
    console.error(error)
    throw error
  }
}
