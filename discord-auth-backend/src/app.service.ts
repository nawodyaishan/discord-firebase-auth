import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import * as admin from 'firebase-admin';
import { FirebaseAdminConfigs } from './config/firebase-admin-configs';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    FirebaseAdminConfigs.loadConfig().then(() => {
      const privateKey = configService.get<string>(
        'FIREBASE_ADMIN_PRIVATE_KEY',
      );
      const projectId = FirebaseAdminConfigs.projectId;
      const clientEmail = FirebaseAdminConfigs.clientEmail;

      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: projectId,
            clientEmail: clientEmail,
            privateKey: privateKey.replace(/\\n/g, '\n'),
          }),
        });
      }
    });
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
      const tokenResponse = await this.httpService
        .post('https://discord.com/api/oauth2/token', params.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .toPromise();
      const accessToken = tokenResponse.data.access_token;
      const userInfoResponse = await this.httpService
        .get('https://discord.com/api/users/@me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .toPromise();

      this.logger.log('User Information:', userInfoResponse.data);
      // const uid = userInfoResponse.data.id;
      return await this.createCustomToken(accessToken);
    } catch (error) {
      this.logger.error(
        'Error during Discord authentication:',
        error.response?.data || error.message,
      );
      throw new Error('Authentication process failed');
    }
  }

  async createCustomToken(uid: string): Promise<string> {
    try {
      return await admin.auth().createCustomToken(uid);
    } catch (error) {
      this.logger.error('Error creating custom token:', error);
      throw new Error('Failed to create custom token');
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
