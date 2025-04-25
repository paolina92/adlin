import { Room } from '../rooms/rooms.types';

export interface Reservation {
  id: number;
  roomId: number;
  startDate: Date;
  endDate: Date;
  room?: Room;
}

export interface CreateReservationDto {
  roomId: number;
  startDate: Date;
  endDate: Date;
}

export interface UpdateReservationDto {
  startDate: Date;
  endDate: Date;
}
