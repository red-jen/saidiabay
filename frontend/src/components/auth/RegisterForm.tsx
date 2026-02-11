'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import { authApi } from '@/lib/api';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/store/authStore';

const RegisterForm = () => {
  const router = useRouter();
  const { login: loginToStore } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await authApi.register(registerData);
      const data = response.data;

      // Backend returns { message, user } — session cookie is set automatically
      const user = data.user;

      if (user) {
        // Store user data in authStore (for UI display only — session cookie handles auth)
        const normalizedRole = user.role === 'ADMIN' ? 'admin' : 'client';
        loginToStore({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: normalizedRole as 'admin' | 'client',
        });

        toast.success(`Bienvenue, ${user.name}! Votre compte a été créé.`);
        router.push('/');
      } else {
        throw new Error('Réponse invalide du serveur');
      }
    } catch (error: any) {
      let message = 'Inscription échouée';
      if (error.response?.data?.details && Array.isArray(error.response.data.details)) {
        message = error.response.data.details.map((d: any) => d.message).join(', ');
      } else {
        message = error.response?.data?.message || error.response?.data?.error || error.message || message;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Create Account
          </h1>
          <p className="text-secondary-600">
            Join us to start exploring amazing properties
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="label">Full Name</label>
            <div className="relative">
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="input pl-10"
              />
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="label">Email Address</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="input pl-10"
              />
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="label">Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+212 6 00 00 00 00"
                className="input pl-10"
              />
              <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input pl-10 pr-10"
              />
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <p className="text-xs text-secondary-500 mt-1">
              Must be at least 6 characters long
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="label">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="input pl-10 pr-10"
              />
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-2 cursor-pointer text-sm">
            <input type="checkbox" required className="mt-1 rounded" />
            <span className="text-secondary-600">
              I agree to the{' '}
              <Link href="/terms" className="text-primary-600 hover:text-primary-700">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary-600 hover:text-primary-700">
                Privacy Policy
              </Link>
            </span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-secondary-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-secondary-500">
              Already have an account?
            </span>
          </div>
        </div>

        {/* Login Link */}
        <Link href="/login" className="btn-outline w-full text-center">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
