import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Rutas públicas: cualquiera puede entrar sin estar logueado.
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

// Rutas exclusivas del profesor.
const isProfesorRoute = createRouteMatcher(["/dashboard/profesor(.*)"]);

// Requiere sesión, pero no puede exigir rol: es la ruta que ASIGNA
// el rol la primera vez, así que evita el loop de redirect.
const isOnboardingRoute = createRouteMatcher(["/onboarding"]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;

  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (isOnboardingRoute(req)) return;

  // El rol se guarda en publicMetadata al crear el usuario (ver
  // src/lib/clerk-admin.ts). Si todavía no tiene rol asignado, lo
  // mandamos a onboarding en vez de dejarlo pasar.
  const rol = (sessionClaims?.publicMetadata as { rol?: string } | undefined)
    ?.rol;

  if (!rol) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  if (isProfesorRoute(req) && rol !== "PROFESOR") {
    return NextResponse.redirect(new URL("/dashboard/alumno", req.url));
  }

  return;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
