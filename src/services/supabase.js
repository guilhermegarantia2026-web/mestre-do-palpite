import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fhjiydiimiqhathmbmyb.supabase.co";
const supabaseAnonKey = "sb_publishable_wGNRjo9X7eQbjbRvMYB37g_4VwhoiR5";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);