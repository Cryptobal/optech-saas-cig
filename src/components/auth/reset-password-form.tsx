"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Esquema de validación
const resetPasswordSchema = z.object({
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    setIsLoading(true);
    
    try {
      // Aquí irá la lógica de restablecimiento de contraseña
      console.log(values);
      
      // Simulamos un delay para demostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mostrar mensaje de éxito
      setPasswordReset(true);
    } catch (error) {
      console.error("Error al restablecer la contraseña:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full shadow-lg border-slate-800/50">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Placeholder para el logo */}
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              GARD
            </div>
          </motion.div>
        </div>
        <CardTitle className="text-2xl font-bold">Restablecer contraseña</CardTitle>
        <CardDescription>Ingrese su nueva contraseña</CardDescription>
      </CardHeader>
      <CardContent>
        {passwordReset ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Contraseña restablecida</AlertTitle>
              <AlertDescription>
                Su contraseña ha sido restablecida exitosamente. 
                Ahora puede iniciar sesión con su nueva contraseña.
              </AlertDescription>
            </Alert>
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                onClick={() => window.location.href = "/login"}
                className="mx-auto"
              >
                Iniciar sesión
              </Button>
            </div>
          </motion.div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nueva contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        autoComplete="new-password"
                        disabled={isLoading}
                        className="bg-slate-900/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        autoComplete="new-password"
                        disabled={isLoading}
                        className="bg-slate-900/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Restableciendo...</span>
                  </div>
                ) : (
                  <span>Restablecer contraseña</span>
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 text-center text-sm text-slate-500">
        <p>¿Recordó su contraseña? <a href="/login" className="text-blue-400 hover:text-blue-300 hover:underline">Iniciar sesión</a></p>
      </CardFooter>
    </Card>
  );
} 