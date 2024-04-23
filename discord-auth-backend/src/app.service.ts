import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getDiscordOAuthRedirect(code: string): Promise<string> {
    const params = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.DISCORD_REDIRECT_URI,
    });

    try {
      const response = await axios.post(
        'https://discord.com/api/oauth2/token',
        params,
      );
      return response.data.access_token;
    } catch (error) {
      console.error('Error obtaining Discord access token:', error);
      throw new Error('Failed to obtain access token');
    }
  }
}
