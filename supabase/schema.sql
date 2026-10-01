-- ==============================================================================
-- TUNDER: PLATAFORMA DE INTERMEDIACIÓN DE PASANTÍAS UNIVERSITARIAS
-- ESQUEMA COMPLETO DE BASE DE DATOS PARA SUPABASE (POSTGRESQL + RLS)
-- ==============================================================================

-- 1. Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: profiles (Perfiles vinculados a auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nombre TEXT NOT NULL,
  rol TEXT NOT NULL CHECK (rol IN ('estudiante', 'empresa', 'universidad')),
  entidad TEXT DEFAULT '',
  
  -- Campos específicos de estudiante
  carrera TEXT DEFAULT '',
  universidad TEXT DEFAULT 'Universidad Mayor de San Andrés (UMSA)',
  semestre TEXT DEFAULT '7mo Semestre',
  disponibilidad TEXT DEFAULT 'Medio Tiempo (Mañanas)',
  modalidad TEXT DEFAULT 'Híbrida',
  habilidades TEXT[] DEFAULT ARRAY[]::TEXT[],
  verificado BOOLEAN DEFAULT false,
  ci TEXT DEFAULT '',
  estado_estudiante TEXT DEFAULT 'Pendiente' CHECK (estado_estudiante IN ('Verificado', 'Pendiente', 'Suspendido')),

  -- Campos específicos de empresa
  nit TEXT DEFAULT '',
  sector TEXT DEFAULT '',
  convenio_estado TEXT DEFAULT 'En Revisión' CHECK (convenio_estado IN ('Validado', 'En Revisión', 'Revocado')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA: internship_offers (Convocatorias de Pasantías)
CREATE TABLE IF NOT EXISTS public.internship_offers (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  empresa_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  titulo TEXT NOT NULL,
  empresa TEXT NOT NULL,
  carrera TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('Medio Tiempo', 'Tiempo Completo')),
  modalidad TEXT NOT NULL,
  validador TEXT DEFAULT 'Convenio Institucional Validado',
  ubicacion TEXT NOT NULL,
  skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  descripcion TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA: applications (Postulaciones de Estudiantes a Convocatorias)
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id BIGINT NOT NULL REFERENCES public.internship_offers(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  estado TEXT NOT NULL DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Aceptado', 'Rechazado')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (offer_id, student_id)
);

-- 5. TABLA: reviews (Reseñas de la Comunidad TUnder)
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  autor TEXT NOT NULL,
  rol TEXT NOT NULL CHECK (rol IN ('estudiante', 'empresa', 'universidad')),
  entidad TEXT NOT NULL,
  calificacion INTEGER NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
  comentario TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- SEGURIDAD: ROW LEVEL SECURITY (RLS)
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS: profiles
-- Cualquiera autenticado o anónimo puede leer perfiles básicos (necesario para ver autores de ofertas, postulantes y reseñas)
CREATE POLICY "Lectura pública de perfiles"
  ON public.profiles FOR SELECT
  USING (true);

-- Cada usuario puede actualizar su propio perfil
CREATE POLICY "Usuarios pueden actualizar su propio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Usuarios con rol universidad pueden actualizar cualquier perfil (para verificar alumnos o convenios)
CREATE POLICY "Universidad puede actualizar cualquier perfil"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND rol = 'universidad'
    )
  );

-- Usuarios con rol universidad pueden eliminar registros si es necesario
CREATE POLICY "Universidad puede eliminar perfiles"
  ON public.profiles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND rol = 'universidad'
    )
  );

-- POLÍTICAS: internship_offers
CREATE POLICY "Lectura pública de ofertas"
  ON public.internship_offers FOR SELECT
  USING (true);

CREATE POLICY "Empresas y universidad pueden insertar ofertas"
  ON public.internship_offers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (rol = 'empresa' OR rol = 'universidad')
    )
  );

CREATE POLICY "Creador de la oferta o universidad puede editarla"
  ON public.internship_offers FOR UPDATE
  USING (
    auth.uid() = empresa_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND rol = 'universidad')
  );

CREATE POLICY "Creador de la oferta o universidad puede eliminarla"
  ON public.internship_offers FOR DELETE
  USING (
    auth.uid() = empresa_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND rol = 'universidad')
  );

-- POLÍTICAS: applications
CREATE POLICY "Estudiantes ven sus postulaciones, empresas ven postulaciones a sus ofertas, universidad ve todas"
  ON public.applications FOR SELECT
  USING (
    auth.uid() = student_id OR
    EXISTS (
      SELECT 1 FROM public.internship_offers o
      WHERE o.id = applications.offer_id AND o.empresa_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.rol = 'universidad'
    )
  );

CREATE POLICY "Estudiantes pueden postularse"
  ON public.applications FOR INSERT
  WITH CHECK (
    auth.uid() = student_id AND
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND rol = 'estudiante'
    )
  );

CREATE POLICY "Empresas dueñas de la oferta y universidad pueden actualizar el estado de postulación"
  ON public.applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.internship_offers o
      WHERE o.id = applications.offer_id AND o.empresa_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.rol = 'universidad'
    )
  );

CREATE POLICY "Estudiante puede cancelar su propia postulación"
  ON public.applications FOR DELETE
  USING (auth.uid() = student_id);

-- POLÍTICAS: reviews
CREATE POLICY "Lectura pública de reseñas"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Usuarios autenticados pueden crear reseñas"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Autor o universidad pueden borrar reseñas"
  ON public.reviews FOR DELETE
  USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND rol = 'universidad')
  );

-- ==============================================================================
-- TRIGGER AUTOMÁTICO: CREACIÓN DE PERFIL AL REGISTRARSE EN AUTH.USERS
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    nombre,
    rol,
    entidad,
    carrera,
    sector,
    verificado,
    estado_estudiante,
    convenio_estado
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombre', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'rol', 'estudiante'),
    COALESCE(NEW.raw_user_meta_data->>'entidad', ''),
    CASE 
      WHEN (NEW.raw_user_meta_data->>'rol') = 'estudiante' THEN COALESCE(NEW.raw_user_meta_data->>'entidad', 'Informática')
      ELSE ''
    END,
    CASE 
      WHEN (NEW.raw_user_meta_data->>'rol') = 'empresa' THEN COALESCE(NEW.raw_user_meta_data->>'entidad', 'Tecnología')
      ELSE ''
    END,
    CASE 
      WHEN (NEW.raw_user_meta_data->>'rol') = 'universidad' THEN true
      ELSE false
    END,
    CASE 
      WHEN (NEW.raw_user_meta_data->>'rol') = 'estudiante' THEN 'Pendiente'
      ELSE 'Verificado'
    END,
    CASE 
      WHEN (NEW.raw_user_meta_data->>'rol') = 'empresa' THEN 'Validado'
      ELSE 'Validado'
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    rol = EXCLUDED.rol,
    entidad = EXCLUDED.entidad;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- HABILITAR REALTIME EN LAS TABLAS PRINCIPALES
-- ==============================================================================
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles, public.internship_offers, public.applications, public.reviews;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END;
END $$;
