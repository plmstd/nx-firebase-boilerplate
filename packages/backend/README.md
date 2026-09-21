# @myapp/backend

Shared server-only Firebase Admin helpers and logging.

Use the dedicated entry point when a function only needs logging:

```js
import { logger } from '@myapp/backend/logger';
```

This preserves the existing emulator/production logging behavior without loading
the Admin SDK services. Admin helpers remain available from `@myapp/backend`;
import them explicitly only where they are needed. Their initialization and
credential handling are unchanged.

The Functions build bundles this package. Validate with `npx nx build functions`
and `npm run test:performance` after changing the entry points.
