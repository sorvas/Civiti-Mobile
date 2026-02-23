export type HealthCheckResponse = {
  status: string | null;
  timestamp: string;
  version: string | null;
  database: string | null;
  databaseError: string | null;
  supabase: string | null;
  environment: string | null;
}
