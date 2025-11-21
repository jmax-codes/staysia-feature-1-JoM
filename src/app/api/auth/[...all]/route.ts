/**
 * Better-Auth API Route Handler
 * 
 * This catch-all route handles all authentication requests including:
 * - Sign up (POST /api/auth/sign-up/email)
 * - Sign in (POST /api/auth/sign-in/email)
 * - Sign out (POST /api/auth/sign-out)
 * - Session management (GET /api/auth/get-session)
 * - Email verification
 * - Password reset
 * - Social authentication
 */

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
