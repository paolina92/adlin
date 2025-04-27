import { ApiService } from '@/services/apiService'
import type { Reservation } from '@/types/reservation'

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

export const createReservation = async ({
  startDate,
  endDate,
  roomId,
}: {
  startDate: string
  endDate: string
  roomId: number
}): Promise<Reservation> => {
  try {
    return await ApiService.post('reservations', { startDate, endDate, roomId })
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const deleteReservation = async ({
  reservationId,
}: {
  reservationId: string
}): Promise<void> => {
  try {
    await ApiService.delete(`reservations/${reservationId}`)
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const updateReservation = async ({
  reservationId,
  startDate,
  endDate,
}: {
  reservationId: string
  startDate: string
  endDate: string
}): Promise<void> => {
  try {
    await ApiService.put(`reservations/${reservationId}`, { startDate, endDate })
  } catch (error) {
    console.error(error)
    throw error
  }
}
