import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get('')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('auth/discord/redirect')
  async redirect(@Query('code') code: string): Promise<string> {
    this.logger.log('Received OAuth redirect with code: ' + code);
    if (!code) {
      this.logger.error('No code provided in query parameters');
      throw new HttpException(
        'Authorization code is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const token = await this.appService.getDiscordOAuthRedirect(code);
      this.logger.log('Obtained access token');
      return token;
    } catch (error) {
      this.logger.error('Error during Discord OAuth: ' + error.message);
      throw new HttpException(
        'Failed to authenticate with Discord',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
