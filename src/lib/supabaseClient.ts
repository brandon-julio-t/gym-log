import { env } from '$env/dynamic/public';
// import { createClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/auth-helpers-sveltekit';

const supabase = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY);

export default supabase;
