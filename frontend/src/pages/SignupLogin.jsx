import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, setReferral, selectAuth } from '../redux/features/authSlice';

function SignupLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, isLoading, error, referralCode: storedReferralCode } = useSelector(selectAuth);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    photo: null,
    referralCode: storedReferralCode || '', // Initialize with stored or URL param
  });

  // Check for referral code from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    console.log(params);
    const ref = params.get('ref');
    console.log(ref);
    if (ref) {
      dispatch(setReferral(ref));
      setFormData(prev => ({ ...prev, referralCode: ref }));
      setIsLogin(false);
    } else if (storedReferralCode) {
      setFormData(prev => ({ ...prev, referralCode: storedReferralCode }));
    }
  }, [dispatch, storedReferralCode]);

  // Redirect if token exists
  useEffect(() => {
    if (token) {
      toast.success("Login Successful!");
      navigate("/dashboard");
    }
    if (error) {
      toast.error(error);
    }
  }, [token, error, navigate]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      photo: null,
      referralCode: storedReferralCode || '',
    });
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <Toaster position="top-right" />
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        {!isLogin && formData.referralCode && (
          <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-purple-700 text-sm">
              Signing up with referral code: <span className="font-semibold">{formData.referralCode}</span>
            </p>
          </div>
        )}

        <div className="flex justify-center gap-6 mb-6">
          <button
            className={`w-1/2 py-2 text-lg font-semibold rounded-lg transition-all ${isLogin ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`w-1/2 py-2 text-lg font-semibold rounded-lg transition-all ${!isLogin ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full px-4 py-2 border rounded-lg focus:border-blue-500 outline-none hover:border-blue-300"
              value={formData.name}
              onChange={handleChange}
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full px-4 py-2 border rounded-lg focus:border-blue-500 outline-none hover:border-blue-300"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:border-blue-500 outline-none hover:border-blue-300"
            value={formData.password}
            onChange={handleChange}
          />
          {!isLogin && (
            <>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full px-4 py-2 border rounded-lg focus:border-blue-500 outline-none hover:border-blue-300"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <input
                type="file"
                name="photo"
                accept="image/*"
                className="w-full px-4 py-2 border rounded-lg focus:border-blue-500 outline-none hover:border-blue-300"
                onChange={handleChange}
              />
            </>
          )}

          <button
            type="submit"
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : (isLogin ? "Login" : "Register")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupLogin;