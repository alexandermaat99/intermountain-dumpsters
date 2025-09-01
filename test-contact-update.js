// Test script to check contact info update functionality
const { createClient } = require('@supabase/supabase-js');

// Use the same environment variables as the app
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://acsxwvvvlfajjizqwcia.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjc3h3dnZ2bGZhamppenF3Y2lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyOTQwNzIsImV4cCI6MjA2NTg3MDA3Mn0.BhDCtlva_D8H56mesZZs9z_UgdUnrYokeOUaqVdVzWc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testContactInfoUpdate() {
  console.log('🧪 Testing contact info update functionality...\n');

  try {
    // First, let's read the current contact info
    console.log('📖 Reading current contact info...');
    const { data: currentData, error: readError } = await supabase
      .from('admin_info')
      .select('*')
      .single();

    if (readError) {
      console.error('❌ Error reading contact info:', readError);
      return;
    }

    console.log('✅ Current contact info:', currentData);

    // Now let's try to update it
    console.log('\n📝 Attempting to update contact info...');
    const testUpdate = {
      ...currentData,
      email: 'test-' + currentData.email, // Only modify email, not phone (which might have constraints)
      updated_at: new Date().toISOString()
    };

    const { data: updatedData, error: updateError } = await supabase
      .from('admin_info')
      .update({
        email: testUpdate.email,
        updated_at: testUpdate.updated_at
      })
      .eq('id', currentData.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error updating contact info:', updateError);
      console.error('Error details:', {
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint,
        code: updateError.code
      });
    } else {
      console.log('✅ Successfully updated contact info:', updatedData);
    }

    // Let's also test with a different approach - using update instead of upsert
    console.log('\n🔄 Testing with update method...');
    const { data: updateData, error: updateError2 } = await supabase
      .from('admin_info')
      .update({ 
        email: currentData.email.replace('test-', ''),
        updated_at: new Date().toISOString()
      })
      .eq('id', currentData.id)
      .select()
      .single();

    if (updateError2) {
      console.error('❌ Error with update method:', updateError2);
    } else {
      console.log('✅ Successfully updated with update method:', updateData);
    }

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

// Run the test
testContactInfoUpdate().then(() => {
  console.log('\n✅ Test completed');
  process.exit(0);
}).catch(error => {
  console.error('\n❌ Test failed:', error);
  process.exit(1);
}); 