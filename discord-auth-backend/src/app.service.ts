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
            projectId,
            clientEmail,
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
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
        .toPromise();
      const accessToken = tokenResponse.data.access_token;
      const userInfoResponse = await this.httpService
        .get('https://discord.com/api/users/@me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .toPromise();

      this.logger.log('User Information:', userInfoResponse.data);

      // Create or update user in Firebase Auth
      const { id: uid, email, username: displayName } = userInfoResponse.data;
      const userRecord = await this.upsertUser({ uid, email, displayName });

      // Create a custom token
      return await admin.auth().createCustomToken(userRecord.uid);
    } catch (error) {
      this.logger.error(
        'Error during Discord authentication or user management:',
        error.response?.data || error.message,
      );
      throw new Error('Authentication process failed');
    }
  }

  async upsertUser(userData: {
    uid: string;
    email?: string;
    displayName?: string;
  }): Promise<admin.auth.UserRecord> {
    try {
      const userRecord = await admin.auth().getUser(userData.uid);
      this.logger.log('🚀 - User Record:', userRecord);
      return await admin.auth().updateUser(userData.uid, {
        email: userData.email,
        displayName: userData.displayName,
      });
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        return await admin.auth().createUser({
          uid: userData.uid,
          email: userData.email,
          displayName: userData.displayName,
        });
      }
      throw error;
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
