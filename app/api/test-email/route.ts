import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Test email API called');
    console.log('🧪 Environment check:', {
      hasResendKey: !!process.env.RESEND_API_KEY,
      adminEmail: process.env.ADMIN_EMAIL || 'admin@intermountaindumpsters.com'
    });

    const { email } = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'Intermountain Dumpsters <orders@intermountaindumpsters.com>',
      to: [email || 'admin@intermountaindumpsters.com'],
      subject: 'Test Email - Intermountain Dumpsters',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email to verify the email system is working.</p>
        <p>Sent at: ${new Date().toLocaleString()}</p>
      `,
    });

    if (error) {
      console.error('❌ Test email error:', error);
      return NextResponse.json({ success: false, error }, { status: 500 });
    }

    console.log('✅ Test email sent successfully:', data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('❌ Test email API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send test email' },
      { status: 500 }
    );
  }
}
