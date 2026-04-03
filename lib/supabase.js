import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a real client when env vars are set, otherwise a placeholder
// that returns empty results (allows the page to render during build)
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        from: () => ({
          select: () => ({
            order: () => ({
              limit: () => Promise.resolve({ data: [], count: 0, error: null }),
              eq: () => ({
                limit: () => Promise.resolve({ data: [], count: 0, error: null }),
              }),
              or: () => ({
                limit: () => Promise.resolve({ data: [], count: 0, error: null }),
              }),
            }),
            in: () => Promise.resolve({ data: [], count: 0, error: null }),
            eq: () => Promise.resolve({ data: [], count: 0, error: null }),
          }),
        }),
        channel: () => ({
          on: function () { return this; },
          subscribe: function () { return this; },
        }),
        removeChannel: () => {},
      };
