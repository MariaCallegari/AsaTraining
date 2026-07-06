import { clerkClient } from "@clerk/nextjs/server";
import { db } from "./db";
import type { Rol } from "@prisma/client";

/**
 * Escribe el rol en publicMetadata de Clerk. Esto es lo que lee el
 * middleware (vía sessionClaims) para bloquear rutas sin pegarle a la
 * base de datos en cada request.
 *
 * Nunca exponer esta función detrás de un endpoint que reciba el rol
 * desde el cliente: solo se llama desde onboarding (rol fijo: ALUMNO)
 * o desde un script de administración corrido a mano.
 */
export async function setRolEnClerk(clerkId: string, rol: Rol) {
  const client = await clerkClient();
  await client.users.updateUserMetadata(clerkId, {
    publicMetadata: { rol },
  });
}

/**
 * Da de alta en nuestra base al usuario autenticado si todavía no
 * existe, siempre con rol ALUMNO. Es idempotente: si ya existe, no
 * hace nada y devuelve el registro existente.
 */
export async function asegurarUsuarioAlumno(clerkId: string, email: string, nombre: string) {
  const existente = await db.usuario.findUnique({ where: { clerkId } });
  if (existente) return existente;

  const nuevo = await db.usuario.create({
    data: { clerkId, email, nombre, rol: "ALUMNO" },
  });

  await setRolEnClerk(clerkId, "ALUMNO");
  return nuevo;
}
