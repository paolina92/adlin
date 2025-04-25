export const EQUIPMENTS = ['TV', 'Retro Projecteur'] as const;
export type Equipment = (typeof EQUIPMENTS)[number];

export interface Room {
  id: number;
  name: string;
  description: string;
  capacity: number;
  equipements: { name: string }[];
  createdAt: Date;
  updatedAt: Date;
}
