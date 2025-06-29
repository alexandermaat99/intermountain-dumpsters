import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create a server-side Supabase client with service role key
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    console.log('Received token:', token ? 'Token present' : 'No token');

    // First, try to verify the user is authenticated
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: `Authentication failed: ${authError.message}` }, { status: 401 });
    }
    
    if (!user) {
      console.error('No user found');
      return NextResponse.json({ error: 'No user found' }, { status: 401 });
    }

    console.log('Authenticated user:', user.email);

    // List all users using the admin client
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    // Return only necessary user information
    const userList = users.users.map(user => ({
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      email_confirmed_at: user.email_confirmed_at,
      role: user.role,
      is_super_admin: user.app_metadata?.provider === 'email' && user.email_confirmed_at
    }));

    console.log('Returning users:', userList.length);
    return NextResponse.json({ users: userList });

  } catch (error) {
    console.error('Error in admin users API:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);

    // Verify the user is authenticated using the service role client
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    console.log('Inviting user:', email);

    // Invite the user using the admin client
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        role: 'admin'
      }
    });

    if (error) {
      console.error('Error inviting user:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log('User invited successfully:', data.user?.email);

    return NextResponse.json({ 
      message: 'Invitation sent successfully',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        created_at: data.user?.created_at
      }
    });
  } catch (error) {
    console.error('Error in admin invite API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 