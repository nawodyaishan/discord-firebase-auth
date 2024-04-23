export abstract class AuthHelpers {
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
}
