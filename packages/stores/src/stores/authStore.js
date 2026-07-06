'use client';

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { create } from 'zustand';
import { auth, db } from '@myapp/utils';

const DEFAULT_USER_COLLECTION = 'users';

let authSubscriberCount = 0;
let unsubscribeAuth = null;
let unsubscribeUserDoc = null;
let activeUserDocPath = null;

const callUnsubscribe = (unsubscribe) => {
  if (typeof unsubscribe === 'function') {
    unsubscribe();
  }
};

const clearUserDocSubscription = () => {
  callUnsubscribe(unsubscribeUserDoc);
  unsubscribeUserDoc = null;
  activeUserDocPath = null;
};

const getUserDocPath = (user, userCollection = DEFAULT_USER_COLLECTION) =>
  `${userCollection}/${user.uid}`;

const getUserDocRef = (user, userCollection = DEFAULT_USER_COLLECTION) =>
  doc(db, userCollection, user.uid);

const getEmailPasswordArgs = (emailOrOptions, password) => {
  if (typeof emailOrOptions === 'object' && emailOrOptions !== null) {
    return {
      email: emailOrOptions.email,
      password: emailOrOptions.password,
    };
  }

  return { email: emailOrOptions, password };
};

const getSignUpArgs = (emailOrOptions, password, options = {}) => {
  if (typeof emailOrOptions === 'object' && emailOrOptions !== null) {
    return {
      email: emailOrOptions.email,
      password: emailOrOptions.password,
      displayName: emailOrOptions.displayName,
      profile: emailOrOptions.profile,
      createUserDocument: emailOrOptions.createUserDocument,
      userCollection: emailOrOptions.userCollection,
    };
  }

  return {
    email: emailOrOptions,
    password,
    displayName: options.displayName,
    profile: options.profile,
    createUserDocument: options.createUserDocument,
    userCollection: options.userCollection,
  };
};

const requireEmailPassword = ({ email, password }) => {
  if (!email || !password) {
    throw new Error('An email and password are required.');
  }
};

const getInitialState = () => ({
  user: null,
  userDoc: null,
  userDocPath: null,
  isLoading: true,
  isInitialized: false,
  isUserDocLoading: false,
  error: null,
});

const getSignedOutState = () => ({
  user: null,
  userDoc: null,
  userDocPath: null,
  isLoading: false,
  isInitialized: true,
  isUserDocLoading: false,
  error: null,
});

const buildUserDocument = ({
  user,
  email,
  displayName,
  profile = {},
  isNewUser,
}) => ({
  ...profile,
  uid: user.uid,
  email: user.email ?? email ?? null,
  displayName: profile.displayName ?? displayName ?? user.displayName ?? null,
  photoURL: profile.photoURL ?? user.photoURL ?? null,
  updatedAt: serverTimestamp(),
  ...(isNewUser ? { createdAt: serverTimestamp() } : {}),
});

const subscribeToUserDoc = (user, options = {}) => {
  const userCollection = options.userCollection ?? DEFAULT_USER_COLLECTION;
  const userDocPath = getUserDocPath(user, userCollection);

  clearUserDocSubscription();
  activeUserDocPath = userDocPath;

  useAuthStore.setState({
    userDoc: null,
    userDocPath,
    isUserDocLoading: true,
  });

  unsubscribeUserDoc = onSnapshot(
    getUserDocRef(user, userCollection),
    (snapshot) => {
      if (activeUserDocPath !== userDocPath) {
        return;
      }

      useAuthStore.setState({
        userDoc: snapshot.exists()
          ? {
              id: snapshot.id,
              ...snapshot.data(),
            }
          : null,
        isUserDocLoading: false,
        error: null,
      });
    },
    (error) => {
      if (activeUserDocPath !== userDocPath) {
        return;
      }

      useAuthStore.setState({
        userDoc: null,
        isUserDocLoading: false,
        error,
      });
    },
  );
};

const startAuthSubscription = (options = {}) => {
  if (unsubscribeAuth) {
    return;
  }

  useAuthStore.setState({ isLoading: true, error: null });

  unsubscribeAuth = onAuthStateChanged(
    auth,
    (user) => {
      clearUserDocSubscription();

      if (!user) {
        useAuthStore.setState(getSignedOutState());
        return;
      }

      useAuthStore.setState({
        user,
        userDoc: null,
        userDocPath: null,
        isLoading: false,
        isInitialized: true,
        isUserDocLoading: true,
        error: null,
      });

      subscribeToUserDoc(user, options);
    },
    (error) => {
      clearUserDocSubscription();

      useAuthStore.setState({
        ...getSignedOutState(),
        error,
      });
    },
  );
};

