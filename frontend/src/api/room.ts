import { ApiService } from '@/services/apiService'
import type { Room } from '@/types/interfaces'

export const getRoom = async (): Promise<Room[]> => {
  try {
    return await ApiService.get('rooms')
  } catch (error) {
    console.error(error)
    throw error
  }
}
