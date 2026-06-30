import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeviceService } from './device.service';
import { TelegramService } from './telegram.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, DeviceService, TelegramService],
})
export class AppModule {}
