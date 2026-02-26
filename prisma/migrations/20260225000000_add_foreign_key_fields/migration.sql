-- AlterTable para agregar los campos UUID de claves foráneas si no existen
DO $$ 
BEGIN
    -- Agregar nacionalidadId si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='Estudiante' AND column_name='nacionalidadId') THEN
        ALTER TABLE "Estudiante" ADD COLUMN "nacionalidadId" TEXT;
    END IF;

    -- Agregar puebloId si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='Estudiante' AND column_name='puebloId') THEN
        ALTER TABLE "Estudiante" ADD COLUMN "puebloId" TEXT;
    END IF;

    -- Agregar sectorEconomicoId si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='Estudiante' AND column_name='sectorEconomicoId') THEN
        ALTER TABLE "Estudiante" ADD COLUMN "sectorEconomicoId" TEXT;
    END IF;

    -- Agregar paisNacionalidadId si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='Estudiante' AND column_name='paisNacionalidadId') THEN
        ALTER TABLE "Estudiante" ADD COLUMN "paisNacionalidadId" TEXT;
    END IF;

    -- Agregar cantonNacimientoId si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='Estudiante' AND column_name='cantonNacimientoId') THEN
        ALTER TABLE "Estudiante" ADD COLUMN "cantonNacimientoId" TEXT;
    END IF;

    -- Agregar paisResidenciaId si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='Estudiante' AND column_name='paisResidenciaId') THEN
        ALTER TABLE "Estudiante" ADD COLUMN "paisResidenciaId" TEXT;
    END IF;

    -- Agregar cantonResidenciaId si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='Estudiante' AND column_name='cantonResidenciaId') THEN
        ALTER TABLE "Estudiante" ADD COLUMN "cantonResidenciaId" TEXT;
    END IF;

    -- Agregar provinciaNacimientoId si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='Estudiante' AND column_name='provinciaNacimientoId') THEN
        ALTER TABLE "Estudiante" ADD COLUMN "provinciaNacimientoId" TEXT;
    END IF;

    -- Agregar provinciaResidenciaId si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='Estudiante' AND column_name='provinciaResidenciaId') THEN
        ALTER TABLE "Estudiante" ADD COLUMN "provinciaResidenciaId" TEXT;
    END IF;
END $$;

-- Agregar claves foráneas si no existen
DO $$
BEGIN
    -- FK para nacionalidadId
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Estudiante_nacionalidadId_fkey') THEN
        ALTER TABLE "Estudiante" ADD CONSTRAINT "Estudiante_nacionalidadId_fkey" 
        FOREIGN KEY ("nacionalidadId") REFERENCES "PuebloYNacionalidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    -- FK para puebloId
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Estudiante_puebloId_fkey') THEN
        ALTER TABLE "Estudiante" ADD CONSTRAINT "Estudiante_puebloId_fkey" 
        FOREIGN KEY ("puebloId") REFERENCES "PuebloYNacionalidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    -- FK para sectorEconomicoId
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Estudiante_sectorEconomicoId_fkey') THEN
        ALTER TABLE "Estudiante" ADD CONSTRAINT "Estudiante_sectorEconomicoId_fkey" 
        FOREIGN KEY ("sectorEconomicoId") REFERENCES "SectorEconomico"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    -- FK para paisNacionalidadId
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Estudiante_paisNacionalidadId_fkey') THEN
        ALTER TABLE "Estudiante" ADD CONSTRAINT "Estudiante_paisNacionalidadId_fkey" 
        FOREIGN KEY ("paisNacionalidadId") REFERENCES "Pais"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    -- FK para cantonNacimientoId
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Estudiante_cantonNacimientoId_fkey') THEN
        ALTER TABLE "Estudiante" ADD CONSTRAINT "Estudiante_cantonNacimientoId_fkey" 
        FOREIGN KEY ("cantonNacimientoId") REFERENCES "Canton"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    -- FK para paisResidenciaId
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Estudiante_paisResidenciaId_fkey') THEN
        ALTER TABLE "Estudiante" ADD CONSTRAINT "Estudiante_paisResidenciaId_fkey" 
        FOREIGN KEY ("paisResidenciaId") REFERENCES "Pais"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    -- FK para cantonResidenciaId
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Estudiante_cantonResidenciaId_fkey') THEN
        ALTER TABLE "Estudiante" ADD CONSTRAINT "Estudiante_cantonResidenciaId_fkey" 
        FOREIGN KEY ("cantonResidenciaId") REFERENCES "Canton"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    -- FK para provinciaNacimientoId
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Estudiante_provinciaNacimientoId_fkey') THEN
        ALTER TABLE "Estudiante" ADD CONSTRAINT "Estudiante_provinciaNacimientoId_fkey" 
        FOREIGN KEY ("provinciaNacimientoId") REFERENCES "Provincia"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    -- FK para provinciaResidenciaId
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Estudiante_provinciaResidenciaId_fkey') THEN
        ALTER TABLE "Estudiante" ADD CONSTRAINT "Estudiante_provinciaResidenciaId_fkey" 
        FOREIGN KEY ("provinciaResidenciaId") REFERENCES "Provincia"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
