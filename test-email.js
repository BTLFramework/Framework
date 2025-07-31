const { sendWelcomeEmail } = require('./src/services/emailService');

async function testEmail() {
  console.log('🧪 Testing email functionality...');
  
  try {
    const emailData = {
      firstName: 'Spencer',
      email: 'spencerbarber@me.com',
      phase: 'RESET',
      setupLink: 'http://localhost:3000/setup?token=test-token-123'
    };
    
    console.log('📧 Sending test email to:', emailData.email);
    console.log('📧 From:', 'spencerbarberchiro@gmail.com');
    
    const result = await sendWelcomeEmail(emailData);
    
    if (result) {
      console.log('✅ Test email sent successfully!');
      console.log('📬 Check your inbox at spencerbarber@me.com');
    } else {
      console.log('❌ Failed to send test email');
    }
  } catch (error) {
    console.error('❌ Error sending test email:', error.message);
  }
}

testEmail(); 