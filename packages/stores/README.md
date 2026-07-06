# @myapp/stores

Shared Zustand stores and store helpers for application code.

Use this package for shared app-shell state, Firebase Auth state, UI state, and
small reusable store helpers. Application code should import shared stores from
`@myapp/stores` instead of creating duplicate local Zustand stores in feature
folders.

## Auth Store

`useAuthStore` owns the client-side Firebase Auth lifecycle:

- listens to `onAuthStateChanged`
- exposes `signIn`, `signUp`, and `signOut`
- subscribes to the authenticated user's Firestore document at `users/{uid}`
- cleans up the previous user document listener when the auth user changes

Mount `AuthStateProvider` once per app surface. The Next.js app already mounts
it in `apps/web/src/app/layout.jsx`.

```jsx
'use client';

import { useAuthStore } from '@myapp/stores';

export function LoginButton() {
  const user = useAuthStore((state) => state.user);
  const signIn = useAuthStore((state) => state.signIn);
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <button
      type="button"
      onClick={() =>
        user
          ? signOut()
          : signIn({ email: 'demo@example.com', password: 'password' })
      }
    >
      {user ? 'Sign out' : 'Sign in'}
    </button>
  );
}
```

`signUp` creates the Firebase Auth user and creates or merges a Firestore user
document by default:

```js
const signUp = useAuthStore.getState().signUp;

await signUp({
  email: 'demo@example.com',
  password: 'password',
  displayName: 'Demo User',
  profile: {
    role: 'user',
  },
});
```

Pass `createUserDocument: false` if a project creates user documents from a
backend trigger instead.

## Demo Store

`useDemoStore` is a tiny counter store used by the boilerplate demo screen. It
can be removed once a real project no longer needs it.

## Firestore Rules

The Firebase rules allow authenticated users to read and write their own
document at `users/{uid}` and deny all other Firestore access by default. Extend
`apps/firebase/firestore.rules` when your app introduces additional collections
or backend-owned user fields.
