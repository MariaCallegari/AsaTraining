import { requireAccesoARutinaDe } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { alumnoId: string } }
) {
  try {
    // Si un alumno pide el alumnoId de otro, esto tira error y
    // devolvemos 403 antes de tocar la base de datos.
    await requireAccesoARutinaDe(params.alumnoId);
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const rutina = await db.rutinaAlumno.findFirst({
    where: { alumnoId: params.alumnoId, activa: true },
    include: { dias: { include: { ejercicios: { include: { ejercicio: true } } } } },
  });

  return NextResponse.json(rutina ?? null);
}
