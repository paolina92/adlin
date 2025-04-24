import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateReservationDto,
  UpdateReservationDto,
} from '../types/reservation.interface';

describe('ReservationsService', () => {
  let service: ReservationsService;

  const prismaMock = {
    reservation: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a reservation when no conflict exists', async () => {
    const data: CreateReservationDto = {
      roomId: 1,
      startDate: new Date('2025-05-01T10:00:00Z'),
      endDate: new Date('2025-05-01T12:00:00Z'),
    };

    prismaMock.reservation.findFirst.mockResolvedValue(null); // aucun conflit
    prismaMock.reservation.create.mockResolvedValue({
      id: 1,
      ...data,
    });

    const result = await service.create(data);

    expect(prismaMock.reservation.findFirst).toHaveBeenCalledWith({
      where: {
        roomId: data.roomId,
        OR: [
          {
            startDate: { lt: data.endDate },
            endDate: { gt: data.startDate },
          },
        ],
      },
    });

    expect(prismaMock.reservation.create).toHaveBeenCalledWith({
      data: {
        roomId: data.roomId,
        startDate: data.startDate,
        endDate: data.endDate,
      },
    });

    expect(result).toMatchObject({
      id: 1,
      roomId: 1,
    });
  });

  it('should throw if the room is already booked on that time slot', async () => {
    const data: CreateReservationDto = {
      roomId: 1,
      startDate: new Date('2025-05-01T10:00:00Z'),
      endDate: new Date('2025-05-01T12:00:00Z'),
    };

    prismaMock.reservation.findFirst.mockResolvedValue({ id: 99 }); // conflit trouvé

    await expect(service.create(data)).rejects.toThrow(
      'This room is already booked for this time slot.',
    );
  });

  it('should throw if end date is before start date', async () => {
    const data: CreateReservationDto = {
      roomId: 1,
      startDate: new Date('2025-05-01T12:00:00Z'),
      endDate: new Date('2025-05-01T10:00:00Z'),
    };

    await expect(service.create(data)).rejects.toThrow(
      'End date must be after start date',
    );
  });

  it('should update a reservation successfully', async () => {
    const existingReservation = {
      id: 1,
      roomId: 1,
      startDate: new Date('2025-05-01T10:00:00Z'),
      endDate: new Date('2025-05-01T12:00:00Z'),
    };

    const updateData: UpdateReservationDto = {
      startDate: new Date('2025-05-02T10:00:00Z'),
      endDate: new Date('2025-05-02T12:00:00Z'),
    };

    prismaMock.reservation.findUnique.mockResolvedValue(existingReservation);
    prismaMock.reservation.findFirst.mockResolvedValue(null);
    prismaMock.reservation.update.mockResolvedValue({
      ...existingReservation,
      ...updateData,
    });

    const result = await service.update(1, updateData);

    expect(result).toMatchObject({
      id: 1,
      ...updateData,
    });
  });
});
