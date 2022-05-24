import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.REACT_APP_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_PUBLIC_SUPABASE_ANON_KEY;

const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export { client as supabaseClient }