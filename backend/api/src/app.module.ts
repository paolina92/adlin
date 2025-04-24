import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RoomsModule } from './rooms/rooms.module';
import { ReservationsModule } from './reservations/reservations.module';

@Module({
  imports: [PrismaModule, RoomsModule, ReservationsModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
