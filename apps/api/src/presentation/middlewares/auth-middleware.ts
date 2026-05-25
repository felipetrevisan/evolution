import { Elysia } from "elysia";
import { requireCurrentUser } from "../../infrastructure/auth/require-current-user";

export const authMiddleware = new Elysia({ name: "auth-middleware" }).onBeforeHandle(
  async ({ headers, store }) => {
    const currentUser = await requireCurrentUser(headers);
    Object.assign(store, {
      userId: currentUser.uid,
      currentUser,
    });
  },
);
