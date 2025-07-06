import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create a server-side Supabase client with service role key
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    console.log('Received token:', token ? 'Token present' : 'No token');

    // Verify the user is authenticated
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

    const rentalId = parseInt(params.id, 10);
    if (isNaN(rentalId)) {
      return NextResponse.json({ error: 'Invalid rental ID' }, { status: 400 });
    }

    // First, check if the rental exists
    const { data: existingRental, error: fetchError } = await supabaseAdmin
      .from('rentals')
      .select('id, delivered, picked_up, payment_status')
      .eq('id', rentalId)
      .single();

    if (fetchError || !existingRental) {
      console.error('Error fetching rental:', fetchError);
      return NextResponse.json({ error: 'Rental not found' }, { status: 404 });
    }

    // Optional: Add business logic restrictions
    // For example, prevent deletion of active rentals
    if (existingRental.delivered && !existingRental.picked_up) {
      return NextResponse.json({ 
        error: 'Cannot delete an active rental that has been delivered but not picked up' 
      }, { status: 400 });
    }

    // Delete the rental
    const { error: deleteError } = await supabaseAdmin
      .from('rentals')
      .delete()
      .eq('id', rentalId);

    if (deleteError) {
      console.error('Error deleting rental:', deleteError);
      return NextResponse.json({ error: 'Failed to delete rental' }, { status: 500 });
    }

    console.log('Successfully deleted rental:', rentalId);

    return NextResponse.json({ 
      message: 'Rental deleted successfully',
      rentalId: rentalId
    });

  } catch (error) {
    console.error('Error in delete rental API:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 