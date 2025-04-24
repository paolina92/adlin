import { Room } from './room.interface';

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
  roomId?: number;
  startDate?: Date;
  endDate?: Date;
}
