import React from 'react';
import LoginForm from '@/components/auth/login-form';
import { Metadata } from 'next';
import AuthLayout from '../../layout';

export const metadata: Metadata = {
  title: 'Iniciar Sesión | GARD',
  description: 'Acceda a su cuenta de GARD para gestionar su empresa de seguridad',
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
} 