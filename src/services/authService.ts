import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User, UserRole } from '../types';

// Cuentas de demostración preconfiguradas para pruebas rápidas
export const DEMO_ACCOUNTS = [
  {
    email: 'estudiante@gmail.com',
    password: '123',
    user: {
      id: 'demo-student-uuid',
      email: 'estudiante@gmail.com',
      nombre: 'Mikaela Mendoza',
      rol: 'estudiante' as const,
      entidad: 'UMSA - Informática',
      carrera: 'Informática',
      semestre: '8vo Semestre',
      universidad: 'Universidad Mayor de San Andrés (UMSA)',
      disponibilidad: 'Medio Tiempo (Mañanas)',
      modalidad: 'Híbrida',
      habilidades: ['React', 'TypeScript', 'Bases de Datos SQL', 'Tailwind CSS', 'Git & GitHub'],
      verificado: true,
      ci: '9845124 LP'
    }
  },
  {
    email: 'empresa@gmail.com',
    password: '123',
    user: {
      id: 'demo-company-uuid',
      email: 'empresa@gmail.com',
      nombre: 'Tech S.R.L.',
      rol: 'empresa' as const,
      entidad: 'Sector Tecnológico La Paz',
      sector: 'Tecnología',
      nit: '492819024',
      verificado: true
    }
  },
  {
    email: 'convenios@gmail.com',
    password: '123',
    user: {
      id: 'demo-uni-uuid',
      email: 'convenios@gmail.com',
      nombre: 'Dirección de Carrera',
      rol: 'universidad' as const,
      entidad: 'UMSA',
      verificado: true
    }
  }
];

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    if (!isSupabaseConfigured()) {
      const stored = localStorage.getItem('tunder_current_user');
      return stored ? JSON.parse(stored) : null;
    }

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.user) return null;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError || !profile) {
        return {
          id: session.user.id,
          email: session.user.email || '',
          nombre: session.user.user_metadata?.nombre || session.user.email?.split('@')[0] || 'Usuario',
          rol: (session.user.user_metadata?.rol as UserRole) || 'estudiante',
          entidad: session.user.user_metadata?.entidad || ''
        };
      }

      return {
        id: profile.id,
        email: profile.email,
        nombre: profile.nombre,
        rol: profile.rol as UserRole,
        entidad: profile.entidad,
        carrera: profile.carrera,
        semestre: profile.semestre,
        universidad: profile.universidad,
        disponibilidad: profile.disponibilidad,
        modalidad: profile.modalidad,
        habilidades: profile.habilidades || [],
        verificado: profile.verificado,
        ci: profile.ci,
        nit: profile.nit,
        sector: profile.sector
      };
    } catch (err) {
      console.error('Error al obtener usuario actual:', err);
      return null;
    }
  },

  async signUp(params: {
    email: string;
    password: string;
    nombre: string;
    rol: UserRole;
    entidad?: string;
    carreraOSector?: string;
  }): Promise<{ user: User | null; error: string | null }> {
    const { email, password, nombre, rol, entidad, carreraOSector } = params;

    if (!isSupabaseConfigured()) {
      const mockUser: User = {
        id: `mock-${Date.now()}`,
        email,
        nombre,
        rol,
        entidad: carreraOSector || entidad || (rol === 'estudiante' ? 'Informática' : 'Sector Comercial'),
        carrera: rol === 'estudiante' ? (carreraOSector || 'Informática') : undefined,
        sector: rol === 'empresa' ? (carreraOSector || 'Comercial') : undefined,
        verificado: false,
        habilidades: rol === 'estudiante' ? ['Competencias Básicas'] : []
      };
      localStorage.setItem('tunder_current_user', JSON.stringify(mockUser));
      return { user: mockUser, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre,
            rol,
            entidad: carreraOSector || entidad || '',
            carrera: rol === 'estudiante' ? carreraOSector : '',
            sector: rol === 'empresa' ? carreraOSector : ''
          }
        }
      });

      if (error) {
        if (error.message.toLowerCase().includes('rate limit')) {
          // Intentar iniciar sesión por si el usuario ya existe (ej. fue creado con seed.sql)
          const loginAttempt = await this.signIn(email, password);
          if (loginAttempt.user) {
            return loginAttempt;
          }
          return {
            user: null,
            error: "Límite de envío de correos alcanzado en Supabase (rate limit). Para solucionarlo de inmediato: en tu panel de Supabase ve a Authentication -> Providers -> Email y desactiva la opción 'Confirm email' (luego haz clic en Save). O inicia sesión directamente desde la pantalla de login con las cuentas demo."
          };
        }
        return { user: null, error: error.message };
      }

      if (data.user) {
        // Asegurar que el perfil quede creado en la tabla public.profiles
        const profilePayload = {
          id: data.user.id,
          email: data.user.email,
          nombre,
          rol,
          entidad: carreraOSector || entidad || '',
          carrera: rol === 'estudiante' ? carreraOSector : '',
          sector: rol === 'empresa' ? carreraOSector : '',
          verificado: rol === 'universidad'
        };

        await supabase.from('profiles').upsert(profilePayload);

        const newUser: User = {
          id: data.user.id,
          email: data.user.email || email,
          nombre,
          rol,
          entidad: profilePayload.entidad,
          carrera: profilePayload.carrera,
          sector: profilePayload.sector,
          verificado: profilePayload.verificado
        };

        return { user: newUser, error: null };
      }

      return { user: null, error: 'No se pudo crear el usuario.' };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error inesperado durante el registro';
      return { user: null, error: message };
    }
  },

  async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    // Si no está configurado Supabase, buscar en las cuentas demo o localStorage
    if (!isSupabaseConfigured()) {
      const match = DEMO_ACCOUNTS.find(
        (acc) => acc.email.toLowerCase() === email.trim().toLowerCase() && acc.password === password
      );
      if (match) {
        localStorage.setItem('tunder_current_user', JSON.stringify(match.user));
        return { user: match.user, error: null };
      }

      const stored = localStorage.getItem('tunder_current_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.email.toLowerCase() === email.trim().toLowerCase()) {
          return { user: parsed, error: null };
        }
      }

      return {
        user: null,
        error: 'Credenciales inválidas en modo local. Usa una de las cuentas de prueba disponibles.'
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        if (error.message.toLowerCase().includes('email not confirmed')) {
          return {
            user: null,
            error: "El correo aún no ha sido confirmado. En tu panel de Supabase ve a Authentication -> Providers -> Email y desactiva 'Confirm email' para permitir login inmediato sin confirmación."
          };
        }
        return { user: null, error: error.message };
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const user: User = {
          id: data.user.id,
          email: data.user.email || email,
          nombre: profile?.nombre || data.user.user_metadata?.nombre || 'Usuario',
          rol: (profile?.rol || data.user.user_metadata?.rol || 'estudiante') as UserRole,
          entidad: profile?.entidad || data.user.user_metadata?.entidad || '',
          carrera: profile?.carrera,
          semestre: profile?.semestre,
          universidad: profile?.universidad,
          disponibilidad: profile?.disponibilidad,
          modalidad: profile?.modalidad,
          habilidades: profile?.habilidades || [],
          verificado: profile?.verificado ?? false,
          ci: profile?.ci,
          nit: profile?.nit,
          sector: profile?.sector
        };

        return { user, error: null };
      }

      return { user: null, error: 'No se pudo iniciar sesión.' };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al conectar con Supabase';
      return { user: null, error: message };
    }
  },

  async signOut(): Promise<void> {
    if (!isSupabaseConfigured()) {
      localStorage.removeItem('tunder_current_user');
      return;
    }
    await supabase.auth.signOut();
  }
};
