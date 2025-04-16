# GARD SaaS - Frontend

Frontend para el sistema de gestión operativa para empresas de seguridad (GARD SaaS), desarrollado con Next.js 14, TailwindCSS y shadcn/ui.

## Características

- 🎨 Diseño profesional, minimalista, elegante con modo oscuro por defecto
- 🔐 Autenticación completa (Login/Register/Olvido de contraseña)
- 📱 Completamente responsivo (mobile-first)
- ⚡ Transiciones y animaciones con Framer Motion
- 🧩 Componentes reutilizables
- 💻 Dashboard interactivo con widgets
- 🔍 Barra de búsqueda global (Command Palette - ⌘K)
- 🌙 Tema oscuro por defecto

## Tecnologías utilizadas

- [Next.js 14](https://nextjs.org/) - Framework React con App Router
- [TailwindCSS](https://tailwindcss.com/) - Framework CSS utilitario
- [shadcn/ui](https://ui.shadcn.com/) - Componentes de UI reutilizables
- [Framer Motion](https://www.framer.com/motion/) - Biblioteca de animaciones
- [React Hook Form](https://react-hook-form.com/) - Manejo de formularios
- [Zod](https://zod.dev/) - Validación de esquemas

## Instalación

1. Clonar el repositorio
2. Instalar dependencias
```bash
npm install
```
3. Iniciar el servidor de desarrollo
```bash
npm run dev
```
4. Abrir [http://localhost:3000](http://localhost:3000) en el navegador

## Estructura del proyecto

```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/            # Rutas de autenticación
│   │   │   ├── login
│   │   │   ├── register
│   │   │   └── forgot-password
│   │   ├── (dashboard)/       # Rutas del dashboard
│   │   │   ├── dashboard
│   │   │   ├── clients
│   │   │   ├── guards
│   │   │   └── locations
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── auth/              # Componentes de autenticación
│   │   ├── dashboard/         # Componentes del dashboard
│   │   ├── shared/            # Componentes compartidos
│   │   └── ui/                # Componentes de UI (shadcn)
│   └── lib/
│       ├── animations/        # Utilidades de animación
│       └── utils.ts           # Funciones de utilidad
└── ...
```

## Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia la aplicación en modo producción
- `npm run lint` - Ejecuta el linter para verificar errores

## Estado del proyecto

Este proyecto es un MVP (Producto Mínimo Viable) con las funcionalidades básicas implementadas. El backend está en desarrollo separado.
