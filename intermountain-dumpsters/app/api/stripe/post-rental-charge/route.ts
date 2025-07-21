import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📋 Received post-rental-charge request:', JSON.stringify(body, null, 2));
    
    const { rentalId, amount, description, dueDate, sendEmail = true, testEmail = null } = body;

    if (!rentalId || !amount || !description) {
      console.error('❌ Missing required fields:', { rentalId, amount, description });
      return NextResponse.json(
        { error: 'Missing required fields: rentalId, amount, description' },
        { status: 400 }
      );
    }

    // Forward the request to the create-invoice endpoint
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/stripe/create-invoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rentalId,
        amount,
        description,
        dueDate,
        sendEmail,
        testEmail
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Error from create-invoice endpoint:', result);
      return NextResponse.json(
        { error: result.error || 'Failed to create follow-up charge' },
        { status: response.status }
      );
    }

    console.log('✅ Post-rental charge created successfully');
    return NextResponse.json({
      success: true,
      invoiceId: result.invoiceId,
      invoiceUrl: result.invoiceUrl,
      amount: result.amount,
      message: 'Follow-up charge created and sent successfully',
    });

  } catch (error) {
    console.error('❌ Error creating post-rental charge:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: `Failed to create post-rental charge: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 