# 🚀 Guía Completa de Despliegue en la Nube: TUnder (Frontend + Supabase)

Esta guía te explica paso a paso cómo poner **TUnder** 100% operativo en la nube, de forma gratuita y con rendimiento profesional.

---

## 📑 Índice
1. [Paso 1: Configurar el Backend en Supabase (Gratis)](#paso-1-configurar-el-backend-en-supabase-gratis)
2. [Paso 2: Conectar el Frontend con Supabase](#paso-2-conectar-el-frontend-con-supabase)
3. [Paso 3: Desplegar el Frontend en la Nube (Vercel o Netlify)](#paso-3-desplegar-el-frontend-en-la-nube-vercel-o-netlify)
4. [Paso 4: Verificación Final y Pruebas](#paso-4-verificación-final-y-pruebas)

---

## Paso 1: Configurar el Backend en Supabase (Gratis)

Supabase actúa como tu base de datos PostgreSQL, sistema de autenticación de usuarios y API en tiempo real.

1. **Crear cuenta en Supabase**:
   - Ingresa a [https://supabase.com](https://supabase.com) y regístrate con tu cuenta de GitHub o correo.
2. **Crear un nuevo proyecto**:
   - Haz clic en **"New Project"**.
   - Asigna un nombre (ej. `tunder-db`).
   - Define una contraseña segura para la base de datos (guárdala en un lugar seguro).
   - En **Region**, selecciona la más cercana (ej. `South America (São Paulo)` o `East US`).
   - Elige el plan **Free** ($0/mes) y haz clic en **"Create new project"** (tardará unos 2 minutos en inicializar).

3. **Ejecutar el Esquema de Base de Datos**:
   - En el menú lateral izquierdo de tu proyecto Supabase, entra a **SQL Editor**.
   - Haz clic en **"New query"**.
   - Abre el archivo `supabase/schema.sql` de este proyecto, copia todo su contenido y pégalo en el editor de Supabase.
   - Haz clic en el botón verde **"Run"** (o presiona `Ctrl + Enter`).
   - Verás el mensaje *"Success. No rows returned"*. Las 4 tablas (`profiles`, `internship_offers`, `applications`, `reviews`), las políticas de seguridad **RLS** y los triggers automáticos ya están creados.

4. **Insertar los Datos Iniciales de Prueba (Seed)**:
   - En el mismo **SQL Editor**, abre una nueva consulta.
   - Copia el contenido del archivo `supabase/seed.sql` de este proyecto y pégalo.
   - Haz clic en **"Run"**. Esto poblará tus ofertas iniciales y reseñas de estudiantes y empresas.

5. **Copiar tus Claves API de Supabase**:
   - Ve al ícono de engranaje en la barra lateral (**Project Settings**) -> **API**.
   - Encontrarás dos valores indispensables:
     - **Project URL** (ejemplo: `https://xyzcompany.supabase.co`)
     - **Project API Keys**: Copia la clave llamada **`anon` / `public`**.

---

## Paso 2: Conectar el Frontend con Supabase

### Para desarrollo local:
1. En la carpeta raíz del proyecto `TUnder/`, abre o crea el archivo `.env`.
2. Pega tus credenciales obtenidas en el paso anterior:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
   ```
3. Ejecuta en tu terminal:
   ```bash
   npm run dev
   ```
4. Abre [http://localhost:5173](http://localhost:5173). Observarás en la esquina inferior derecha el indicador en verde: **"Supabase Conectado"**.

---

## Paso 3: Desplegar el Frontend en la Nube (Vercel o Netlify)

Recomendamos **Vercel** por su integración nativa con Vite, HTTPS automático y velocidad global de CDN.

### Opción A: Despliegue con Vercel (Recomendado)

1. **Subir tu proyecto a GitHub**:
   - Crea un repositorio en [https://github.com](https://github.com) llamado `tunder`.
   - En tu terminal dentro de la carpeta `TUnder`:
     ```bash
     git add .
     git commit -m "Backend Supabase completo e integración para TUnder"
     git branch -M main
     git remote add origin https://github.com/TU_USUARIO/tunder.git
     git push -u origin main
     ```

2. **Conectar a Vercel**:
   - Entra a [https://vercel.com](https://vercel.com) e inicia sesión con GitHub.
   - Haz clic en **"Add New..."** -> **"Project"**.
   - Selecciona el repositorio `tunder` y haz clic en **"Import"**.

3. **Configurar el Build y Variables de Entorno**:
   - **Framework Preset**: Detectará automáticamente `Vite`.
   - **Root Directory**: Si el código está dentro de la subcarpeta `TUnder`, selecciónala como directorio raíz; si es la raíz del repositorio, déjalo en `./`.
   - **Environment Variables**:
     - Nombre: `VITE_SUPABASE_URL` | Valor: Tu Project URL de Supabase.
     - Nombre: `VITE_SUPABASE_ANON_KEY` | Valor: Tu Anon Public Key de Supabase.
   - Haz clic en **"Deploy"**.

4. ¡Listo! En menos de 60 segundos tendrás tu enlace público con certificado SSL (ejemplo: `https://tunder.vercel.app`).

---

### Opción B: Despliegue con Netlify

1. Entra a [https://netlify.com](https://netlify.com) e inicia sesión.
2. Haz clic en **"Add new site"** -> **"Import an existing project"** -> **GitHub**.
3. Selecciona tu repositorio.
4. En **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. En **Environment variables**, añade `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
6. Haz clic en **"Deploy site"**.

---

## Paso 4: Verificación Final y Pruebas

Una vez desplegada tu web en la nube:
1. **Registro de Usuarios**:
   - Regístrate con un nuevo usuario Estudiante o Empresa.
   - Comprueba en el panel de Supabase (**Table Editor** -> `profiles`) que tu nuevo usuario y perfil se crearon automáticamente.
2. **Publicar Convocatoria**:
   - Inicia sesión con la cuenta de empresa y publica una nueva oferta.
   - Verifica que aparezca de inmediato en la pestaña pública de **Convocatorias**.
3. **Postular a una Convocatoria**:
   - Inicia sesión como estudiante y postula a una pasantía.
   - Revisa tu panel de estudiante en **"Mis Postulaciones"** para ver su estado.
   - En el panel de la empresa, comprueba que el postulante aparece listado y cámbiale el estado a **Aceptado**.
4. **Reseñas de la Comunidad**:
   - Agrega una valoración con estrellas y confirma que se refleja en tiempo real en la página de **Reseñas**.

---

## 🔒 Arquitectura de Seguridad Implementada

- **Row Level Security (RLS)** activado en todas las tablas:
  - Solo los estudiantes pueden enviar sus propias postulaciones.
  - Solo las empresas dueñas de una convocatoria pueden cambiar el estado de los postulantes de esa convocatoria.
  - La universidad posee privilegios para convalidar, suspender o revocar perfiles y convenios.
  - Las contraseñas se almacenan mediante el motor criptográfico seguro de Supabase Auth (bcrypt con salado).
