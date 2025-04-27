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

  it('should return all rooms', async () => {
    const result = await service.findAll();
    expect(result.length).toBe(3);
    expect(result).toEqual(mockRooms);
  });
});
