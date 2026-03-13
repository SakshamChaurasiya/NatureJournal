import React from 'react';
import AuthForm from '../components/AuthForm';

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-primary mb-2">Welcome Back to Nature</h1>
        <p className="text-gray-600">Reconnect with yourself.</p>
      </div>
      <AuthForm type="login" />
    </div>
  );
}
