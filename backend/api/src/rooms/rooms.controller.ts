import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { RoomsService } from './rooms.service';

const EQUIPMENTS = ['TV', 'Retro Projecteur'] as const;
type Equipment = (typeof EQUIPMENTS)[number];

@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @ApiQuery({ name: 'capacity', required: false, type: Number })
  @ApiQuery({
    name: 'equipment',
    required: false,
    enum: EQUIPMENTS,
    description:
      'Filter rooms equipped with this equipment. Possible values: TV, Retro Projecteur',
  })
  @Get()
  async findAll(
    @Query('capacity') capacity?: string,
    @Query('equipment') equipment?: Equipment,
  ) {
    const parsedCapacity = capacity ? parseInt(capacity, 10) : undefined;

    if (equipment && !EQUIPMENTS.includes(equipment)) {
      throw new BadRequestException('Invalid equipment type');
    }

    return this.roomsService.findAll(parsedCapacity, equipment);
  }
}
