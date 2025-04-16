import React from 'react';
import ResetPasswordForm from '@/components/auth/reset-password-form';
import { Metadata } from 'next';
import AuthLayout from '../../layout';

export const metadata: Metadata = {
  title: 'Restablecer Contraseña | GARD',
  description: 'Restablece tu contraseña de GARD',
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <ResetPasswordForm />
    </AuthLayout>
  );
} 