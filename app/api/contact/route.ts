import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, subject, message } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Insert the message into the database
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone || null,
          subject: subject,
          message: message,
          status: 'new'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error inserting contact message:', error);
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      );
    }

    // Send admin notification email
    try {
      await sendContactNotification({
        id: data.id,
        firstName,
        lastName,
        email,
        phone,
        subject,
        message
      });
    } catch (emailError) {
      console.error('Error sending contact notification email:', emailError);
      // Don't fail the request if email fails, just log the error
    }

    // Return success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully!',
        id: data.id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

interface ContactMessageData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

async function sendContactNotification(contactData: ContactMessageData) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Intermountain Dumpsters <contact@intermountaindumpsters.com>',
      to: [process.env.ADMIN_EMAIL || 'admin@intermountaindumpsters.com'],
      subject: `New Contact Message #${contactData.id} - ${contactData.subject}`,
      html: generateContactEmailHTML(contactData),
    });

    if (error) {
      console.error('Error sending contact notification email:', error);
      throw error;
    }

    console.log('Contact notification email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending contact notification email:', error);
    throw error;
  }
}

function generateContactEmailHTML(contactData: ContactMessageData): string {
  const subjectLabels: { [key: string]: string } = {
    'general': 'General Inquiry',
    'residential': 'Residential Dumpster Rental',
    'commercial': 'Commercial Dumpster Rental',
    'pricing': 'Pricing Question',
    'service-area': 'Service Area Question',
    'booking': 'Booking Assistance',
    'complaint': 'Complaint',
    'other': 'Other'
  };

  const subjectLabel = subjectLabels[contactData.subject] || contactData.subject;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Message</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2d5a27; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .message-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; color: #555; min-width: 120px; }
        .message-content { background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2d5a27; }
        .customer-info { background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .action-button { background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📧 New Contact Message</h1>
        <p>Message #${contactData.id} - ${subjectLabel}</p>
      </div>
      
      <div class="content">
        <div class="customer-info">
          <h3>👤 Customer Information</h3>
          <div class="detail-row">
            <span class="detail-label">Name:</span>
            <span>${contactData.firstName} ${contactData.lastName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Email:</span>
            <span>${contactData.email}</span>
          </div>
          ${contactData.phone ? `
            <div class="detail-row">
              <span class="detail-label">Phone:</span>
              <span>${contactData.phone}</span>
            </div>
          ` : ''}
          <div class="detail-row">
            <span class="detail-label">Subject:</span>
            <span>${subjectLabel}</span>
          </div>
        </div>
        
        <div class="message-details">
          <h3>💬 Message Content</h3>
          <div class="message-content">
            ${contactData.message.replace(/\n/g, '<br>')}
          </div>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="mailto:${contactData.email}" class="action-button">
            Reply to Customer
          </a>
          <br>
          <a href="https://intermountaindumpsters.com/admin/contact-messages" class="action-button">
            View in Admin Panel
          </a>
        </div>
      </div>
      
      <div class="footer">
        <p>This notification was sent automatically when a new contact message was received.</p>
        <p>Message ID: ${contactData.id} | ${new Date().toLocaleString()}</p>
      </div>
    </body>
    </html>
  `;
} 