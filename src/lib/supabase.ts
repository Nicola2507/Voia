import { createClient } from "@supabase/supabase-js";

// `.trim()` guards against a trailing "\r" when .env uses Windows (CRLF) line
// endings, which would otherwise corrupt the URL/key in the browser bundle.
const url = import.meta.env.PUBLIC_SUPABASE_URL?.trim();
const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY?.trim();

if (!url || !key) {
  throw new Error(
    "Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY. Set them in .env (see .env.example).",
  );
}

export const supabase = createClient(url, key);
