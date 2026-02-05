const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const sgMail = require('@sendgrid/mail');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React build (handles both local and Docker)
const buildPath = process.env.NODE_ENV === 'production'
  ? path.join(__dirname, 'build')
  : path.join(__dirname, '../build');
app.use(express.static(buildPath));

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// API endpoint for email notification
app.post('/api/notify', async (req, res) => {
  const { message, timestamp } = req.body;

  const msg = {
    to: process.env.NOTIFICATION_EMAIL, // Your email to receive notification
    from: process.env.SENDGRID_FROM_EMAIL, // Verified sender email in SendGrid
    subject: '💕 She Said YES! - Valentine Notification',
    text: `Great news!\n\n${message}\n\nTimestamp: ${timestamp}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); padding: 30px; border-radius: 20px; text-align: center;">
          <h1 style="color: #333; font-size: 2.5rem; margin-bottom: 10px;">💕 SHE SAID YES! 💕</h1>
          <p style="font-size: 1.2rem; color: #555;">${message}</p>
          <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.5); margin: 20px 0;">
          <p style="font-size: 0.9rem; color: #777;">Timestamp: ${timestamp}</p>
        </div>
      </div>
    `
  };

  try {
    await sgMail.send(msg);
    console.log('Notification email sent successfully!');
    res.json({ success: true, message: 'Notification sent' });
  } catch (error) {
    console.error('SendGrid Error:', error.response?.body || error.message);
    // Still return success to not alert the user
    res.json({ success: true, message: 'Processed' });
  }
});

// Handle React routing - serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
