import { createClient } from '@supabase/supabase-js';

import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from '../config';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    // Links de e-mail chegam pelo deep link do app (tratado em conta/deepLink.ts).
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
});
