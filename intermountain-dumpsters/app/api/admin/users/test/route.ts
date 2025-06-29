import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create a server-side Supabase client with service role key
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  try {
    // Check if environment variables are set
    const hasSupabaseUrl = !!supabaseUrl;
    const hasServiceKey = !!supabaseServiceKey;
    
    if (!hasSupabaseUrl || !hasServiceKey) {
      return NextResponse.json({ 
        error: 'Missing environment variables',
        hasSupabaseUrl,
        hasServiceKey
      }, { status: 500 });
    }

    // Test the connection by trying to list users
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      return NextResponse.json({ 
        error: 'Supabase connection failed',
        details: error.message,
        hasSupabaseUrl,
        hasServiceKey,
        supabaseUrlLength: supabaseUrl?.length || 0,
        serviceKeyLength: supabaseServiceKey?.length || 0
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Supabase connection successful',
      userCount: users.users.length,
      hasSupabaseUrl,
      hasServiceKey,
      supabaseUrlLength: supabaseUrl?.length || 0,
      serviceKeyLength: supabaseServiceKey?.length || 0
    });
  } catch (error) {
    console.error('Error in test route:', error);
    return NextResponse.json({ 
      error: 'Test route error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 