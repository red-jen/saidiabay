const nodemailer = require('nodemailer');

interface ReservationEmailData {
  propertyTitle: string;
  propertyAddress: string;
  cityName: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  guestCountry?: string;
  userName?: string;
  userEmail?: string;
  startDate: Date;
  endDate: Date;
  nights: number;
  totalPrice: number;
  status: string;
}

interface LeadEmailData {
  propertyTitle: string;
  propertyAddress: string;
  propertyType: string;
  propertyPrice: number;
  cityName: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  guestCountry?: string;
  userName?: string;
  userEmail?: string;
  message?: string;
  status: string;
}

export class EmailService {
  private transporter: any;

  constructor() {
    // Configure email transporter
    // In production, use environment variables for email configuration
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendReservationNotification(data: ReservationEmailData): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';

    const contactInfo = data.userName
      ? `
        <h3>User Information:</h3>
        <p><strong>Name:</strong> ${data.userName}</p>
        <p><strong>Email:</strong> ${data.userEmail}</p>
        <p><em>(Registered user)</em></p>
      `
      : `
        <h3>Guest Information:</h3>
        <p><strong>Name:</strong> ${data.guestName || 'N/A'}</p>
        <p><strong>Email:</strong> ${data.guestEmail || 'N/A'}</p>
        <p><strong>Phone:</strong> ${data.guestPhone || 'N/A'}</p>
        <p><strong>Country:</strong> ${data.guestCountry || 'N/A'}</p>
      `;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
          New Reservation Received
        </h2>

        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Property Details:</h3>
          <p><strong>Property:</strong> ${data.propertyTitle}</p>
          <p><strong>Address:</strong> ${data.propertyAddress}</p>
          <p><strong>City:</strong> ${data.cityName}</p>
        </div>

        <div style="background-color: #fff3cd; padding: 20px; border-radius: 5px; margin: 20px 0;">
          ${contactInfo}
        </div>

        <div style="background-color: #d1ecf1; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Reservation Details:</h3>
          <p><strong>Check-in:</strong> ${new Date(data.startDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
          <p><strong>Check-out:</strong> ${new Date(data.endDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
          <p><strong>Number of Nights:</strong> ${data.nights}</p>
          <p><strong>Total Price:</strong> $${data.totalPrice.toFixed(2)}</p>
          <p><strong>Status:</strong> <span style="color: #ff9800; font-weight: bold;">${data.status}</span></p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
          <p>This is an automated notification from your property management system.</p>
          <p>Please log in to your admin dashboard to review and manage this reservation.</p>
        </div>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"Property Management" <noreply@example.com>',
        to: adminEmail,
        subject: `New Reservation: ${data.propertyTitle}`,
        html: htmlContent,
      });
    } catch (error) {
      console.error('Error sending reservation notification email:', error);
      // Don't throw error - email failure shouldn't break the reservation flow
    }
  }

  async sendLeadNotification(data: LeadEmailData): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';

    const contactInfo = data.userName
      ? `
        <h3>User Information:</h3>
        <p><strong>Name:</strong> ${data.userName}</p>
        <p><strong>Email:</strong> ${data.userEmail}</p>
        <p><em>(Registered user)</em></p>
      `
      : `
        <h3>Interested Party Information:</h3>
        <p><strong>Name:</strong> ${data.guestName || 'N/A'}</p>
        <p><strong>Email:</strong> ${data.guestEmail || 'N/A'}</p>
        <p><strong>Phone:</strong> ${data.guestPhone || 'N/A'}</p>
        <p><strong>Country:</strong> ${data.guestCountry || 'N/A'}</p>
      `;

    const messageSection = data.message
      ? `
        <div style="background-color: #f0f0f0; padding: 15px; border-left: 4px solid #2196F3; margin: 20px 0;">
          <h4 style="margin-top: 0;">Message:</h4>
          <p style="white-space: pre-wrap;">${data.message}</p>
        </div>
      `
      : '';

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #2196F3; padding-bottom: 10px;">
          New Lead: Property Interest
        </h2>

        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Property Details:</h3>
          <p><strong>Property:</strong> ${data.propertyTitle}</p>
          <p><strong>Address:</strong> ${data.propertyAddress}</p>
          <p><strong>City:</strong> ${data.cityName}</p>
          <p><strong>Type:</strong> ${data.propertyType}</p>
          <p><strong>Price:</strong> $${data.propertyPrice.toFixed(2)}</p>
        </div>

        <div style="background-color: #fff3cd; padding: 20px; border-radius: 5px; margin: 20px 0;">
          ${contactInfo}
        </div>

        ${messageSection}

        <div style="background-color: #d4edda; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Lead Status:</strong> <span style="color: #28a745; font-weight: bold;">${data.status}</span></p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
          <p>This is an automated notification from your property management system.</p>
          <p>Please log in to your admin dashboard to follow up with this lead.</p>
        </div>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"Property Management" <noreply@example.com>',
        to: adminEmail,
        subject: `New Lead: ${data.propertyTitle} - ${data.propertyType}`,
        html: htmlContent,
      });
    } catch (error) {
      console.error('Error sending lead notification email:', error);
      // Don't throw error - email failure shouldn't break the lead creation flow
    }
  }
}
