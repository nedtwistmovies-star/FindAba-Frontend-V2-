import { supabase } from './src/lib/supabase';

async function test() {
  const tables = ['comments', 'likes', 'follows', 'groups', 'group_members', 'messages', 'stories', 'events'];
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`Table ${table} does not exist or error: ${error.message}`);
    } else {
      console.log(`Table ${table} exists!`);
    }
  }
}

test();
