import bcrypt from "bcryptjs";
import { prisma } from "../config/database";
import { AppError } from "../middlewares/error.middleware";
import { OTPService } from "./otp.service";
import { SessionService } from "./session.service";

const otpService = new OTPService();
const sessionService = new SessionService();

export class AuthService {
  // STEP 1: Login initial (email/username + password)
  async loginStep1(identifier: string, password: string) {
    // Chercher par email ou username
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user) {
      throw new AppError("Identifiants invalides", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Identifiants invalides", 401);
    }

    // Si ADMIN: Envoyer OTP
    if (user.role === "ADMIN") {
      // Toujours envoyer à saidiavibe@gmail.com pour admin
      await otpService.createOTP("saidiavibe@gmail.com", "LOGIN");

      return {
        requiresOTP: true,
        userId: user.id,
        message: "Code OTP envoyé à saidiavibe@gmail.com",
      };
    }

    // Si USER: Créer session directement
    const session = await sessionService.createSession(user.id);

    return {
      requiresOTP: false,
      session: session.token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }

  // STEP 2: Vérifier OTP (ADMIN seulement)
  async loginStep2Admin(userId: string, otpCode: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== "ADMIN") {
      throw new AppError("Accès non autorisé", 403);
    }

    // Vérifier OTP
    await otpService.verifyOTP("saidiavibe@gmail.com", otpCode, "LOGIN");

    // Créer session
    const session = await sessionService.createSession(user.id);

    return {
      session: session.token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }

  // Register
  async register(data: {
    name: string;
    email: string;
    username?: string;
    password: string;
  }) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          ...(data.username ? [{ username: data.username }] : []),
        ],
      },
    });

    if (existingUser) {
      throw new AppError("Email ou nom d'utilisateur déjà utilisé", 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        username: data.username,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
      },
    });

    // Créer session
    const session = await sessionService.createSession(user.id);

    return {
      session: session.token,
      user,
    };
  }

  /**
   * FORGOT PASSWORD - Step 1: Request password reset
   */
  async requestPasswordReset(email: string) {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("Aucun utilisateur trouvé avec cet email", 404);
    }

    // Generate and send OTP
    const otpService = new OTPService();
    await otpService.createOTP(email, "RESET_PASSWORD");

    return { message: "Code envoyé à votre email" };
  }

  /**
   * FORGOT PASSWORD - Step 2: Reset password with OTP
   */
  async resetPassword(email: string, otpCode: string, newPassword: string) {
    // Verify OTP
    const otpService = new OTPService();
    await otpService.verifyOTP(email, otpCode, "RESET_PASSWORD");

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("Utilisateur non trouvé", 404);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and invalidate all sessions
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
      prisma.session.deleteMany({
        where: { userId: user.id },
      }),
    ]);

    return { message: "Mot de passe réinitialisé avec succès" };
  }

  /**
   * PROFILE - Change password (requires current password verification)
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError("Utilisateur non trouvé", 404);
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      throw new AppError("Mot de passe actuel incorrect", 400);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: "Mot de passe modifié avec succès" };
  }

  /**
   * PROFILE - Request email change (Step 1)
   */
  async requestEmailChange(userId: string, newEmail: string) {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail },
    });

    if (existingUser && existingUser.id !== userId) {
      throw new AppError("Cet email est déjà utilisé", 400);
    }

    // Generate and send OTP to NEW email
    const otpService = new OTPService();
    await otpService.createOTP(newEmail, "CHANGE_EMAIL");

    return { message: "Code envoyé au nouvel email" };
  }

  /**
   * PROFILE - Confirm email change (Step 2)
   */
  async confirmEmailChange(userId: string, newEmail: string, otpCode: string) {
    // Verify OTP
    const otpService = new OTPService();
    await otpService.verifyOTP(newEmail, otpCode, "CHANGE_EMAIL");

    // Update email
    const user = await prisma.user.update({
      where: { id: userId },
      data: { email: newEmail },
    });

    return {
      message: "Email modifié avec succès",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  /**
   * PROFILE - Request phone change (Step 1)
   */
  async requestPhoneChange(userId: string, newPhone: string) {
    // Get user's current email
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError("Utilisateur non trouvé", 404);
    }

    // Generate and send OTP to user's current email
    const otpService = new OTPService();
    await otpService.createOTP(user.email, "CHANGE_PHONE");

    return { message: "Code envoyé à votre email" };
  }

  /**
   * PROFILE - Confirm phone change (Step 2)
   */
  async confirmPhoneChange(userId: string, newPhone: string, otpCode: string) {
    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError("Utilisateur non trouvé", 404);
    }

    // Verify OTP using user's email
    const otpService = new OTPService();
    await otpService.verifyOTP(user.email, otpCode, "CHANGE_PHONE");

    // Update phone
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { phone: newPhone },
    });

    return {
      message: "Téléphone modifié avec succès",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        phone: updatedUser.phone,
      },
    };
  }

  // Logout
  async logout(sessionToken: string) {
    await sessionService.deleteSession(sessionToken);
    return { message: "Déconnexion réussie" };
  }

  // Get Profile
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError("Utilisateur non trouvé", 404);
    }

    return user;
  }
}
