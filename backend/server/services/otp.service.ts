import { prisma } from '../config/database';
import { AppError } from '../middlewares/error.middleware';
import crypto from 'crypto';
const nodemailer = require('nodemailer');

export class OTPService {
  // ============================================
  // EXISTING METHODS (keep as is)
  // ============================================
  
  // Générer un code OTP à 6 chiffres
  private generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Créer et envoyer un OTP
  async createOTP(email: string, purpose: 'LOGIN' | 'RESET_PASSWORD' | 'CHANGE_EMAIL' | 'CHANGE_PHONE') {
    const code = this.generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Invalider les anciens codes
    await prisma.oTPCode.updateMany({
      where: {
        email,
        purpose,
        used: false,
      },
      data: {
        used: true,
      },
    });

    // Créer le nouveau code
    await prisma.oTPCode.create({
      data: {
        email,
        code,
        purpose,
        expiresAt,
      },
    });

    // Envoyer l'email
    await this.sendOTPEmail(email, code, purpose);

    return { message: 'Code OTP envoyé par email' };
  }

  // Vérifier un OTP
  async verifyOTP(email: string, code: string, purpose: 'LOGIN' | 'RESET_PASSWORD' | 'CHANGE_EMAIL' | 'CHANGE_PHONE') {
    const otpRecord = await prisma.oTPCode.findFirst({
      where: {
        email,
        code,
        purpose,
        used: false,
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    if (!otpRecord) {
      throw new AppError('Code OTP invalide ou expiré', 400);
    }

    // Marquer comme utilisé
    await prisma.oTPCode.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    return true;
  }

  // Envoyer l'email (intégration avec service d'email)
  private async sendOTPEmail(email: string, code: string, purpose: string) {
    console.log(`
    =====================================
    EMAIL OTP ENVOYÉ À: ${email}
    CODE: ${code}
    RAISON: ${purpose}
    =====================================
    `);

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const subject = purpose === 'LOGIN'
        ? 'Code de connexion'
        : purpose === 'RESET_PASSWORD'
        ? 'Réinitialisation de mot de passe'
        : purpose === 'CHANGE_EMAIL'
        ? 'Changement d\'email'
        : 'Changement de téléphone';

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #333; margin-bottom: 20px;">Votre code de vérification</h1>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              Votre code de vérification est:
            </p>
            <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
              <strong style="font-size: 32px; letter-spacing: 5px; color: #4CAF50;">${code}</strong>
            </div>
            <p style="color: #666; font-size: 14px;">
              Ce code expire dans <strong>10 minutes</strong>.
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              Si vous n'avez pas demandé ce code, veuillez ignorer cet email.
            </p>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"Property Management" <noreply@example.com>',
        to: email,
        subject,
        html: htmlContent,
      });

      console.log(`✓ Email OTP envoyé avec succès à ${email}`);
    } catch (error) {
      console.error('Error sending OTP email:', error);
      // Log but don't throw - allow the OTP to be created even if email fails
      // The code will still be logged to console for development
    }
  }

  // ============================================
  // NEW METHODS - ADD THESE BELOW
  // ============================================

  /**
   * Verify OTP without marking as used (for forgot password verification step)
   */
  async verifyOTPWithoutMarking(email: string, code: string, purpose: 'LOGIN' | 'RESET_PASSWORD' | 'CHANGE_EMAIL' | 'CHANGE_PHONE'): Promise<boolean> {
    const otpRecord = await prisma.oTPCode.findFirst({
      where: {
        email,
        code,
        purpose,
        used: false,
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    return !!otpRecord;
  }

  /**
   * Clean up expired and used OTPs
   */
  async cleanExpiredOTPs() {
    const now = new Date();
    
    const result = await prisma.oTPCode.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: now } },
          { used: true },
        ],
      },
    });

    console.log(`Cleaned up ${result.count} expired/used OTP codes`);
    return result;
  }
}
