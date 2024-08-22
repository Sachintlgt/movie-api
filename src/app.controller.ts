import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';
import {
  ApiOperation,
} from '@nestjs/swagger';

@Public()
@Controller()

export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Test only' })
  @Get()
  getHello() {
    return this.appService.getHello()
  }
}
