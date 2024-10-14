import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const AuthForm = ({ onCancel }) => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSuccessfulAuth = () => {
    navigate('/dashboard');
    onCancel(); // Close the auth form after successful login/signup
  };

  return (
    <div className="bg-blue-400 bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-xl max-w-md w-full">
      <h2 className="text-3xl font-bold mb-6 text-white">
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h2>
      {isLogin ? (
        <LoginForm onSuccess={handleSuccessfulAuth} />
      ) : (
        <SignupForm onSuccess={handleSuccessfulAuth} />
      )}
      <div className="mt-4 text-white">
        {isLogin ? (
          <p>
            Don't have an account?{' '}
            <button onClick={() => setIsLogin(false)} className="text-teal-200 hover:text-teal-100">
              Sign up here
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <button onClick={() => setIsLogin(true)} className="text-teal-200 hover:text-teal-100">
              Log in here
            </button>
          </p>
        )}
      </div>
      <button onClick={onCancel} className="mt-4 text-white hover:text-teal-100">
        Back to About
      </button>
    </div>
  );
};

export default AuthForm;