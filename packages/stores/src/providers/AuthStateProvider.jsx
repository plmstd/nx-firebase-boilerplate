'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore.js';

/**
 * Starts the shared Firebase Auth subscription for an app surface.
 *
 * The component intentionally renders nothing so it can be mounted in a Next.js
 * root layout without turning the whole page tree into a client component.
 */
export function AuthStateProvider({ userCollection = 'users' }) {
  useEffect(() => {
    const unsubscribe = useAuthStore
      .getState()
      .subscribeAuth({ userCollection });

    return unsubscribe;
  }, [userCollection]);

  return null;
}
