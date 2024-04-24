import * as path from 'path';
import * as fs from 'node:fs';

interface FirebaseAdminConfig {
  type: string;
  project_id: string;
  private_key_id?: string;
  private_key?: never;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain: string;
}

export abstract class FirebaseAdminConfigs {
  private static config: FirebaseAdminConfig;

  static get projectId(): string {
    if (!this.config) {
      throw new Error(
        'Firebase Admin configuration not loaded yet. Call loadConfig() first.',
      );
    }
    return this.config.project_id;
  }

  static get clientEmail(): string {
    if (!this.config) {
      throw new Error(
        'Firebase Admin configuration not loaded yet. Call loadConfig() first.',
      );
    }
    return this.config.client_email;
  }

  // Getter methods to access specific configuration fields (without private key)
  static get type(): string {
    if (!this.config) {
      throw new Error(
        'Firebase Admin configuration not loaded yet. Call loadConfig() first.',
      );
    }
    return this.config.type;
  }

  static get clientId(): string {
    if (!this.config) {
      throw new Error(
        'Firebase Admin configuration not loaded yet. Call loadConfig() first.',
      );
    }
    return this.config.client_id;
  }

  static get authUri(): string {
    if (!this.config) {
      throw new Error(
        'Firebase Admin configuration not loaded yet. Call loadConfig() first.',
      );
    }
    return this.config.auth_uri;
  }

  static get tokenUri(): string {
    if (!this.config) {
      throw new Error(
        'Firebase Admin configuration not loaded yet. Call loadConfig() first.',
      );
    }
    return this.config.token_uri;
  }

  static get authProviderX509CertUrl(): string {
    if (!this.config) {
      throw new Error(
        'Firebase Admin configuration not loaded yet. Call loadConfig() first.',
      );
    }
    return this.config.auth_provider_x509_cert_url;
  }

  static get clientX509CertUrl(): string {
    if (!this.config) {
      throw new Error(
        'Firebase Admin configuration not loaded yet. Call loadConfig() first.',
      );
    }
    return this.config.client_x509_cert_url;
  }

  static get universeDomain(): string {
    if (!this.config) {
      throw new Error(
        'Firebase Admin configuration not loaded yet. Call loadConfig() first.',
      );
    }
    return this.config.universe_domain;
  }

  // Throws an error if someone tries to access the private key
  static get privateKey(): never {
    throw new Error('Private key access is not allowed for security reasons.');
  }

  static async loadConfig(): Promise<void> {
    const configName = process.env.FIREBASE_ADMIN_CONFIG_JSON_NAME;
    console.log(' - FIREBASE_ADMIN_CONFIG_JSON_NAME detected', configName);

    if (!configName) {
      throw new Error(
        'Firebase Admin configuration name not found in environment variable',
      );
    }

    const filePath = path.resolve(__dirname, '../../src/config/', configName);

    try {
      const data = await fs.promises.readFile(filePath, 'utf-8');
      this.config = JSON.parse(data);
      this.validateConfig(this.config);
    } catch (error) {
      throw new Error(
        'Error reading or parsing Firebase Admin configuration: ' +
          error.message,
      );
    }
  }

  // Function to validate configuration structure (optional)
  private static validateConfig(config: FirebaseAdminConfig): void {
    const requiredFields = [
      'type',
      'project_id',
      'client_email',
      'client_id',
      'auth_uri',
      'token_uri',
      'auth_provider_x509_cert_url',
      'client_x509_cert_url',
      'universe_domain',
    ];
    for (const field of requiredFields) {
      if (!config.hasOwnProperty(field)) {
        throw new Error(
          `Missing required field '${field}' in Firebase Admin configuration`,
        );
      }
    }
  }
}
