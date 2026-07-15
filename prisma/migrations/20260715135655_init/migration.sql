-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ALUMNO', 'PROFESOR', 'ADMINISTRADOR');

-- CreateEnum
CREATE TYPE "Nivel" AS ENUM ('PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO');

-- CreateEnum
CREATE TYPE "Frecuencia" AS ENUM ('DOS_DIAS', 'TRES_DIAS', 'PASE_LIBRE');

-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "nivel" "Nivel",
    "frecuencia" "Frecuencia",
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ejercicio" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "grupoMuscular" TEXT NOT NULL,

    CONSTRAINT "Ejercicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plantilla" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "nivel" "Nivel" NOT NULL,
    "frecuencia" "Frecuencia" NOT NULL,

    CONSTRAINT "Plantilla_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiaPlantilla" (
    "id" TEXT NOT NULL,
    "plantillaId" TEXT NOT NULL,
    "diaSemana" "DiaSemana" NOT NULL,

    CONSTRAINT "DiaPlantilla_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EjercicioPlantilla" (
    "id" TEXT NOT NULL,
    "diaPlantillaId" TEXT NOT NULL,
    "ejercicioId" TEXT NOT NULL,
    "series" INTEGER NOT NULL,
    "repeticiones" INTEGER NOT NULL,

    CONSTRAINT "EjercicioPlantilla_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RutinaAlumno" (
    "id" TEXT NOT NULL,
    "alumnoId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "creadaEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RutinaAlumno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiaRutina" (
    "id" TEXT NOT NULL,
    "rutinaId" TEXT NOT NULL,
    "diaSemana" "DiaSemana" NOT NULL,

    CONSTRAINT "DiaRutina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EjercicioRutina" (
    "id" TEXT NOT NULL,
    "diaRutinaId" TEXT NOT NULL,
    "ejercicioId" TEXT NOT NULL,
    "series" INTEGER NOT NULL,
    "repeticiones" INTEGER NOT NULL,
    "notas" TEXT,

    CONSTRAINT "EjercicioRutina_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_clerkId_key" ON "Usuario"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "DiaPlantilla" ADD CONSTRAINT "DiaPlantilla_plantillaId_fkey" FOREIGN KEY ("plantillaId") REFERENCES "Plantilla"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EjercicioPlantilla" ADD CONSTRAINT "EjercicioPlantilla_diaPlantillaId_fkey" FOREIGN KEY ("diaPlantillaId") REFERENCES "DiaPlantilla"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EjercicioPlantilla" ADD CONSTRAINT "EjercicioPlantilla_ejercicioId_fkey" FOREIGN KEY ("ejercicioId") REFERENCES "Ejercicio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RutinaAlumno" ADD CONSTRAINT "RutinaAlumno_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaRutina" ADD CONSTRAINT "DiaRutina_rutinaId_fkey" FOREIGN KEY ("rutinaId") REFERENCES "RutinaAlumno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EjercicioRutina" ADD CONSTRAINT "EjercicioRutina_diaRutinaId_fkey" FOREIGN KEY ("diaRutinaId") REFERENCES "DiaRutina"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EjercicioRutina" ADD CONSTRAINT "EjercicioRutina_ejercicioId_fkey" FOREIGN KEY ("ejercicioId") REFERENCES "Ejercicio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
