import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(startDate: string, endDate: string) {
    return this.prisma.reservation.findMany({
      where: {
        startDate: { gte: new Date(startDate) },
        endDate: { lte: new Date(endDate) },
      },
      include: {
        room: {
          include: { equipements: true },
        },
      },
    });
  }

  async create(data: { roomId: number; startDate: string; endDate: string }) {
    const { roomId, startDate, endDate } = data;

    try {
      const overlap = await this.prisma.reservation.findFirst({
        where: {
          roomId,
          OR: [
            {
              startDate: { lt: new Date(endDate) },
              endDate: { gt: new Date(startDate) },
            },
          ],
        },
      });

      if (overlap) {
        throw new BadRequestException(
          'This room is already booked for this time slot.',
        );
      }

      return this.prisma.reservation.create({
        data: {
          roomId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message || 'Server error');
    }
  }

  async update(id: number, data: { startDate: string; endDate: string }) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new BadRequestException('Reservation not found');
    }

    const { roomId } = reservation;

    const conflict = await this.prisma.reservation.findFirst({
      where: {
        roomId,
        id: { not: id },
        startDate: { lt: new Date(data.endDate) },
        endDate: { gt: new Date(data.startDate) },
      },
    });

    if (conflict) {
      throw new BadRequestException(
        'A reservation conflict exists for this time slot',
      );
    }

    return this.prisma.reservation.update({
      where: { id },
      data: {
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new BadRequestException('Reservation not found');
    }

    return this.prisma.reservation.delete({ where: { id } });
  }
}
