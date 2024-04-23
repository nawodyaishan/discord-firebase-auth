import { create } from 'zustand';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
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
  }
}));

export default useUserStore;
