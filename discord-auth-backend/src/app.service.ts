import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AppService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getDiscordOAuthRedirect(code: string): Promise<string> {
    const params = new URLSearchParams({
      client_id: this.configService.get<string>('DISCORD_CLIENT_ID'),
      client_secret: this.configService.get<string>('DISCORD_CLIENT_SECRET'),
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.configService.get<string>('DISCORD_REDIRECT_URI'),
    });

    try {
      const response = await this.httpService
        .post('https://discord.com/api/oauth2/token', params.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .toPromise();
      return response.data.access_token;
    } catch (error) {
      console.error(
        'Error obtaining Discord access token:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to obtain access token');
    }
  }
}
