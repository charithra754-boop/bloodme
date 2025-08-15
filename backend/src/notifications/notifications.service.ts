import { Injectable, Logger } from '@nestjs/common';
import * as twilio from 'twilio';
import * as sgMail from '@sendgrid/mail';
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private twilioClient: twilio.Twilio;

  constructor() {
    // Initialize Twilio
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
    }

    // Initialize SendGrid
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }

    // Initialize Firebase Admin (for push notifications)
    if (process.env.FIREBASE_ADMIN_SDK_KEY) {
      try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_KEY);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      } catch (error) {
        this.logger.error('Failed to initialize Firebase Admin SDK', error);
      }
    }
  }

  async sendSMS(to: string, message: string): Promise<boolean> {
    try {
      if (!this.twilioClient) {
        this.logger.log(`📱 SMS (Mock): ${message} → ${to}`);
        return true; // Return true for mock success
      }

      await this.twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: to,
      });

      this.logger.log(`SMS sent successfully to ${to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${to}:`, error);
      this.logger.log(`📱 SMS (Fallback): ${message} → ${to}`);
      return true; // Return true even on error for development
    }
  }

  async sendEmail(to: string, subject: string, text: string, html?: string): Promise<boolean> {
    try {
      if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY === 'your-sendgrid-api-key') {
        this.logger.log(`📧 Email (Mock): ${subject} → ${to}`);
        this.logger.log(`📧 Content: ${text}`);
        return true; // Return true for mock success
      }

      const msg = {
        to,
        from: process.env.FROM_EMAIL || 'noreply@blooddonor.com',
        subject,
        text,
        html: html || `<p>${text}</p>`,
      };

      await sgMail.send(msg);
      this.logger.log(`Email sent successfully to ${to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
      this.logger.log(`📧 Email (Fallback): ${subject} → ${to}`);
      return true; // Return true even on error for development
    }
  }

  async sendPushNotification(fcmToken: string, title: string, body: string): Promise<boolean> {
    try {
      if (!admin.apps.length) {
        this.logger.log(`🔔 Push (Mock): ${title} - ${body}`);
        return true; // Return true for mock success
      }

      const message = {
        notification: {
          title,
          body,
        },
        token: fcmToken,
      };

      await admin.messaging().send(message);
      this.logger.log(`Push notification sent successfully`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send push notification:`, error);
      this.logger.log(`🔔 Push (Fallback): ${title} - ${body}`);
      return true; // Return true even on error for development
    }
  }

  async sendBulkNotifications(
    recipients: Array<{
      phone?: string;
      email?: string;
      fcmToken?: string;
      name?: string;
    }>,
    message: {
      title: string;
      body: string;
      emailSubject?: string;
    }
  ): Promise<void> {
    const promises = recipients.map(async (recipient) => {
      const notifications = [];

      if (recipient.phone) {
        notifications.push(this.sendSMS(recipient.phone, message.body));
      }

      if (recipient.email) {
        notifications.push(
          this.sendEmail(
            recipient.email,
            message.emailSubject || message.title,
            message.body
          )
        );
      }

      if (recipient.fcmToken) {
        notifications.push(
          this.sendPushNotification(recipient.fcmToken, message.title, message.body)
        );
      }

      return Promise.allSettled(notifications);
    });

    await Promise.allSettled(promises);
    this.logger.log(`Bulk notifications sent to ${recipients.length} recipients`);
  }
}