import { EmailAuthProvider, linkWithCredential, unlink, User } from 'firebase/auth';
import { toast } from '@/components/ui/use-toast.ts';
import { AUTH_PROVIDER_DATA } from '@/constants/provider-data.ts';
import * as _ from 'lodash';

export abstract class AuthHelpers {
  public static async linkEmailAndPassword(user: User, email: string, password: string) {
    const emailCredential = EmailAuthProvider.credential(email, password);

    try {
      await linkWithCredential(user, emailCredential);
      console.log('Email and password successfully linked to account');
      toast({
        title: 'Account Updated',
        description: 'Email and password have been added to your account.'
      });
      return true;
    } catch (error: any) {
      console.error('Failed to link email and password:', error);
      toast({
        title: 'Linking Failed',
        description: error.message || 'Failed to add email and password to your account.'
      });
      return false;
    }
  }

  public static async unlinkProvider(user: User, providerId: string): Promise<boolean> {
    try {
      await unlink(user, providerId);
      console.log(`Provider ${providerId} unlinked successfully`);
      toast({
        title: 'Provider Unlinked',
        description: `Your ${this.getProviderName(providerId)} account has been removed.`
      });
      return true;
    } catch (error) {
      console.error(`Failed to unlink provider ${providerId}:`, error);
      toast({
        title: 'Unlink Failed',
        description: `Failed to remove ${this.getProviderName(providerId)} account.`
      });
      return false;
    }
  }

  public static getFirebaseErrorMessage(errorCode: string): string | undefined {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Email already in use. Please try a different email address.';
      case 'auth/weak-password':
        return 'Password is too weak. Please choose a stronger password.';
      case 'auth/invalid-email':
        return 'Invalid email address. Please enter a valid email.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with the same email address but different credentials.';
      case 'auth/cancelled':
        return 'Sign-in cancelled.';
      case 'auth/internal-error':
        return 'An internal error occurred. Please try again later.';
      case 'auth/invalid-argument':
        return 'Invalid arguments provided. Please check your input.';
      case 'auth/invalid-credential':
        return 'The provided credential is malformed or expired.';
      case 'auth/network-request-failed':
        return 'Network request failed. Please check your internet connection.';
      case 'auth/operation-not-allowed':
        return 'The requested operation is not allowed.';
      case 'auth/quota-exceeded':
        return 'Quota for this operation has been exceeded. Please try again later.';
      case 'auth/session-expired':
        return 'Your session has expired. Please sign in again.';
      case 'auth/timeout':
        return 'The operation timed out. Please try again later.';
      case 'auth/user-disabled':
        return 'The user account has been disabled.';
      case 'auth/user-not-found':
        return 'The user account does not exist.';
      case 'auth/wrong-password':
        return 'Invalid password. Please try again.';
      default:
        return 'An unknown error occurred. Please try again later.';
    }
  }

  public static checkAuthProvider(authUser: User, provider: string): boolean {
    const hasProviderAuth = _.some(authUser.providerData, { providerId: provider });
    if (hasProviderAuth) {
      console.log(`User is authenticated with ${provider}`);
      return true;
    } else {
      console.log(`User is not authenticated with ${provider}`);
      return false;
    }
  }

  public static getProviderName(providerId: string): string {
    const provider = _.find(AUTH_PROVIDER_DATA, { id: providerId });
    return provider ? provider.name : providerId;
  }
}
