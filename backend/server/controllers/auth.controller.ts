import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const authService = new AuthService();

export class AuthController {
  // ============================================
  // EXISTING METHODS
  // ============================================
  
  // Unified Login (handles both USER and ADMIN)
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { identifier, password } = req.body;
      const result = await authService.loginStep1(identifier, password);

      if (result.requiresOTP) {
        return res.json({
          requiresOTP: true,
          userId: result.userId,
          message: result.message,
        });
      }

      this.setSessionCookie(res, result.session!);

      res.json({
        requiresOTP: false,
        message: 'Connexion réussie',
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  }

  async loginStep1(req: Request, res: Response, next: NextFunction) {
    try {
      const { identifier, password } = req.body;
      const result = await authService.loginStep1(identifier, password);

      if (result.requiresOTP) {
        return res.json({
          requiresOTP: true,
          userId: result.userId,
          message: result.message,
        });
      }

      this.setSessionCookie(res, result.session!);

      res.json({
        requiresOTP: false,
        message: 'Connexion réussie',
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  }

  async loginStep2Admin(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, otpCode } = req.body;
      const result = await authService.loginStep2Admin(userId, otpCode);

      this.setSessionCookie(res, result.session);

      res.json({
        message: 'Connexion admin réussie',
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, username, phone, password } = req.body;
      const result = await authService.register({ name, email, username, phone, password });

      this.setSessionCookie(res, result.session);

      res.status(201).json({
        message: 'Inscription réussie',
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await authService.getProfile(req.userId!);
      res.json({ data: user });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const sessionToken = req.cookies.session;
      
      if (sessionToken) {
        await authService.logout(sessionToken);
      }

      res.clearCookie('session', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });

      res.json({ message: 'Déconnexion réussie' });
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // NEW METHODS - FORGOT PASSWORD
  // ============================================

  async requestPasswordReset(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email requis',
        });
      }

      const result = await authService.requestPasswordReset(email);
      
      res.json({
        success: true,
        message: 'Code de confirmation envoyé à votre email',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otpCode, newPassword } = req.body;
      
      if (!email || !otpCode || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Tous les champs sont requis',
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Le mot de passe doit contenir au moins 6 caractères',
        });
      }

      const result = await authService.resetPassword(email, otpCode, newPassword);
      
      res.json({
        success: true,
        message: 'Mot de passe réinitialisé avec succès',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // NEW METHODS - PROFILE UPDATES
  // ============================================

  async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.userId!;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Mot de passe actuel et nouveau requis',
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Le mot de passe doit contenir au moins 6 caractères',
        });
      }

      const result = await authService.changePassword(userId, currentPassword, newPassword);
      
      res.json({
        success: true,
        message: 'Mot de passe modifié avec succès',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async requestEmailChange(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { newEmail } = req.body;
      const userId = req.userId!;
      
      if (!newEmail) {
        return res.status(400).json({
          success: false,
          message: 'Nouvel email requis',
        });
      }

      const result = await authService.requestEmailChange(userId, newEmail);
      
      res.json({
        success: true,
        message: 'Code envoyé à votre nouvel email',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async confirmEmailChange(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { newEmail, otpCode } = req.body;
      const userId = req.userId!;
      
      if (!newEmail || !otpCode) {
        return res.status(400).json({
          success: false,
          message: 'Email et code requis',
        });
      }

      const result = await authService.confirmEmailChange(userId, newEmail, otpCode);
      
      res.json({
        success: true,
        message: 'Email modifié avec succès',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async requestPhoneChange(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { newPhone } = req.body;
      const userId = req.userId!;
      
      if (!newPhone) {
        return res.status(400).json({
          success: false,
          message: 'Nouveau téléphone requis',
        });
      }

      const result = await authService.requestPhoneChange(userId, newPhone);
      
      res.json({
        success: true,
        message: 'Code envoyé à votre email',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async confirmPhoneChange(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { newPhone, otpCode } = req.body;
      const userId = req.userId!;
      
      if (!newPhone || !otpCode) {
        return res.status(400).json({
          success: false,
          message: 'Téléphone et code requis',
        });
      }

      const result = await authService.confirmPhoneChange(userId, newPhone, otpCode);
      
      res.json({
        success: true,
        message: 'Téléphone modifié avec succès',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // HELPER METHOD
  // ============================================
  
  private setSessionCookie(res: Response, sessionToken: string) {
    res.cookie('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 heures
      path: '/', // Ensure cookie is available for all paths
    });
  }
}