import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { asegurarUsuarioAlumno } from "@/lib/clerk-admin";

export default async function OnboardingPage() {
  const usuarioClerk = await currentUser();
  if (!usuarioClerk) redirect("/sign-in");

  const email = usuarioClerk.emailAddresses[0]?.emailAddress ?? "";
  const nombre =
    [usuarioClerk.firstName, usuarioClerk.lastName].filter(Boolean).join(" ") ||
    email;

  // Idempotente: si ya existe (por ejemplo, el usuario refrescó la
  // página), no duplica nada.
  await asegurarUsuarioAlumno(usuarioClerk.id, email, nombre);

  // El publicMetadata recién se actualizó en Clerk; la sesión activa
  // todavía puede tener el claim viejo hasta que se refresque, por eso
  // redirigimos a una ruta pública y de ahí el usuario entra de nuevo
  // a /dashboard/alumno con el token ya actualizado.
  redirect("/dashboard/alumno");
}
