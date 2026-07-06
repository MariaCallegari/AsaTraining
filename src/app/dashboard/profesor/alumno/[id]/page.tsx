import { requireProfesor } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function EditarRutinaAlumnoPage({
  params,
}: {
  params: { id: string };
}) {
  await requireProfesor();

  const alumno = await db.usuario.findUnique({
    where: { id: params.id, rol: "ALUMNO" },
    include: {
      rutinas: {
        where: { activa: true },
        include: { dias: { include: { ejercicios: { include: { ejercicio: true } } } } },
      },
    },
  });

  if (!alumno) notFound();

  return (
    <main style={{ padding: 40 }}>
      <h1>Rutina de {alumno.nombre}</h1>
      <p>
        Nivel: {alumno.nivel} — Frecuencia: {alumno.frecuencia}
      </p>
      {/* Acá va el formulario de edición: asignar plantilla, agregar
          días, agregar ejercicios con series/repeticiones. Los cambios
          se guardan con una server action que vuelve a llamar a
          requireProfesor() antes de escribir en la base. */}
    </main>
  );
}
