ALTER TABLE "Estudiante" ADD COLUMN IF NOT EXISTS "contactoEmergenciaNombre" TEXT NOT NULL DEFAULT 'NA';
ALTER TABLE "Estudiante" ADD COLUMN IF NOT EXISTS "contactoEmergenciaParentesco" TEXT NOT NULL DEFAULT 'NA';
ALTER TABLE "Estudiante" ADD COLUMN IF NOT EXISTS "contactoEmergenciaTelefono" TEXT NOT NULL DEFAULT 'NA';
ALTER TABLE "Estudiante" ADD COLUMN IF NOT EXISTS "contactoEmergenciaCorreo" TEXT NOT NULL DEFAULT 'NA';
