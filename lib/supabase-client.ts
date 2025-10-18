import { createClient, SupabaseClient } from '@supabase/supabase-js';

// 認証不要クライアント
export function createPublicSupabaseClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// JWT付き認証必須クライアント
export function createJwtSupabaseClient(jwt: string): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    }
  );
}
