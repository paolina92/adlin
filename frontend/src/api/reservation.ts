import { ApiService } from '@/services/apiService'
import type { Reservation } from '@/types/interfaces'

export const getReservations = async ({
  startDate,
  endDate,
}: {
  startDate: string
  endDate: string
}): Promise<Reservation[]> => {
  try {
    return await ApiService.get(`reservations?startDate=${startDate}&endDate=${endDate}`)
  } catch (error) {
    console.error(error)
    throw error
  }
}
