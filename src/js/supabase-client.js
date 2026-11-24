const supabaseClient = window.supabase.createClient(
  window.EIMS_CONFIG.API.SUPABASE_URL,
  window.EIMS_CONFIG.API.SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);
if (typeof window !== 'undefined') {
  window.supabaseClient = supabaseClient;
}
