import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Put,
  Query,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiQuery, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import {
  CreateReservationDto,
  UpdateReservationDto,
} from '../types/reservation.interface';

@ApiTags('reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @ApiQuery({ name: 'startDate', required: true, type: String })
  @ApiQuery({ name: 'endDate', required: true, type: String })
  @Get()
  async findAll(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    if (!startDate || !endDate) {
      throw new BadRequestException('startDate and endDate are required');
    }

    return this.reservationsService.findAll(startDate, endDate);
  }

  @ApiBody({
    schema: {
      example: {
        roomId: 1,
        startDate: '2025-04-25T14:00:00Z',
        endDate: '2025-04-25T16:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Reservation created successfully' })
  @ApiResponse({ status: 400, description: 'Conflict or invalid data' })
  @Post()
  async create(
    @Body() body: { roomId: number; startDate: string; endDate: string },
  ) {
    const createDto: CreateReservationDto = {
      roomId: body.roomId,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
    };
    return this.reservationsService.create(createDto);
  }

  @ApiBody({
    schema: {
      example: {
        startDate: '2025-04-25T15:00:00Z',
        endDate: '2025-04-25T17:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Reservation updated' })
  @ApiResponse({
    status: 400,
    description: 'Time slot conflict or reservation not found',
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { startDate?: string; endDate?: string; roomId?: number },
  ) {
    const updateDto: UpdateReservationDto = {
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      roomId: body.roomId,
    };
    return this.reservationsService.update(Number(id), updateDto);
  }

  @ApiResponse({ status: 200, description: 'Reservation deleted' })
  @ApiResponse({ status: 400, description: 'Reservation not found' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.reservationsService.remove(Number(id));
  }
}
