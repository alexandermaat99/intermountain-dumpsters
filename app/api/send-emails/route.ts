import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderData {
  id: number;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
  };
  dumpster_type: {
    name: string;
    descriptor: string;
    price: number;
  };
  delivery_address: string;
  delivery_date_requested: string;
  total_amount: number;
  subtotal_amount: number;
  tax_amount: number;
  cancelation_insurance: boolean;
  driveway_insurance: boolean;
  emergency_delivery: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const orderData: OrderData = await request.json();

    // Send customer confirmation email
    const customerEmailResult = await sendOrderConfirmation(orderData);
    
    // Send admin notification email
    const adminEmailResult = await sendAdminNotification(orderData);

    return NextResponse.json({
      success: true,
      customerEmail: customerEmailResult,
      adminEmail: adminEmailResult
    });
  } catch (error) {
    console.error('Error in send-emails API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send emails' },
      { status: 500 }
    );
  }
}

async function sendOrderConfirmation(orderData: OrderData) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Intermountain Dumpsters <orders@intermountaindumpsters.com>',
      to: [orderData.customer.email],
      subject: `Order Confirmation #${orderData.id} - Intermountain Dumpsters`,
      html: generateCustomerEmailHTML(orderData),
    });

    if (error) {
      console.error('Error sending customer confirmation email:', error);
      return { success: false, error };
    }

    console.log('Customer confirmation email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending customer confirmation email:', error);
    return { success: false, error };
  }
}

async function sendAdminNotification(orderData: OrderData) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Intermountain Dumpsters <orders@intermountaindumpsters.com>',
      to: [process.env.ADMIN_EMAIL || 'admin@intermountaindumpsters.com'],
      subject: `New Order #${orderData.id} - ${orderData.customer.first_name} ${orderData.customer.last_name}`,
      html: generateAdminEmailHTML(orderData),
    });

    if (error) {
      console.error('Error sending admin notification email:', error);
      return { success: false, error };
    }

    console.log('Admin notification email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    return { success: false, error };
  }
}

