import { Room } from './room.interface';

export interface Equipement {
  id: number;
  name: string;
  roomId: number;
  room?: Room;
}
