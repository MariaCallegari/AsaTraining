import { getUsuarioActual } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function RutinaAlumnoPage() {
  const usuario = await getUsuarioActual();
  if (!usuario) redirect("/sign-in");

  // Nunca se recibe el id del alumno desde afuera: siempre es el
  // usuario logueado, así un alumno jamás puede ver la rutina de otro.
  const rutina = await db.rutinaAlumno.findFirst({
    where: { alumnoId: usuario.id, activa: true },
    include: { dias: { include: { ejercicios: { include: { ejercicio: true } } } } },
  });

  if (!rutina) {
    return <p style={{ padding: 40 }}>Todavía no tenés una rutina asignada.</p>;
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>{rutina.nombre}</h1>
      {rutina.dias.map((dia) => (
        <section key={dia.id}>
          <h2>{dia.diaSemana}</h2>
          <ul>
            {dia.ejercicios.map((e) => (
              <li key={e.id}>
                {e.ejercicio.nombre} — {e.series}x{e.repeticiones}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
