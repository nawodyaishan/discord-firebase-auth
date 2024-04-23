import { linkWithCredential, signInWithPopup, TwitterAuthProvider, User } from 'firebase/auth';
import { toast } from '@/components/ui/use-toast.ts';
import { auth } from '@/config/firebase-config.ts';

export abstract class AuthHelpers {
  public static async linkTwitterAccount(user: User) {
    const provider = new TwitterAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const twitterCredential = TwitterAuthProvider.credentialFromResult(result);
      if (!twitterCredential) {
        throw Error('Twitter credentials not found.');
      }
      await linkWithCredential(user, twitterCredential);
      console.log('Twitter account linked successfully');
      toast({
        title: 'Account Updated',
        description:
          'Your authentication method has been updated to email and password, and your Twitter account is linked.'
      });
      return true;
    } catch (error) {
      console.error('Failed to link Twitter account:', error);
      toast({
        title: 'Update failed',
        description: 'An error occurred while linking Twitter account.'
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

  public static getProviderName(providerId: string) {
    switch (providerId) {
      case 'password':
        return 'Email/Password';
      case 'twitter.com':
        return 'Twitter';
      case 'facebook.com':
        return 'Facebook';
      case 'github.com':
        return 'GitHub';
      case 'google.com':
        return 'Google';
      default:
        return providerId;
    }
  }
}
