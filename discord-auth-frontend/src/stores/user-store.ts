import { create } from 'zustand';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  TwitterAuthProvider
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
  updateToEmailAndPassword: (email: string, password: string) => Promise<boolean>;
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
  updateToEmailAndPassword: async (email: string, password: string) => {
    try {
      console.log('🚀 - updateToEmailAndPassword', email, password);
      const existingUser = await signInWithEmailAndPassword(auth, email, password);
      await AuthHelpers.linkTwitterAccount(existingUser.user);
      return true;
    } catch (error: unknown) {
      if (error instanceof FirebaseError && error.code === 'auth/user-not-found') {
        await _get().register(email, password);
        return true;
      } else {
        console.error('Failed to update authentication method:', error);
        toast({
          title: 'Update failed',
          description: 'An error occurred while updating authentication method.'
        });
        return false;
      }
    }
  }
}));

export default useUserStore;
