import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Room, Equipment } from './rooms.types';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async findAll(capacity?: number, equipment?: Equipment): Promise<Room[]> {
    const rooms = await this.prisma.room.findMany({
      include: {
        equipements: true,
      },
    });

    return rooms.filter((room) => {
      const capacityOk = capacity ? room.capacity >= capacity : true;
      const equipmentOk = equipment
        ? room.equipements.some((e) =>
            e.name.toLowerCase().includes(equipment.toLowerCase()),
          )
        : true;

      return capacityOk && equipmentOk;
    });
  }
}
