'use server';
import { Resend } from 'resend';

const resend = new Resend('RESEND_KEY');

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

export interface Appointment {
  id: string;
  guestId: string;
  guest?: Guest;
  date: string;
  time: string;
  purpose: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'noshow';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const sendVisitorInvitationEmail = async (
  guest: Guest,
  appointment: Appointment
) => {
  try {
    const response = await resend.emails.send({
      to: guest.email,
      from: 'Visitor Management <onboarding@resend.dev>',
      subject: 'Your Visitor Invitation - Visitor Management System',
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Visitor Invitation - Visitor Management System</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .email-header {
            background-color: #4A90E2;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .email-body {
            padding: 30px;
          }
          .invitation-details {
            background-color: #f9f9f9;
            border: 2px dashed #4A90E2;
            padding: 15px;
            text-align: center;
            margin: 20px 0;
            border-radius: 8px;
          }
          .detail-text {
            font-size: 18px;
            color: #4A90E2;
            font-weight: bold;
          }
          .footer {
            background-color: #f4f4f4;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #777;
          }
          .cta-button {
            display: inline-block;
            background-color: #4A90E2;
            color: #fff;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>Visitor Invitation</h1>
          </div>
          
          <div class="email-body">
            <h2>Hello, ${guest.name}</h2>
            
            <p>You have been invited to visit our premises. Below are the details of your appointment:</p>
            
            <div class="invitation-details">
              <p>Date: <span class="detail-text">${appointment.date}</span></p>
              <p>Time: <span class="detail-text">${appointment.time}</span></p>
              <p>Purpose: <span class="detail-text">${
                appointment.purpose
              }</span></p>
            </div>
            
            <p>Please ensure to bring a valid ID for verification upon arrival.</p>
            
            <a href="https://www.yourcompanywebsite.com/visitor-info" class="cta-button">View Visitor Information</a>
            
            <p style="margin-top: 20px;">If you have any questions or need to reschedule, please contact our support team.</p>
          </div>
          
          <div class="footer">
            © ${new Date().getFullYear()} Visitor Management System. All rights reserved.
          </div>
        </div>
      </body>
      </html>
      `,
    });

    return response;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};
