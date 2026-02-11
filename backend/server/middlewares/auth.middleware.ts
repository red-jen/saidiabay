import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionToken = req.cookies.session;

    if (!sessionToken) {
      return res.status(401).json({ error: 'Non authentifié — aucune session' });
    }

    // Verify session token
    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: { user: true },
    });

    if (!session) {
      return res.status(401).json({ error: 'Session invalide' });
    }

    if (session.expiresAt < new Date()) {
      // Delete expired session
      await prisma.session.delete({ where: { id: session.id } });
      return res.status(401).json({ error: 'Session expirée' });
    }

    // Update lastActivity
    await prisma.session.update({
      where: { id: session.id },
      data: { lastActivity: new Date() },
    });

    req.userId = session.userId;
    req.userRole = session.user.role;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Erreur d\'authentification' });
  }
};

// Optional authentication - sets userId if user is logged in, but doesn't block if not
export const optionalAuthenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionToken = req.cookies.session;

    if (sessionToken) {
      const session = await prisma.session.findUnique({
        where: { token: sessionToken },
        include: { user: true },
      });

      if (session && session.expiresAt >= new Date()) {
        // Valid session - set userId
        req.userId = session.userId;
        req.userRole = session.user.role;

        // Update lastActivity
        await prisma.session.update({
          where: { id: session.id },
          data: { lastActivity: new Date() },
        });
      }
    }

    // Continue regardless of authentication status
    next();
  } catch (error) {
    // On error, just continue without setting userId
    next();
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.userRole !== 'ADMIN') {
    return res.status(403).json({ error: 'Accès administrateur requis' });
  }
  next();
};
