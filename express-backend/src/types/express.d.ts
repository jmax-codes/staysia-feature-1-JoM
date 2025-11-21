/**
 * Express Request Type Extensions
 * 
 * Extends Express Request interface to include custom properties
 * for authenticated user, session, and host data.
 */

import { User, Session, Host } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      session?: Session;
      host?: Host;
    }
  }
}

export {};
