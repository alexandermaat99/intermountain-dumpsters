const { createClient } = require('@supabase/supabase-js');

// You'll need to add your Supabase URL and service role key here
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addDeletedColumn() {
  try {
    console.log('🔄 Adding deleted column to rentals and contact_messages tables...');
    
    // Add the deleted column to rentals table
    const { error: rentalsError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE rentals 
        ADD COLUMN IF NOT EXISTS deleted BOOLEAN DEFAULT FALSE;
      `
    });

    if (rentalsError) {
      console.error('❌ Error adding deleted column to rentals:', rentalsError);
    } else {
      console.log('✅ Successfully added deleted column to rentals table');
    }

    // Add the deleted column to contact_messages table
    const { error: messagesError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE contact_messages 
        ADD COLUMN IF NOT EXISTS deleted BOOLEAN DEFAULT FALSE;
      `
    });

    if (messagesError) {
      console.error('❌ Error adding deleted column to contact_messages:', messagesError);
    } else {
      console.log('✅ Successfully added deleted column to contact_messages table');
    }

    console.log('📝 The deleted column defaults to FALSE for all existing records');
    console.log('🔍 You can now use deep archive functionality for both rentals and contact messages');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the migration
addDeletedColumn();
