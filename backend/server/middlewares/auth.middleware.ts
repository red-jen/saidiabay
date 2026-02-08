import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
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
    // Check for session cookie first (primary method)
    const sessionToken = req.cookies.session;

    if (sessionToken) {
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

      req.userId = session.userId;
      req.userRole = session.user.role;
      return next();
    }

    // Fallback to JWT token (for backwards compatibility)
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token non fourni' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

// Optional authentication - sets userId if user is logged in, but doesn't block if not
export const optionalAuthenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check for session cookie first (primary method)
    const sessionToken = req.cookies.session;

    if (sessionToken) {
      // Verify session token
      const session = await prisma.session.findUnique({
        where: { token: sessionToken },
        include: { user: true },
      });

      if (session && session.expiresAt >= new Date()) {
        // Valid session - set userId
        req.userId = session.userId;
        req.userRole = session.user.role;
        return next();
      }
    }

    // Fallback to JWT token in Authorization header (for frontend API calls)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
          userId: string;
          role: string;
        };

        req.userId = decoded.userId;
        req.userRole = decoded.role;
      } catch (jwtError) {
        // Invalid JWT token - continue without setting userId
        // This is optional auth, so we don't throw an error
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