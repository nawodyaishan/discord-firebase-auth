import { create } from 'zustand';
import {
  createUserWithEmailAndPassword,
  linkWithPopup,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  TwitterAuthProvider,
  User
} from 'firebase/auth';
import { auth } from '../config/firebase-config';
import { FirebaseError } from '@firebase/util';
import { AuthHelpers } from '@/helpers/auth-helpers.ts';
import { toast } from '@/components/ui/use-toast.ts';

interface UserState {
  email: string;
  password: string;
  register: (email: string, password: string) => Promise<boolean | undefined>;
  login: (email: string, password: string) => Promise<boolean | undefined>;
  logout: () => Promise<boolean | undefined>;
  twitterLogin: () => Promise<boolean | undefined>;
  linkEmailAndPassword: (user: User, email: string, password: string) => Promise<boolean>;
  linkTwitterAuthToEmailPass: (user: User) => Promise<boolean>;
  unlinkAuthProvider: (user: User, providerId: string) => Promise<boolean>;
}

const useUserStore = create<UserState>((set, _get) => ({
  email: '',
  password: '',
  register: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        set({ email, password });
        console.log('Registration successful');
        toast({
          title: 'Registration successful',
          description: 'Welcome aboard!'
        });
        return true;
      }
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error('Failed to register user:', error.code, error.message);
        toast({
          title: 'Registration error',
          description:
            AuthHelpers.getFirebaseErrorMessage(error.code) || 'An unexpected error occurred'
        });
      } else {
        console.error('Unexpected error:', error);
      }
      return false;
    }
  },
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        set({ email, password });
        console.log('Login successful');
        toast({
          title: 'Login successful',
          description: 'Welcome back!'
        });
        return true;
      }
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error('Failed to login user:', error.code, error.message);
        toast({
          title: 'Login error',
          description:
            AuthHelpers.getFirebaseErrorMessage(error.code) || 'An unexpected error occurred'
        });
      } else {
        console.error('Unexpected error:', error);
      }
      return false;
    }
  },
  logout: async () => {
    try {
      await signOut(auth);
      set({ email: '', password: '' });
      console.log('Logged out successfully');
      toast({
        title: 'Logout successful',
        description: 'See you again soon!'
      });
      return true;
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error('Failed to logout user:', error.code, error.message);
        toast({
          title: 'Logout error',
          description:
            AuthHelpers.getFirebaseErrorMessage(error.code) || 'An unexpected error occurred'
        });
      } else {
        console.error('Unexpected error:', error);
      }
      return false;
    }
  },
  twitterLogin: async () => {
    try {
      const provider = new TwitterAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      set({ email: user.email || '', password: '' });

      toast({
        title: 'Twitter Login successful',
        description: 'You are now logged in with Twitter!'
      });

      return true;
    } catch (error) {
      console.error('Failed to sign in with Twitter:', error);
      toast({
        title: 'Twitter Login failed',
        description: 'An error occurred while signing in with Twitter.'
      });
      return false;
    }
  },
  linkEmailAndPassword: async (user: User, email, password) => {
    if (user) {
      return AuthHelpers.linkEmailAndPassword(user, email, password);
    } else {
      toast({
        title: 'No Authentication Found',
        description: 'No user is currently logged in.'
      });
      return false;
    }
  },
  linkTwitterAuthToEmailPass: async (user: User) => {
    if (!user) {
      toast({
        title: 'No Authentication Found',
        description: 'No user is currently logged in.'
      });
      return false;
    }
    const provider = new TwitterAuthProvider();
    try {
      const result = await linkWithPopup(user, provider);
      set({ email: result.user.email || '', password: '' });
      console.log('Twitter account linked successfully');
      toast({
        title: 'Twitter Link Successful',
        description: 'Your Twitter account has been linked successfully!'
      });
      return true;
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error('Failed to link Twitter account:', error);
        toast({
          title: 'Twitter Link Failed',
          description: error.message || 'Failed to link Twitter account.'
        });
        return false;
      } else {
        console.error('Unexpected error:', error);
      }
      return false;
    }
  },
  unlinkAuthProvider: async (user: User, providerId: string): Promise<boolean> => {
    try {
      if (!AuthHelpers.hasMultipleAuthProviders(user)) {
        toast({
          title: 'Unlink Not Allowed',
          description: 'You cannot unlink your only authentication method.'
        });
        return false;
      }
      if (user) {
        return AuthHelpers.unlinkProvider(user, providerId);
      } else {
        toast({
          title: 'No User Found',
          description: 'No authenticated user available.'
        });
        return false;
      }
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error(`Failed to unlink ${providerId}:`, error);
        toast({
          title: `Unlink ${providerId} Failed`,
          description: error.message || `Failed to unlink ${providerId} account.`
        });
        return false;
      } else {
        console.error('Unexpected error:', error);
      }
      return false;
    }
  }
}));

export default useUserStore;
