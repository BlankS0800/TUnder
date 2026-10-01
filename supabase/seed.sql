-- ==============================================================================
-- TUNDER: DATOS SEMILLA (SEED DATA) COMPLETOS PARA SUPABASE
-- Incluye: Usuarios de autenticación (auth.users con pass: 123),
-- Perfiles (profiles), Ofertas de Pasantías, Postulaciones y Reseñas.
-- Ejecutar en el SQL Editor de Supabase después de ejecutar schema.sql
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. USUARIOS EN AUTH.USERS (Contraseña para todos: 123)
-- ==============================================================================
-- UUIDs fijos para mantener integridad referencial con profiles y offers
-- Estudiante 1 (Mikaela): a1111111-1111-1111-1111-111111111111
-- Estudiante 2 (Rodrigo): a2222222-2222-2222-2222-222222222222
-- Estudiante 3 (Camila):  a3333333-3333-3333-3333-333333333333
-- Estudiante 4 (Andrés):  a4444444-4444-4444-4444-444444444444
-- Empresa 1 (Tech S.R.L.): b1111111-1111-1111-1111-111111111111
-- Empresa 2 (Banco):      b2222222-2222-2222-2222-222222222222
-- Empresa 3 (Logística):  b3333333-3333-3333-3333-333333333333
-- Empresa 4 (Alfa):       b4444444-4444-4444-4444-444444444444
-- Universidad (UMSA):     c1111111-1111-1111-1111-111111111111

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
)
VALUES
-- Estudiante Principal
(
  '00000000-0000-0000-0000-000000000000',
  'a1111111-1111-1111-1111-111111111111',
  'authenticated',
  'authenticated',
  'estudiante@gmail.com',
  crypt('123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"nombre":"Mikaela Mendoza","rol":"estudiante","entidad":"UMSA - Informática"}',
  NOW(),
  NOW(), '', '', '', ''
),
-- Empresa Principal
(
  '00000000-0000-0000-0000-000000000000',
  'b1111111-1111-1111-1111-111111111111',
  'authenticated',
  'authenticated',
  'empresa@gmail.com',
  crypt('123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"nombre":"Tech S.R.L.","rol":"empresa","entidad":"Sector Tecnológico La Paz"}',
  NOW(),
  NOW(), '', '', '', ''
),
-- Universidad Principal
(
  '00000000-0000-0000-0000-000000000000',
  'c1111111-1111-1111-1111-111111111111',
  'authenticated',
  'authenticated',
  'convenios@gmail.com',
  crypt('123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"nombre":"Dirección de Carrera","rol":"universidad","entidad":"UMSA"}',
  NOW(),
  NOW(), '', '', '', ''
),
-- Otros Estudiantes
(
  '00000000-0000-0000-0000-000000000000',
  'a2222222-2222-2222-2222-222222222222',
  'authenticated',
  'authenticated',
  'rodrigo@gmail.com',
  crypt('123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"nombre":"Rodrigo Flores","rol":"estudiante","entidad":"UMSA - Economía"}',
  NOW(),
  NOW(), '', '', '', ''
),
(
  '00000000-0000-0000-0000-000000000000',
  'a3333333-3333-3333-3333-333333333333',
  'authenticated',
  'authenticated',
  'camila@gmail.com',
  crypt('123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"nombre":"Camila Quispe","rol":"estudiante","entidad":"UMSA - Ing. Industrial"}',
  NOW(),
  NOW(), '', '', '', ''
),
(
  '00000000-0000-0000-0000-000000000000',
  'a4444444-4444-4444-4444-444444444444',
  'authenticated',
  'authenticated',
  'andres@gmail.com',
  crypt('123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"nombre":"Andrés Morales","rol":"estudiante","entidad":"UMSA - Informática"}',
  NOW(),
  NOW(), '', '', '', ''
),
-- Otras Empresas
(
  '00000000-0000-0000-0000-000000000000',
  'b2222222-2222-2222-2222-222222222222',
  'authenticated',
  'authenticated',
  'banco@gmail.com',
  crypt('123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"nombre":"Banco de Inversión Andino","rol":"empresa","entidad":"Finanzas"}',
  NOW(),
  NOW(), '', '', '', ''
),
(
  '00000000-0000-0000-0000-000000000000',
  'b3333333-3333-3333-3333-333333333333',
  'authenticated',
  'authenticated',
  'logistica@gmail.com',
  crypt('123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"nombre":"Logística Boliviana S.A.","rol":"empresa","entidad":"Operaciones"}',
  NOW(),
  NOW(), '', '', '', ''
),
(
  '00000000-0000-0000-0000-000000000000',
  'b4444444-4444-4444-4444-444444444444',
  'authenticated',
  'authenticated',
  'consultores@gmail.com',
  crypt('123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"nombre":"Consultores Alfa","rol":"empresa","entidad":"Auditoría"}',
  NOW(),
  NOW(), '', '', '', ''
)
ON CONFLICT (id) DO UPDATE SET
  encrypted_password = EXCLUDED.encrypted_password,
  raw_user_meta_data = EXCLUDED.raw_user_meta_data;

-- Identidades para soporte de inicio de sesión con email en Supabase Auth
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', '{"sub":"a1111111-1111-1111-1111-111111111111","email":"estudiante@gmail.com"}'::jsonb, 'email', 'estudiante@gmail.com', NOW(), NOW(), NOW()),
  ('b1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', '{"sub":"b1111111-1111-1111-1111-111111111111","email":"empresa@gmail.com"}'::jsonb, 'email', 'empresa@gmail.com', NOW(), NOW(), NOW()),
  ('c1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', '{"sub":"c1111111-1111-1111-1111-111111111111","email":"convenios@gmail.com"}'::jsonb, 'email', 'convenios@gmail.com', NOW(), NOW(), NOW()),
  ('a2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', '{"sub":"a2222222-2222-2222-2222-222222222222","email":"rodrigo@gmail.com"}'::jsonb, 'email', 'rodrigo@gmail.com', NOW(), NOW(), NOW()),
  ('a3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', '{"sub":"a3333333-3333-3333-3333-333333333333","email":"camila@gmail.com"}'::jsonb, 'email', 'camila@gmail.com', NOW(), NOW(), NOW()),
  ('a4444444-4444-4444-4444-444444444444', 'a4444444-4444-4444-4444-444444444444', '{"sub":"a4444444-4444-4444-4444-444444444444","email":"andres@gmail.com"}'::jsonb, 'email', 'andres@gmail.com', NOW(), NOW(), NOW()),
  ('b2222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', '{"sub":"b2222222-2222-2222-2222-222222222222","email":"banco@gmail.com"}'::jsonb, 'email', 'banco@gmail.com', NOW(), NOW(), NOW()),
  ('b3333333-3333-3333-3333-333333333333', 'b3333333-3333-3333-3333-333333333333', '{"sub":"b3333333-3333-3333-3333-333333333333","email":"logistica@gmail.com"}'::jsonb, 'email', 'logistica@gmail.com', NOW(), NOW(), NOW()),
  ('b4444444-4444-4444-4444-444444444444', 'b4444444-4444-4444-4444-444444444444', '{"sub":"b4444444-4444-4444-4444-444444444444","email":"consultores@gmail.com"}'::jsonb, 'email', 'consultores@gmail.com', NOW(), NOW(), NOW())
ON CONFLICT (provider, provider_id) DO NOTHING;

-- ==============================================================================
-- 2. PERFILES EN PUBLIC.PROFILES CON METADATOS COMPLETOS
-- ==============================================================================
INSERT INTO public.profiles (
  id, email, nombre, rol, entidad, carrera, universidad, semestre, disponibilidad, modalidad, habilidades, verificado, ci, estado_estudiante, nit, sector, convenio_estado
)
VALUES
-- Estudiante 1 (Mikaela)
(
  'a1111111-1111-1111-1111-111111111111',
  'estudiante@gmail.com',
  'Mikaela Mendoza',
  'estudiante',
  'UMSA - Informática',
  'Informática',
  'Universidad Mayor de San Andrés (UMSA)',
  '8vo Semestre',
  'Medio Tiempo (Mañanas 08:00 - 12:00)',
  'Híbrida',
  ARRAY['React', 'TypeScript', 'Bases de Datos SQL', 'Tailwind CSS', 'Git & GitHub'],
  true,
  '9845124 LP',
  'Verificado',
  '', '', 'Validado'
),
-- Estudiante 2 (Rodrigo)
(
  'a2222222-2222-2222-2222-222222222222',
  'rodrigo@gmail.com',
  'Rodrigo Flores',
  'estudiante',
  'UMSA - Economía',
  'Economía',
  'Universidad Mayor de San Andrés (UMSA)',
  '7mo Semestre',
  'Medio Tiempo (Tardes 14:00 - 18:00)',
  'Presencial',
  ARRAY['Excel Avanzado', 'Modelado Financiero', 'Power BI'],
  false,
  '8741203 LP',
  'Pendiente',
  '', '', 'Validado'
),
-- Estudiante 3 (Camila)
(
  'a3333333-3333-3333-3333-333333333333',
  'camila@gmail.com',
  'Camila Quispe',
  'estudiante',
  'UMSA - Ing. Industrial',
  'Ingeniería Industrial',
  'Universidad Mayor de San Andrés (UMSA)',
  '9no Semestre',
  'Tiempo Completo (Horario Flexible)',
  'Presencial',
  ARRAY['Control de Calidad', 'Mapeo de Procesos', 'Lean Logistics'],
  true,
  '1029384 LP',
  'Verificado',
  '', '', 'Validado'
),
-- Estudiante 4 (Andrés)
(
  'a4444444-4444-4444-4444-444444444444',
  'andres@gmail.com',
  'Andrés Morales',
  'estudiante',
  'UMSA - Informática',
  'Informática',
  'Universidad Mayor de San Andrés (UMSA)',
  '6to Semestre',
  'Por Horas / Fines de Semana',
  'Remoto',
  ARRAY['Python', 'SQL', 'Git'],
  false,
  '7451290 LP',
  'Suspendido',
  '', '', 'Validado'
),
-- Empresa 1 (Tech S.R.L.)
(
  'b1111111-1111-1111-1111-111111111111',
  'empresa@gmail.com',
  'Tech S.R.L.',
  'empresa',
  'Sector Tecnológico La Paz',
  '', '', '', '', '',
  ARRAY[]::TEXT[],
  true, '', 'Verificado',
  '492819024',
  'Tecnología',
  'Validado'
),
-- Empresa 2 (Banco)
(
  'b2222222-2222-2222-2222-222222222222',
  'banco@gmail.com',
  'Banco de Inversión Andino',
  'empresa',
  'Sector Bancario La Paz',
  '', '', '', '', '',
  ARRAY[]::TEXT[],
  true, '', 'Verificado',
  '102938472',
  'Finanzas',
  'Validado'
),
-- Empresa 3 (Logística)
(
  'b3333333-3333-3333-3333-333333333333',
  'logistica@gmail.com',
  'Logística Boliviana S.A.',
  'empresa',
  'Parque Industrial El Alto',
  '', '', '', '', '',
  ARRAY[]::TEXT[],
  false, '', 'Pendiente',
  '883920194',
  'Operaciones',
  'En Revisión'
),
-- Empresa 4 (Consultores Alfa)
(
  'b4444444-4444-4444-4444-444444444444',
  'consultores@gmail.com',
  'Consultores Alfa',
  'empresa',
  'Auditoría y Legal',
  '', '', '', '', '',
  ARRAY[]::TEXT[],
  false, '', 'Suspendido',
  '556102938',
  'Auditoría',
  'Revocado'
),
-- Universidad (Superuser)
(
  'c1111111-1111-1111-1111-111111111111',
  'convenios@gmail.com',
  'Dirección de Carrera',
  'universidad',
  'Facultad de Ciencias Puras - UMSA',
  '', 'Universidad Mayor de San Andrés (UMSA)', '', '', '',
  ARRAY[]::TEXT[],
  true, '', 'Verificado',
  '', '', 'Validado'
)
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  rol = EXCLUDED.rol,
  entidad = EXCLUDED.entidad,
  carrera = EXCLUDED.carrera,
  semestre = EXCLUDED.semestre,
  disponibilidad = EXCLUDED.disponibilidad,
  modalidad = EXCLUDED.modalidad,
  habilidades = EXCLUDED.habilidades,
  verificado = EXCLUDED.verificado,
  ci = EXCLUDED.ci,
  estado_estudiante = EXCLUDED.estado_estudiante,
  nit = EXCLUDED.nit,
  sector = EXCLUDED.sector,
  convenio_estado = EXCLUDED.convenio_estado;

-- ==============================================================================
-- 3. CONVOCATORIAS VINCULADAS A LAS EMPRESAS
-- ==============================================================================
DELETE FROM public.internship_offers;

INSERT INTO public.internship_offers (id, empresa_id, titulo, empresa, carrera, tipo, modalidad, validador, ubicacion, skills, descripcion)
OVERRIDING SYSTEM VALUE
VALUES
(
  1,
  'b1111111-1111-1111-1111-111111111111',
  'Pasante de Desarrollo Frontend',
  'Tech S.R.L.',
  'Informática / Sistemas',
  'Medio Tiempo',
  'Híbrida',
  'Convenio UMSA Validado',
  'La Paz (Sopocachi)',
  ARRAY['React', 'TypeScript', 'Tailwind CSS', 'Git'],
  'Desarrollo de módulos web interactivos, consumo de APIs REST institucionales y colaboración en metodologías ágiles.'
),
(
  2,
  'b2222222-2222-2222-2222-222222222222',
  'Auxiliar de Análisis Financiero',
  'Banco de Inversión Andino',
  'Economía / Adm. Empresas',
  'Medio Tiempo',
  'Presencial',
  'Convenio Institucional',
  'La Paz (Calacoto)',
  ARRAY['Excel Avanzado', 'Modelado Financiero', 'Power BI'],
  'Soporte en la consolidación de estados financieros, proyecciones de flujo de caja y análisis de riesgo de cartera crediticia.'
),
(
  3,
  'b3333333-3333-3333-3333-333333333333',
  'Practicante de Optimización de Procesos',
  'Logística Boliviana S.A.',
  'Ingeniería Industrial',
  'Tiempo Completo',
  'Presencial',
  'Convenio Acreditado',
  'El Alto (Parque Industrial)',
  ARRAY['Control de Calidad', 'Mapeo de Procesos', 'Lean Logistics'],
  'Relevamiento de tiempos y movimientos en líneas operativas de almacenamiento, inventario y distribución regional.'
),
(
  4,
  'b1111111-1111-1111-1111-111111111111',
  'Desarrollador Backend Junior / Pasante',
  'Tech S.R.L.',
  'Informática / Sistemas',
  'Medio Tiempo',
  'Remoto',
  'Convenio UMSA Validado',
  'La Paz',
  ARRAY['Node.js', 'PostgreSQL', 'Docker', 'APIs REST'],
  'Construcción y mantenimiento de microservicios, optimización de consultas SQL y pruebas unitarias automatizadas.'
),
(
  5,
  'b2222222-2222-2222-2222-222222222222',
  'Asistente de Marketing Digital y Métricas',
  'Banco de Inversión Andino',
  'Comunicación / Marketing',
  'Medio Tiempo',
  'Híbrida',
  'Convenio Institucional',
  'La Paz (San Miguel)',
  ARRAY['Google Analytics', 'Meta Ads', 'SEO', 'Copywriting'],
  'Análisis de métricas de adquisición, gestión de pauta digital y soporte en informes de retorno de inversión.'
);

-- ==============================================================================
-- 4. POSTULACIONES INICIALES
-- ==============================================================================
DELETE FROM public.applications;

INSERT INTO public.applications (id, offer_id, student_id, estado, created_at)
VALUES
(
  'e1111111-1111-1111-1111-111111111111',
  1,
  'a1111111-1111-1111-1111-111111111111',
  'Pendiente',
  NOW() - INTERVAL '2 days'
),
(
  'e2222222-2222-2222-2222-222222222222',
  1,
  'a2222222-2222-2222-2222-222222222222',
  'Pendiente',
  NOW() - INTERVAL '1 day'
),
(
  'e3333333-3333-3333-3333-333333333333',
  2,
  'a2222222-2222-2222-2222-222222222222',
  'Aceptado',
  NOW() - INTERVAL '4 days'
),
(
  'e4444444-4444-4444-4444-444444444444',
  3,
  'a3333333-3333-3333-3333-333333333333',
  'Pendiente',
  NOW() - INTERVAL '3 days'
);

-- ==============================================================================
-- 5. RESEÑAS DE LA COMUNIDAD
-- ==============================================================================
DELETE FROM public.reviews;

INSERT INTO public.reviews (id, user_id, autor, rol, entidad, calificacion, comentario, created_at)
VALUES
(
  'f1111111-1111-1111-1111-111111111111',
  'a1111111-1111-1111-1111-111111111111',
  'Mikaela Mendoza',
  'estudiante',
  'Informática - UMSA',
  5,
  'La plataforma me permitió conseguir una pasantía formal que se acomoda perfectamente a mis horarios de clases del 8vo semestre. ¡El proceso de postulación con mi perfil validado fue inmediato!',
  NOW() - INTERVAL '3 days'
),
(
  'f2222222-2222-2222-2222-222222222222',
  'b1111111-1111-1111-1111-111111111111',
  'Tech S.R.L.',
  'empresa',
  'Sector Tecnológico La Paz',
  5,
  'Encontramos rápidamente pasantes con conocimientos reales en React y Node.js. El filtro universitario y la validación de convenios ahorra semanas de reclutamiento.',
  NOW() - INTERVAL '1 week'
),
(
  'f3333333-3333-3333-3333-333333333333',
  'c1111111-1111-1111-1111-111111111111',
  'Dirección de Carrera',
  'universidad',
  'Facultad de Ciencias Puras - UMSA',
  5,
  'Excelente herramienta institucional para supervisar convenios, avalar ofertas y garantizar que los estudiantes realicen prácticas seguras y convalidables para titulación.',
  NOW() - INTERVAL '2 weeks'
),
(
  'f4444444-4444-4444-4444-444444444444',
  'a2222222-2222-2222-2222-222222222222',
  'Rodrigo Flores',
  'estudiante',
  'Economía - UMSA',
  4,
  'Postulé a dos bancos y a los tres días ya tenía respuesta sobre mi postulación en el panel. Muy transparente y confiable.',
  NOW() - INTERVAL '5 days'
);