const stopAuthSubscription = () => {
  callUnsubscribe(unsubscribeAuth);
  unsubscribeAuth = null;
  authSubscriberCount = 0;
  clearUserDocSubscription();
};

/**
 * Shared Firebase Auth store.
 *
 * The store keeps the Firebase Auth user, the matching Firestore user document
 * at `users/{uid}`, and the cleanup lifecycle for both realtime listeners.
 * Importing the store does not start listeners; call `subscribeAuth()` once
 * from an app-level client provider.
 */
export const useAuthStore = create((set) => ({
  ...getInitialState(),

  /**
   * Starts the Firebase Auth listener and the authenticated user's Firestore
   * document subscription. Multiple callers share one global listener and each
   * receive an idempotent cleanup function.
   *
   * @param {{ userCollection?: string }} [options]
   * @returns {() => void}
   */
  subscribeAuth: (options = {}) => {
    authSubscriberCount += 1;
    startAuthSubscription(options);

    let didUnsubscribe = false;

    return () => {
      if (didUnsubscribe) {
        return;
      }

      didUnsubscribe = true;
      authSubscriberCount = Math.max(0, authSubscriberCount - 1);

      if (authSubscriberCount === 0) {
        stopAuthSubscription();
      }
    };
  },

  /**
   * Stops the shared auth and user-document listeners immediately.
   */
  stopAuthSubscription,

  /**
   * Signs in with Firebase Email/Password Auth.
   *
   * @param {string | { email: string, password: string }} emailOrOptions
   * @param {string} [password]
   * @returns {Promise<import('firebase/auth').UserCredential>}
   */
  signIn: async (emailOrOptions, password) => {
    const credentials = getEmailPasswordArgs(emailOrOptions, password);
    requireEmailPassword(credentials);

    set({ isLoading: true, error: null });

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password,
      );

      set({
        user: userCredential.user,
        isLoading: false,
        isInitialized: true,
        error: null,
      });

      return userCredential;
    } catch (error) {
      set({ isLoading: false, error });
      throw error;
    }
  },

  /**
   * Creates a Firebase Email/Password Auth user and, by default, creates or
   * merges a matching Firestore document at `users/{uid}`.
   *
   * @param {string | {
   *   email: string,
   *   password: string,
   *   displayName?: string,
   *   profile?: Record<string, unknown>,
   *   createUserDocument?: boolean,
   *   userCollection?: string
   * }} emailOrOptions
   * @param {string} [password]
   * @param {{
   *   displayName?: string,
   *   profile?: Record<string, unknown>,
   *   createUserDocument?: boolean,
   *   userCollection?: string
   * }} [options]
   * @returns {Promise<import('firebase/auth').UserCredential>}
   */
  signUp: async (emailOrOptions, password, options) => {
    const signUpArgs = getSignUpArgs(emailOrOptions, password, options);
    requireEmailPassword(signUpArgs);

    const {
      email,
      displayName,
      profile,
      createUserDocument = true,
      userCollection = DEFAULT_USER_COLLECTION,
    } = signUpArgs;

    set({ isLoading: true, error: null });

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        signUpArgs.password,
      );

      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }

      if (createUserDocument) {
        await setDoc(
          getUserDocRef(userCredential.user, userCollection),
          buildUserDocument({
            user: userCredential.user,
            email,
            displayName,
            profile,
            isNewUser: true,
          }),
          { merge: true },
        );
      }

      set({
        user: userCredential.user,
        isLoading: false,
        isInitialized: true,
        error: null,
      });

      return userCredential;
    } catch (error) {
      set({ isLoading: false, error });
      throw error;
    }
  },

  /**
   * Signs out the current Firebase Auth user and clears local auth state.
   *
   * @returns {Promise<void>}
   */
  signOut: async () => {
    set({ isLoading: true, error: null });

    try {
      await firebaseSignOut(auth);
      clearUserDocSubscription();
      set(getSignedOutState());
    } catch (error) {
      set({ isLoading: false, error });
      throw error;
    }
  },

  /**
   * Clears the last auth or user-document error without changing auth state.
   */
  clearError: () => set({ error: null }),
}));
