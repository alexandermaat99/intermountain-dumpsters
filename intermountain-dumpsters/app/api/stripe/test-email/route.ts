import { NextRequest, NextResponse } from 'next/server';
import { sendPaymentConfirmationEmail } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerEmail, stripeCustomerId } = body;

    if (!customerEmail || !stripeCustomerId) {
      return NextResponse.json(
        { error: 'Missing customerEmail or stripeCustomerId' },
        { status: 400 }
      );
    }

    console.log('🧪 Testing email functionality...');
    console.log('📧 Customer Email:', customerEmail);
    console.log('🆔 Stripe Customer ID:', stripeCustomerId);

    const testData = {
      customerEmail,
      customerName: 'Test Customer',
      rentalId: 999,
      totalAmount: 299.99,
      deliveryDate: '2024-01-15',
      deliveryAddress: '123 Test Street, Test City, UT 84101',
      dumpsterType: '10 Yard Dumpster',
      stripeCustomerId,
    };

    const emailSent = await sendPaymentConfirmationEmail(testData);

    if (emailSent) {
      console.log('✅ Test email sent successfully');
      return NextResponse.json({ 
        success: true, 
        message: 'Test email sent successfully',
        customerEmail,
        stripeCustomerId 
      });
    } else {
      console.log('❌ Test email failed to send');
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to send test email',
        customerEmail,
        stripeCustomerId 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Error in test email endpoint:', error);
    return NextResponse.json(
      { error: `Test email failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 