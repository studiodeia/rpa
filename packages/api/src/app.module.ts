import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { CabinsModule } from './modules/cabins/cabins.module';
import { OperationsModule } from './modules/operations/operations.module';
import { FishingModule } from './modules/fishing/fishing.module';
import { CommunicationModule } from './modules/communication/communication.module';
import { SuppliesModule } from './modules/supplies/supplies.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    AuthModule,
    UsersModule,
    ReservationsModule,
    PaymentsModule,
    CabinsModule,
    OperationsModule,
    FishingModule,
    CommunicationModule,
    SuppliesModule,
    ReportsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {} 