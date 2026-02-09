'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import { authApi } from '@/lib/api';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/store/authStore';

// Backend admin dashboard URL (Next.js app running on port 3000)
const ADMIN_DASHBOARD_URL = process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3000/dashboard';

const LoginForm = () => {
  const router = useRouter();
  const { login: loginToStore, setUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // OTP state
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [userId, setUserId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authApi.login(formData);
      const data = response.data;

      // Check if OTP is required (admin users)
      if (data.requiresOTP) {
        setUserId(data.userId);
        setOtpStep(true);
        toast.info(data.message || 'OTP code sent to your email');
      setLoading(false);
      return;
    }

      // Direct login (non-admin users) - extract token and user
      // Backend may use session-based auth (cookies) instead of JWT tokens
      const responseData = data.data || data;
      const token = responseData?.token || data?.token || responseData?.accessToken;
      const user = responseData?.user || data?.user;

      // For regular users, backend might not return token (uses session cookies)
      // If we have user data, proceed with login
      if (user) {
        // Store token if provided, otherwise rely on session cookies
        if (token) {
          Cookies.set('token', token, { expires: 7 });
        }
        handleLoginSuccess(token || '', user);
      } else {
        throw new Error('Invalid response from server: Missing user data');
      }
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authApi.verifyOtp({ userId, otpCode });
      const data = response.data;

      const user = data.user;
      const token = data.token;

      if (user) {
        // Store user in localStorage (matching backend's session approach)
        localStorage.setItem(
          'user',
          JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          })
        );

        // Also store token if provided
        if (token) {
      Cookies.set('token', token, { expires: 7 });
        }

      toast.success(`Welcome back, ${user.name || user.email}!`);

      // Redirect based on role
        if (user.role === 'ADMIN' || user.role === 'admin') {
          // Redirect to backend admin dashboard (port 3000)
          window.location.href = ADMIN_DASHBOARD_URL;
        } else {
          router.push('/');
        }
      } else {
        throw new Error('Invalid OTP verification response');
      }
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (token: string | null, user: any) => {
    // Normalize user role (backend might return 'USER' or 'ADMIN', frontend expects 'client' or 'admin')
    const normalizedRole = 
      user.role === 'ADMIN' || user.role === 'admin' ? 'admin' : 
      user.role === 'USER' || user.role === 'client' ? 'client' : 
      'client';

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: normalizedRole as 'admin' | 'client',
    };

    // Store in authStore (which also persists to localStorage)
    if (token) {
      loginToStore(userData, token);
    } else {
      // For session-based auth, just set user without token
      setUser(userData);
    }

    // Also store in localStorage for compatibility
    localStorage.setItem('user', JSON.stringify(userData));

    toast.success(`Welcome back, ${user.name || user.email}!`);

    // Redirect based on role
    if (normalizedRole === 'admin') {
      // Redirect to backend admin dashboard (port 3000)
      window.location.href = ADMIN_DASHBOARD_URL;
    } else {
      router.push('/');
    }
  };

  const handleError = (error: any) => {
      let message = 'Login failed';

    if (error.response) {
      const errorData = error.response.data;

      // Handle validation errors with details array
      if (errorData?.details && Array.isArray(errorData.details) && errorData.details.length > 0) {
        message = errorData.details.map((d: any) => d.message).join(', ');
      } else {
        message =
          errorData?.message ||
          errorData?.error ||
          errorData?.errors?.[0]?.message ||
                 `Server error: ${error.response.status}`;
      }
      } else if (error.request) {
        message = 'Unable to connect to server. Please check if the backend is running.';
      } else {
        message = error.message || 'An unexpected error occurred';
      }
      
      toast.error(message);
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
            {otpStep ? 'Verify OTP' : 'Welcome Back'}
          </h1>
          <p className="text-secondary-600">
            {otpStep
              ? 'Enter the verification code sent to your email'
              : 'Sign in to access your account'}
          </p>
        </div>

        {!otpStep ? (
          /* Step 1: Email & Password */
        <form onSubmit={handleSubmit} className="space-y-6">
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
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded" />
              <span className="text-secondary-600">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        ) : (
          /* Step 2: OTP Verification */
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <label className="label">Verification Code</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  autoFocus
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  className="input pl-10 text-center text-lg tracking-widest"
                />
                <FiShield className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
              </div>
              <p className="text-xs text-secondary-500 mt-2">
                The code is valid for 10 minutes
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || otpCode.length !== 6}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>

            {/* Back button */}
            <button
              type="button"
              onClick={() => {
                setOtpStep(false);
                setOtpCode('');
                setUserId('');
              }}
              className="w-full text-center text-sm text-secondary-600 hover:text-secondary-800"
            >
              ← Back to login
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-secondary-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-secondary-500">
              Don&apos;t have an account?
            </span>
          </div>
        </div>

        {/* Register Link */}
        <Link href="/register" className="btn-outline w-full text-center">
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
