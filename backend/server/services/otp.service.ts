import { prisma } from '../config/database';
import { AppError } from '../middlewares/error.middleware';
import crypto from 'crypto';

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
    // TODO: Intégrer avec Nodemailer, SendGrid, ou autre service
    
    console.log(`
    =====================================
    EMAIL OTP ENVOYÉ À: ${email}
    CODE: ${code}
    RAISON: ${purpose}
    =====================================
    `);

    // Version production avec Nodemailer:
    /*
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const subject = purpose === 'LOGIN' 
      ? 'Code de connexion' 
      : purpose === 'RESET_PASSWORD'
      ? 'Réinitialisation de mot de passe'
      : purpose === 'CHANGE_EMAIL'
      ? 'Changement d\'email'
      : 'Changement de téléphone';

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html: `
        <h1>Votre code de vérification</h1>
        <p>Votre code est: <strong>${code}</strong></p>
        <p>Ce code expire dans 10 minutes.</p>
      `,
    });
    */
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
