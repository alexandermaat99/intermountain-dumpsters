#!/usr/bin/env node

/**
 * Test script for contact form email notifications
 * This script sends a test contact message to verify the email notification system
 */

const testContactMessage = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  phone: '555-123-4567',
  subject: 'general',
  message: 'This is a test message to verify that the contact form email notification system is working correctly. The admin should receive an email notification when this message is submitted.'
};

async function testContactEmail() {
  try {
    console.log('🧪 Testing contact form email notification...');
    console.log('📧 Test message data:', testContactMessage);
    
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testContactMessage),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Contact message sent successfully!');
      console.log('📧 Response:', result);
      console.log('📧 Check your admin email for the notification!');
    } else {
      console.error('❌ Failed to send contact message:', result);
    }
  } catch (error) {
    console.error('❌ Error testing contact email:', error);
  }
}

// Run the test
testContactEmail();
