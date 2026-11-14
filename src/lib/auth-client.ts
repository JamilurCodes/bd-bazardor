import { createAuthClient } from "better-auth/react";

// The browser client uses the same origin as the Next.js app,
// which is why no baseURL is passed here.
export const authClient = createAuthClient();