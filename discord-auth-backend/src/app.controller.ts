import {
  Controller,
  Get,
  Logger,
  Query,
  Redirect,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { DiscordAuthDto } from './dto/discord-auth.dto';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  @Get('')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('auth/discord/redirect')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Redirect()
  async redirect(@Query() discordAuthDto: DiscordAuthDto) {
    try {
      const firebaseToken = await this.appService.getDiscordOAuthRedirect(
        discordAuthDto.code,
      );
      const frontendUrl = `${this.configService.get<string>('FRONTEND_APP_URL')}/auth?token=${firebaseToken}`;
      return { url: frontendUrl };
    } catch (error) {
      this.logger.error('Error during authentication process:', error);
      const errorUrl = `${this.configService.get<string>('FRONTEND_APP_URL')}/error?message=${encodeURIComponent(error.message)}`;
      return { url: errorUrl };
    }
  }
}
