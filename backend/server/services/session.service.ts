import { prisma } from '../config/database';
import { AppError } from '../middlewares/error.middleware';
import crypto from 'crypto';

export class SessionService {
  // Créer une session
  async createSession(userId: string) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

    const session = await prisma.session.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });

    return session;
  }

  // Valider une session
  async validateSession(token: string) {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session) {
      throw new AppError('Session invalide', 401);
    }

    if (session.expiresAt < new Date()) {
      await this.deleteSession(token);
      throw new AppError('Session expirée', 401);
    }

    // Vérifier inactivité (15 minutes)
    const inactivityLimit = new Date(Date.now() - 15 * 60 * 1000);
    if (session.lastActivity < inactivityLimit) {
      await this.deleteSession(token);
      throw new AppError('Session expirée par inactivité', 401);
    }

    // Mettre à jour lastActivity
    await prisma.session.update({
      where: { id: session.id },
      data: { lastActivity: new Date() },
    });

    return session;
  }

  // Supprimer une session
  async deleteSession(token: string) {
    await prisma.session.delete({
      where: { token },
    });
  }

  // Supprimer toutes les sessions d'un utilisateur
  async deleteAllUserSessions(userId: string) {
    await prisma.session.deleteMany({
      where: { userId },
    });
  }

  // Nettoyer les sessions expirées (à exécuter périodiquement)
  async cleanExpiredSessions() {
    await prisma.session.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { lastActivity: { lt: new Date(Date.now() - 15 * 60 * 1000) } },
        ],
      },
    });
  }
}