import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { SupabaseService } from '../../config/supabase.config';
import { WiseService } from './wise/wise.service';
import { WiseWebhookController } from './wise/wise-webhook.controller';
import { ReservationsModule } from '../reservations/reservations.module';

@Module({
  imports: [ReservationsModule],
  controllers: [PaymentsController, WiseWebhookController],
  providers: [PaymentsService, WiseService, SupabaseService],
  exports: [PaymentsService, WiseService],
})
export class PaymentsModule {} 