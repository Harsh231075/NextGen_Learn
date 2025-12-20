// src/components/SignupLogin.js
import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, setReferral, selectAuth, clearError } from '../redux/features/authSlice';
import { Mail, Lock, User, Camera, Sparkles } from 'lucide-react';

function SignupLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, isLoading, error, referralCode: storedReferralCode, isRegistered } = useSelector(selectAuth);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    photo: null,
    referralCode: storedReferralCode || '',
  });

  // Check for referral code from URL and sync token state on mount
  useEffect(() => {
    // First, ensure state is clean - check localStorage
    const localToken = localStorage.getItem('token');
    if (!localToken) {
      // If no token in localStorage, ensure Redux state is also cleared
      dispatch(clearError());
    }

    // Then handle referral code
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      dispatch(setReferral(ref));
      setFormData(prev => ({ ...prev, referralCode: ref }));
      setIsLogin(false);
    } else if (storedReferralCode) {
      setFormData(prev => ({ ...prev, referralCode: storedReferralCode }));
    }
  }, [dispatch, storedReferralCode]);

  // Redirect if token exists and handle registration success
  useEffect(() => {
    const localToken = localStorage.getItem('token');
    // Only redirect if we have a valid token in both places
    if (localToken && token) {
      toast.success("Login Successful!");
      navigate("/dashboard");
      return;
    }
    
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (isRegistered) {
      toast.success("Registration Successful!");
      setIsLogin(true);
      dispatch(clearError());
    }
  }, [token, error, navigate, isRegistered, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleTabSwitch = (tab) => {
    setIsLogin(tab);
    dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && !formData.name) {
      toast.error("Name is required for registration!");
      return;
    }

    if (!formData.email || !formData.password) {
      toast.error("Email and password are required!");
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (isLogin) {
      dispatch(loginUser({ email: formData.email, password: formData.password }));
    } else {
      dispatch(registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        photo: formData.photo,
        referralCode: formData.referralCode,
      }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            {isLogin ? "Sign in to continue your learning journey" : "Create an account to get started"}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Tab Switcher */}
          <div className="flex bg-gray-50 p-1">
            <button
              type="button"
              onClick={() => handleTabSwitch(true)}
              className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-300 ${
                isLogin
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch(false)}
              className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-300 ${
                !isLogin
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Register
            </button>
          </div>

          {/* Referral Code Banner */}
          {!isLogin && formData.referralCode && (
            <div className="mx-4 mt-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
              <p className="text-purple-700 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Signing up with referral code: <span className="font-bold">{formData.referralCode}</span>
              </p>
            </div>
          )}

          {/* Form */}
          <form className="p-6 space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-gray-300"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-gray-300"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-gray-300"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {!isLogin && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-gray-300"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Profile Photo (Optional)
                  </label>
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 ${
                isLoading ? 'cursor-wait' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <span>{isLogin ? "Sign In" : "Create Account"}</span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="px-6 pb-6">
            <p className="text-center text-sm text-gray-600">
              {isLogin ? (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleTabSwitch(false)}
                    className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleTabSwitch(true)}
                    className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                  >
                    Sign In
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupLogin;