import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { EmailDto } from './dto/email.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/')
  sendMail(@Body() data: EmailDto, @Req() req) {
    return this.appService.sendMail(data, req);
  }


  @Post('/second')
  sendMailMicrosoft(@Body() data: EmailDto, @Req() req) {
    return this.appService.sendMailMicrosoft(data, req);
  }

  @Post('/brown')
  sendMailBrown(@Body() data: EmailDto, @Req() req) {
    return this.appService.sendMailBrown(data, req);
  }
}
