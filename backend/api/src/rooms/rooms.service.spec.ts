import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';
import { PrismaService } from '../prisma/prisma.service';

describe('RoomsService', () => {
  let service: RoomsService;

  const mockRooms = [
    {
      id: 1,
      name: 'Salle 1',
      capacity: 5,
      equipements: [{ name: 'TV' }, { name: 'Retro Projecteur' }],
    },
    {
      id: 2,
      name: 'Salle 2',
      capacity: 10,
      equipements: [{ name: 'Retro Projecteur' }],
    },
    {
      id: 3,
      name: 'Salle 3',
      capacity: 15,
      equipements: [],
    },
  ];

  const prismaMock = {
    room: {
      findMany: jest.fn().mockResolvedValue(mockRooms),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
  });

  it('should return all rooms with no filters', async () => {
    const result = await service.findAll();
    expect(result.length).toBe(3);
  });

  it('should filter rooms by capacity', async () => {
    const result = await service.findAll(10);
    expect(result.length).toBe(2); // Salle 2 & 3
  });

  it('should filter rooms by equipment', async () => {
    const result = await service.findAll(undefined, 'TV');
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Salle 1');
  });

  it('should filter rooms by capacity AND equipment', async () => {
    const result = await service.findAll(10, 'Retro Projecteur');
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Salle 2');
  });
});
