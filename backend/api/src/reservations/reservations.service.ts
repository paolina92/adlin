import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateReservationDto,
  UpdateReservationDto,
} from '../types/reservation.interface';

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

  async create(data: CreateReservationDto) {
    const { roomId, startDate, endDate } = data;

    if (new Date(startDate) >= new Date(endDate)) {
      throw new BadRequestException('End date must be after start date');
    }

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

  async update(id: number, data: UpdateReservationDto) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new BadRequestException('Reservation not found');
    }

    if (
      data.startDate &&
      data.endDate &&
      new Date(data.startDate) >= new Date(data.endDate)
    ) {
      throw new BadRequestException('End date must be after start date');
    }

    const { roomId } = reservation;

    const conflict = await this.prisma.reservation.findFirst({
      where: {
        roomId,
        id: { not: id },
        startDate: { lt: new Date(data.endDate || reservation.endDate) },
        endDate: { gt: new Date(data.startDate || reservation.startDate) },
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
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        roomId: data.roomId,
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
