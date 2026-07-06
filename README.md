# Gimnasio App

Sitio para que cada alumno vea su rutina y el profesor administre las rutinas
de todos. Stack: Next.js (TypeScript) + Clerk + PostgreSQL + Prisma.

## Setup

1. Instalar dependencias:
   ```
   npm install
   ```

2. Crear cuenta en https://clerk.com, crear una aplicación, y copiar las
   claves a un archivo `.env` (basado en `.env.example`).

3. Configurar `DATABASE_URL` en `.env` apuntando a tu PostgreSQL (podés usar
   uno local, o un servicio gratuito como Supabase/Neon/Railway).

4. Generar el cliente de Prisma y correr la primera migración:
   ```
   npx prisma migrate dev --name init
   ```

5. Levantar el servidor:
   ```
   npm run dev
   ```

## Estructura

- `prisma/schema.prisma` — modelo de datos: usuarios, rutinas, plantillas,
  ejercicios.
- `middleware.ts` — protege rutas: sin sesión redirige a `/sign-in`, rutas de
  `/dashboard/profesor` solo accesibles con rol `PROFESOR`.
- `src/lib/auth.ts` — funciones de autorización usadas en toda la app.
  **Regla de oro**: nunca confiar en un `alumnoId` que venga del cliente sin
  pasarlo por `requireAccesoARutinaDe` o `requireProfesor`.
- `src/app/dashboard/alumno` — vista de solo lectura de la propia rutina.
- `src/app/dashboard/profesor` — listado de alumnos y edición de sus rutinas.
- `src/app/api/rutinas/[alumnoId]` — ejemplo de API route con el chequeo de
  permisos aplicado.

## Cómo se asignan los roles

- **Alumno**: se registra solo con Clerk. Al entrar por primera vez, el
  middleware lo manda a `/onboarding`, que lo da de alta automáticamente
  como `ALUMNO` (sin nivel/frecuencia todavía).
- **Profesor**: NO es un rol que alguien pueda elegir al registrarse (sería
  un agujero de seguridad: cualquiera se anotaría como profesor y editaría
  rutinas ajenas). Se asigna a mano, una sola vez por profesor, corriendo:
  ```
  npx tsx scripts/asignar-profesor.ts email@delprofe.com
  ```
  (la persona tiene que haberse registrado antes, aunque sea como alumno).

## Pendiente

- Que el profesor pueda cargar/editar nivel y frecuencia de cada alumno
  desde el panel (hoy `dashboard/profesor/alumno/[id]` es solo lectura).
- Formulario para que el profesor asigne una plantilla y edite ejercicios
  (server actions que clonen `Plantilla` → `RutinaAlumno`).
- Seed de ejercicios y plantillas por nivel/frecuencia en
  `prisma/seed.ts`.
- Diseño visual de las páginas (por ahora son solo el esqueleto funcional).
