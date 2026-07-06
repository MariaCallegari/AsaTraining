import { requireProfesor } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function PanelProfesorPage() {
  // El middleware ya bloquea esta ruta para no-profesores, pero se
  // vuelve a chequear acá: nunca confiar solo en el middleware.
  await requireProfesor();

  const alumnos = await db.usuario.findMany({
    where: { rol: "ALUMNO" },
    orderBy: { nombre: "asc" },
  });

  return (
    <main style={{ padding: 40 }}>
      <h1>Alumnos</h1>
      <ul>
        {alumnos.map((alumno) => (
          <li key={alumno.id}>
            <Link href={`/dashboard/profesor/alumno/${alumno.id}`}>
              {alumno.nombre} — {alumno.nivel ?? "sin nivel"} /{" "}
              {alumno.frecuencia ?? "sin frecuencia"}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
