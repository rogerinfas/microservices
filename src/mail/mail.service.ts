import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(to: string, subject: string, text: string, html?: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        text,
        html: html || text, // Use HTML if provided, otherwise use text
      });
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}
