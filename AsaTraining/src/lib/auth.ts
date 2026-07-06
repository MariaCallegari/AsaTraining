import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "./db";

async function crearUsuarioDesdeClerk(userId: string) {
  const clerkUser = await clerkClient.users.getUser(userId);
  const email =
    clerkUser.emailAddresses.find(
      (emailAddress) => emailAddress.id === clerkUser.primaryEmailAddressId,
    )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress ?? "";
  const nombre = clerkUser.firstName ?? clerkUser.fullName ?? "Usuario";

  return db.usuario.create({
    data: {
      clerkId: userId,
      nombre,
      email,
      rol: "ALUMNO",
    },
  });
}

/**
 * Devuelve el Usuario de nuestra base de datos correspondiente a la
 * sesión de Clerk activa, o null si no hay sesión.
 *
 * IMPORTANTE: esta es la única fuente confiable de "quién soy" en el
 * servidor. Ninguna vista o API debe aceptar un alumnoId que venga del
 * body/query del cliente sin comparar contra esto.
 */
export async function getUsuarioActual() {
  const { userId } = await auth();
  if (!userId) return null;

  const usuario = await db.usuario.findUnique({ where: { clerkId: userId } });
  if (usuario) return usuario;

  return crearUsuarioDesdeClerk(userId);
}

/**
 * Lanza si el usuario actual no es profesor. Usar al principio de
 * cualquier server action / route handler que edite datos de un alumno.
 */
export async function requireProfesor() {
  const usuario = await getUsuarioActual();
  if (!usuario || usuario.rol !== "PROFESOR") {
    throw new Error("No autorizado: se requiere rol de profesor");
  }
  return usuario;
}

/**
 * Devuelve el usuario actual y valida que, si es alumno, solo esté
 * pidiendo sus propios datos. El profesor puede pedir cualquier id.
 */
export async function requireAccesoARutinaDe(alumnoId: string) {
  const usuario = await getUsuarioActual();
  if (!usuario) throw new Error("No autenticado");

  const esElMismoAlumno = usuario.rol === "ALUMNO" && usuario.id === alumnoId;
  const esProfesor = usuario.rol === "PROFESOR";

  if (!esElMismoAlumno && !esProfesor) {
    throw new Error("No autorizado para ver esta rutina");
  }
  return usuario;
}
