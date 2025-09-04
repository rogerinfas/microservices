import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { MailService } from './mail.service';

class SendEmailDto {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    if (!sendEmailDto.to || !sendEmailDto.subject || !sendEmailDto.text) {
      throw new Error('To, subject, and text are required');
    }
    
    await this.mailService.sendEmail(
      sendEmailDto.to,
      sendEmailDto.subject,
      sendEmailDto.text,
      sendEmailDto.html
    );

    return {
      success: true,
      message: 'Correo electrónico enviado exitosamente',
      to: sendEmailDto.to,
      subject: sendEmailDto.subject,
      timestamp: new Date().toISOString()
    };
  }
}
