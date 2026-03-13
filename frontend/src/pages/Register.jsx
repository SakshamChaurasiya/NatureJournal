import React from 'react';
import AuthForm from '../components/AuthForm';

export default function Register() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-primary mb-2">Start Your Journey</h1>
        <p className="text-gray-600">Document your immersive nature sessions.</p>
      </div>
      <AuthForm type="register" />
    </div>
  );
}
