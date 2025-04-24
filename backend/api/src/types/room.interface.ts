import { Equipement } from './equipement.interface';
import { Reservation } from './reservation.interface';

export interface Room {
  id: number;
  name: string;
  description: string;
  capacity: number;
  createdAt: string;
  updatedAt: string;
  reservations?: Reservation[];
  equipements?: Equipement[];
}
