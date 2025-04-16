import React from 'react';
import ForgotPasswordForm from '@/components/auth/forgot-password-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recuperar Contraseña | GARD',
  description: 'Recupere su contraseña para acceder a su cuenta de GARD',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
} 