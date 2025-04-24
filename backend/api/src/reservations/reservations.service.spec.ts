import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { PrismaService } from '../prisma/prisma.service';

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
    const data = {
      roomId: 1,
      startDate: '2025-05-01T10:00:00Z',
      endDate: '2025-05-01T12:00:00Z',
    };

    prismaMock.reservation.findFirst.mockResolvedValue(null); // aucun conflit
    prismaMock.reservation.create.mockResolvedValue({
      id: 1,
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    });

    const result = await service.create(data);

    expect(prismaMock.reservation.findFirst).toHaveBeenCalledWith({
      where: {
        roomId: data.roomId,
        OR: [
          {
            startDate: { lt: new Date(data.endDate) },
            endDate: { gt: new Date(data.startDate) },
          },
        ],
      },
    });

    expect(prismaMock.reservation.create).toHaveBeenCalledWith({
      data: {
        roomId: data.roomId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
    });

    expect(result).toMatchObject({
      id: 1,
      roomId: 1,
    });
  });

  it('should throw if the room is already booked on that time slot', async () => {
    const data = {
      roomId: 1,
      startDate: '2025-05-01T10:00:00Z',
      endDate: '2025-05-01T12:00:00Z',
    };

    prismaMock.reservation.findFirst.mockResolvedValue({ id: 99 }); // conflit trouvé

    await expect(service.create(data)).rejects.toThrow(
      'This room is already booked for this time slot.',
    );
  });
});
