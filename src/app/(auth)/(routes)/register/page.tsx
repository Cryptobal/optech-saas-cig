import React from 'react';
import RegisterForm from '@/components/auth/register-form';
import { Metadata } from 'next';
import AuthLayout from '../../layout';

export const metadata: Metadata = {
  title: 'Registro | GARD',
  description: 'Crea una cuenta en GARD para gestionar tu empresa de seguridad',
};

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
} 