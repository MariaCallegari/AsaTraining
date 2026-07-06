/**
 * Uso: npx tsx scripts/asignar-profesor.ts <email>
 *
 * Promueve a un usuario ya registrado a PROFESOR, tanto en la base
 * (Prisma) como en publicMetadata de Clerk. No hay pantalla para esto
 * a propósito: solo vos, como admin, corrés este script.
 */
import { clerkClient } from "@clerk/nextjs/server";
import { db } from "../src/lib/db";

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Uso: npx tsx scripts/asignar-profesor.ts <email>");
    process.exit(1);
  }

  const usuario = await db.usuario.findUnique({ where: { email } });
  if (!usuario) {
    console.error(`No existe ningún usuario con email ${email}. Primero tiene que registrarse.`);
    process.exit(1);
  }

  await db.usuario.update({
    where: { id: usuario.id },
    data: { rol: "PROFESOR" },
  });

  const client = await clerkClient();
  await client.users.updateUserMetadata(usuario.clerkId, {
    publicMetadata: { rol: "PROFESOR" },
  });

  console.log(`${email} ahora es PROFESOR.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
