import { Resend } from 'resend';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export class EmailService {
  private resend: Resend | null = null;

  constructor() {
    if (env.EMAIL_API_KEY) {
      this.resend = new Resend(env.EMAIL_API_KEY);
    } else {
      logger.warn('EMAIL_API_KEY not set — emails will be logged instead of sent');
    }
  }

  async send(options: EmailOptions): Promise<{ id?: string; error?: string }> {
    const { to, subject, html, text, from } = options;

    if (!env.EMAIL_API_KEY || !this.resend) {
      logger.info('EMAIL (dry-run):', { to, subject });
      return { id: 'dry-run' };
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: from || 'Acme <onboarding@resend.dev>',
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        ...(text && { text }),
      });

      if (error) {
        logger.error('Resend send error:', error);
        return { error: error.message };
      }

      logger.info(`Email sent: ${data?.id} — to: ${to}, subject: ${subject}`);
      return { id: data?.id };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Email send exception:', message);
      return { error: message };
    }
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const url = `${env.FRONTEND_URL}/verify-email?token=${token}`;
    await this.send({
      to,
      subject: 'Verify your email',
      html: `<p>Click <a href="${url}">here</a> to verify your email address.</p>`,
    });
  }

  async sendPasswordReset(to: string, token: string): Promise<void> {
    const url = `${env.FRONTEND_URL}/reset-password?token=${token}`;
    await this.send({
      to,
      subject: 'Reset your password',
      html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`,
    });
  }
}

export const emailService = new EmailService();
export default emailService;