function generateCustomerEmailHTML(orderData: OrderData): string {
  const deliveryDate = new Date(orderData.delivery_date_requested).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2d5a27; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .order-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; color: #555; }
        .total { font-size: 18px; font-weight: bold; color: #2d5a27; background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .insurance { background-color: #fff3cd; padding: 10px; border-radius: 5px; margin: 10px 0; border-left: 4px solid #ffc107; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .contact-info { background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Order Confirmed!</h1>
        <p>Thank you for choosing Intermountain Dumpsters</p>
      </div>
      
      <div class="content">
        <h2>Order #${orderData.id}</h2>
        <p>Dear ${orderData.customer.first_name},</p>
        <p>Your dumpster rental has been successfully confirmed! We're excited to help you with your project.</p>
        
        <div class="order-details">
          <h3>📋 Order Details</h3>
          <div class="detail-row">
            <span class="detail-label">Dumpster Type:</span>
            <span>${orderData.dumpster_type.name} - ${orderData.dumpster_type.descriptor}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Delivery Date:</span>
            <span>${deliveryDate}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Delivery Address:</span>
            <span>${orderData.delivery_address}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Subtotal:</span>
            <span>$${orderData.subtotal_amount.toFixed(2)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Tax:</span>
            <span>$${orderData.tax_amount.toFixed(2)}</span>
          </div>
          <div class="total">
            <div class="detail-row">
              <span class="detail-label">Total Amount:</span>
              <span>$${orderData.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        ${orderData.cancelation_insurance || orderData.driveway_insurance ? `
          <div class="insurance">
            <h4>🛡️ Insurance Coverage</h4>
            ${orderData.cancelation_insurance ? '<p>✅ Cancellation Insurance Included</p>' : ''}
            ${orderData.driveway_insurance ? '<p>✅ Driveway Insurance Included</p>' : ''}
          </div>
        ` : ''}

        ${orderData.emergency_delivery ? `
          <div class="insurance">
            <h4>⚡ Emergency Delivery</h4>
            <p>Your order includes emergency delivery service.</p>
          </div>
        ` : ''}

        <div class="contact-info">
          <h4>📞 Need Help?</h4>
          <p>If you have any questions or need to make changes to your order, please don't hesitate to contact us:</p>
          <p><strong>Phone:</strong> (801) 555-0123</p>
          <p><strong>Email:</strong> info@intermountaindumpsters.com</p>
        </div>

        <h3>🚛 What's Next?</h3>
        <ul>
          <li>We'll contact you 24 hours before delivery to confirm timing</li>
          <li>Our team will deliver your dumpster on ${deliveryDate}</li>
          <li>You'll receive pickup instructions when you're ready</li>
          <li>We'll schedule pickup once you call us</li>
        </ul>
      </div>
      
      <div class="footer">
        <p>Thank you for choosing Intermountain Dumpsters!</p>
        <p>This email was sent to ${orderData.customer.email}</p>
      </div>
    </body>
    </html>
  `;
}

function generateAdminEmailHTML(orderData: OrderData): string {
  const deliveryDate = new Date(orderData.delivery_date_requested).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Notification</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .order-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; color: #555; }
        .total { font-size: 18px; font-weight: bold; color: #dc3545; background-color: #f8d7da; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .customer-info { background-color: #d1ecf1; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .insurance { background-color: #fff3cd; padding: 10px; border-radius: 5px; margin: 10px 0; border-left: 4px solid #ffc107; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🔔 New Order Alert!</h1>
        <p>Order #${orderData.id} - ${orderData.customer.first_name} ${orderData.customer.last_name}</p>
      </div>
      
      <div class="content">
        <div class="customer-info">
          <h3>👤 Customer Information</h3>
          <div class="detail-row">
            <span class="detail-label">Name:</span>
            <span>${orderData.customer.first_name} ${orderData.customer.last_name}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Email:</span>
            <span>${orderData.customer.email}</span>
          </div>
          ${orderData.customer.phone_number ? `
            <div class="detail-row">
              <span class="detail-label">Phone:</span>
              <span>${orderData.customer.phone_number}</span>
            </div>
          ` : ''}
        </div>
        
        <div class="order-details">
          <h3>📋 Order Details</h3>
          <div class="detail-row">
            <span class="detail-label">Dumpster Type:</span>
            <span>${orderData.dumpster_type.name} - ${orderData.dumpster_type.descriptor}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Delivery Date:</span>
            <span>${deliveryDate}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Delivery Address:</span>
            <span>${orderData.delivery_address}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Subtotal:</span>
            <span>$${orderData.subtotal_amount.toFixed(2)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Tax:</span>
            <span>$${orderData.tax_amount.toFixed(2)}</span>
          </div>
          <div class="total">
            <div class="detail-row">
              <span class="detail-label">Total Amount:</span>
              <span>$${orderData.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        ${orderData.cancelation_insurance || orderData.driveway_insurance ? `
          <div class="insurance">
            <h4>🛡️ Insurance Coverage</h4>
            ${orderData.cancelation_insurance ? '<p>✅ Cancellation Insurance</p>' : ''}
            ${orderData.driveway_insurance ? '<p>✅ Driveway Insurance</p>' : ''}
          </div>
        ` : ''}

        ${orderData.emergency_delivery ? `
          <div class="insurance">
            <h4>⚡ Emergency Delivery</h4>
            <p>This order includes emergency delivery service.</p>
          </div>
        ` : ''}

        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/rentals/${orderData.id}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View Order in Admin Panel
          </a>
        </div>
      </div>
      
      <div class="footer">
        <p>This notification was sent automatically when the order was created.</p>
        <p>Order ID: ${orderData.id} | ${new Date().toLocaleString()}</p>
      </div>
    </body>
    </html>
  `;
}
