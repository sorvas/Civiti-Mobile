export type AuthStatusResponse = {
  authenticated: boolean;
  supabaseUserId: string | null;
  email: string | null;
}
