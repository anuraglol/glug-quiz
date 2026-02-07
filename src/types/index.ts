import type { Session, User } from "better-auth/client";

export type ServerSession = {
  session: Session;
  user: User;
} | null;
