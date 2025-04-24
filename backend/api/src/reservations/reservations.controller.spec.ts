import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

describe('ReservationsController', () => {
  let controller: ReservationsController;
  let service: ReservationsService;

  const mockReservationsService = {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        {
          provide: ReservationsService,
          useValue: mockReservationsService,
        },
      ],
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);
    service = module.get<ReservationsService>(ReservationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a reservation', async () => {
    const createDto = {
      roomId: 1,
      startDate: '2025-05-01T10:00:00Z',
      endDate: '2025-05-01T12:00:00Z',
    };

    const expectedResult = {
      id: 1,
      ...createDto,
      startDate: new Date(createDto.startDate),
      endDate: new Date(createDto.endDate),
    };

    mockReservationsService.create.mockResolvedValue(expectedResult);

    const result = await controller.create(createDto);

    expect(result).toEqual(expectedResult);
    expect(mockReservationsService.create).toHaveBeenCalledWith({
      roomId: createDto.roomId,
      startDate: new Date(createDto.startDate),
      endDate: new Date(createDto.endDate),
    });
  });

  it('should update a reservation', async () => {
    const updateDto = {
      startDate: '2025-05-02T10:00:00Z',
      endDate: '2025-05-02T12:00:00Z',
    };

    const expectedResult = {
      id: 1,
      roomId: 1,
      ...updateDto,
      startDate: new Date(updateDto.startDate),
      endDate: new Date(updateDto.endDate),
    };

    mockReservationsService.update.mockResolvedValue(expectedResult);

    const result = await controller.update('1', updateDto);

    expect(result).toEqual(expectedResult);
    expect(mockReservationsService.update).toHaveBeenCalledWith(1, {
      startDate: new Date(updateDto.startDate),
      endDate: new Date(updateDto.endDate),
    });
  });
});
