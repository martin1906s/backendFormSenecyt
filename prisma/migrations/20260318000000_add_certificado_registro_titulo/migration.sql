-- AlterTable: add certificadoRegistroTitulo column
ALTER TABLE "Estudiante" ADD COLUMN IF NOT EXISTS "certificadoRegistroTitulo" TEXT NOT NULL DEFAULT 'NA';
