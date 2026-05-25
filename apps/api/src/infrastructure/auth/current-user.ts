export type CurrentUser = {
  uid: string;
  email?: string;
  name?: string;
  role?: "user" | "admin";
};
