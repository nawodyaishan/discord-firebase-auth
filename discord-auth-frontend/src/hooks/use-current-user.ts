import { User } from 'firebase/auth';
import { auth, db } from '../config/firebase-config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc, FirestoreError } from 'firebase/firestore';
import { userConverter, UserSchema } from '../schemas/user-schema';

/**
 * Custom hook to fetch the current authenticated user along with their extended Firestore data.
 * This hook utilizes Firebase auth for authentication data and Firestore for user-specific data.
 *
 * @returns An object containing user data, loading states, and potential errors.
 */
const useCurrentUser = (): {
  userError: FirestoreError | undefined;
  userLoading: boolean;
  authUserError: Error | undefined;
  authUser: User | null;
  user: UserSchema | null;
  authUserLoading: boolean;
} => {
  // Hook to get the authenticated user state
  const [authUser, authUserLoading, authUserError] = useAuthState(auth);

  // Document reference to the user's Firestore data
  const userRef = authUser ? doc(db, `users/${authUser.uid}`).withConverter(userConverter) : null;

  // Hook to get the user document data from Firestore
  const [user, userLoading, userError] = useDocumentData<UserSchema>(userRef, {
    snapshotListenOptions: { includeMetadataChanges: true }
  });

  // Provide all necessary user data and states back to the component using this hook
  return {
    authUser: authUser ?? null,
    user: user ?? null,
    authUserLoading,
    authUserError,
    userLoading,
    userError
  };
};

export default useCurrentUser;
