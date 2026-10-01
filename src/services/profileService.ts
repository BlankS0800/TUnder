import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { StudentProfile, StudentData, CompanyData } from '../types';

const INITIAL_STUDENTS: StudentData[] = [
  { id: '1', nombre: 'Mikaela Mendoza', ci: '9845124 LP', carrera: 'Informática', semestre: '8vo', estado: 'Verificado', postulaciones: 3 },
  { id: '2', nombre: 'Rodrigo Flores', ci: '8741203 LP', carrera: 'Economía', semestre: '7mo', estado: 'Pendiente', postulaciones: 1 },
  { id: '3', nombre: 'Camila Quispe', ci: '1029384 LP', carrera: 'Ingeniería Industrial', semestre: '9no', estado: 'Verificado', postulaciones: 4 },
  { id: '4', nombre: 'Andrés Morales', ci: '7451290 LP', carrera: 'Informática', semestre: '6to', estado: 'Suspendido', postulaciones: 0 }
];

const INITIAL_COMPANIES: CompanyData[] = [
  { id: '1', nombre: 'TechAndes S.R.L.', nit: '492819024', sector: 'Tecnología', convenioEstado: 'Validado', ofertasActivas: 2 },
  { id: '2', nombre: 'Banco de Inversión Andino', nit: '102938472', sector: 'Finanzas', convenioEstado: 'Validado', ofertasActivas: 3 },
  { id: '3', nombre: 'Logística Boliviana S.A.', nit: '883920194', sector: 'Operaciones', convenioEstado: 'En Revisión', ofertasActivas: 1 },
  { id: '4', nombre: 'Consultores Alfa', nit: '556102938', sector: 'Auditoría', convenioEstado: 'Revocado', ofertasActivas: 0 }
];

export const profileService = {
  async getStudentProfile(userId?: string): Promise<StudentProfile | null> {
    if (!isSupabaseConfigured() || !userId || userId.startsWith('demo-')) {
      const stored = localStorage.getItem('tunder_student_profile');
      if (stored) return JSON.parse(stored);

      const defaultProfile: StudentProfile = {
        nombre: 'Mikaela Mendoza',
        carrera: 'Informática',
        universidad: 'Universidad Mayor de San Andrés (UMSA)',
        semestre: '8vo Semestre',
        disponibilidad: 'Medio Tiempo (Mañanas 08:00 - 12:00)',
        modalidad: 'Híbrida',
        habilidades: ['React', 'TypeScript', 'Bases de Datos SQL', 'Tailwind CSS', 'Git & GitHub'],
        verificado: true,
        ci: '9845124 LP'
      };
      localStorage.setItem('tunder_student_profile', JSON.stringify(defaultProfile));
      return defaultProfile;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        nombre: data.nombre,
        carrera: data.carrera || 'Informática',
        universidad: data.universidad || 'Universidad Mayor de San Andrés (UMSA)',
        semestre: data.semestre || '8vo Semestre',
        disponibilidad: data.disponibilidad || 'Medio Tiempo (Mañanas)',
        modalidad: data.modalidad || 'Híbrida',
        habilidades: data.habilidades || [],
        verificado: data.verificado || false,
        ci: data.ci || ''
      };
    } catch (err) {
      console.error('Error al obtener perfil:', err);
      return null;
    }
  },

  async updateStudentProfile(userId: string | undefined, profile: StudentProfile): Promise<boolean> {
    if (!isSupabaseConfigured() || !userId || userId.startsWith('demo-')) {
      localStorage.setItem('tunder_student_profile', JSON.stringify(profile));
      return true;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nombre: profile.nombre,
          carrera: profile.carrera,
          universidad: profile.universidad,
          semestre: profile.semestre,
          disponibilidad: profile.disponibilidad,
          modalidad: profile.modalidad,
          habilidades: profile.habilidades,
          ci: profile.ci,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error al actualizar perfil de estudiante:', err);
      return false;
    }
  },

  async getAllStudents(): Promise<StudentData[]> {
    if (!isSupabaseConfigured()) {
      const stored = localStorage.getItem('tunder_admin_students');
      return stored ? JSON.parse(stored) : INITIAL_STUDENTS;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          nombre,
          ci,
          carrera,
          semestre,
          estado_estudiante,
          verificado,
          applications (id)
        `)
        .eq('rol', 'estudiante');

      if (error || !data || data.length === 0) {
        return INITIAL_STUDENTS;
      }

      return data.map((item: any) => ({
        id: item.id,
        nombre: item.nombre,
        ci: item.ci || 'Sin CI registrado',
        carrera: item.carrera || 'Informática',
        semestre: item.semestre || 'Semestre regular',
        estado: (item.estado_estudiante || (item.verificado ? 'Verificado' : 'Pendiente')) as any,
        postulaciones: item.applications?.length || 0
      }));
    } catch (err) {
      console.error('Error al listar estudiantes para universidad:', err);
      return INITIAL_STUDENTS;
    }
  },

  async getAllCompanies(): Promise<CompanyData[]> {
    if (!isSupabaseConfigured()) {
      const stored = localStorage.getItem('tunder_admin_companies');
      return stored ? JSON.parse(stored) : INITIAL_COMPANIES;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          nombre,
          nit,
          sector,
          convenio_estado,
          internship_offers (id)
        `)
        .eq('rol', 'empresa');

      if (error || !data || data.length === 0) {
        return INITIAL_COMPANIES;
      }

      return data.map((item: any) => ({
        id: item.id,
        nombre: item.nombre,
        nit: item.nit || 'NIT en trámite',
        sector: item.sector || 'Servicios Generales',
        convenioEstado: (item.convenio_estado || 'Validado') as any,
        ofertasActivas: item.internship_offers?.length || 0
      }));
    } catch (err) {
      console.error('Error al listar empresas para universidad:', err);
      return INITIAL_COMPANIES;
    }
  },

  async toggleStudentStatus(studentId: string, currentEstado: string): Promise<boolean> {
    const nuevoEstado = currentEstado === 'Verificado' ? 'Suspendido' : 'Verificado';

    if (!isSupabaseConfigured() || studentId.length < 10) {
      const stored = localStorage.getItem('tunder_admin_students');
      const list: StudentData[] = stored ? JSON.parse(stored) : INITIAL_STUDENTS;
      const updated = list.map((s) => (s.id === studentId ? { ...s, estado: nuevoEstado as any } : s));
      localStorage.setItem('tunder_admin_students', JSON.stringify(updated));
      return true;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        estado_estudiante: nuevoEstado,
        verificado: nuevoEstado === 'Verificado'
      })
      .eq('id', studentId);

    return !error;
  },

  async toggleCompanyConvenio(companyId: string, currentConvenio: string): Promise<boolean> {
    const nuevoEstado = currentConvenio === 'Validado' ? 'Revocado' : 'Validado';

    if (!isSupabaseConfigured() || companyId.length < 10) {
      const stored = localStorage.getItem('tunder_admin_companies');
      const list: CompanyData[] = stored ? JSON.parse(stored) : INITIAL_COMPANIES;
      const updated = list.map((c) => (c.id === companyId ? { ...c, convenioEstado: nuevoEstado as any } : c));
      localStorage.setItem('tunder_admin_companies', JSON.stringify(updated));
      return true;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ convenio_estado: nuevoEstado })
      .eq('id', companyId);

    return !error;
  },

  async deleteProfile(userId: string): Promise<boolean> {
    if (!isSupabaseConfigured() || userId.length < 10) {
      // Local fallback removal
      const students = localStorage.getItem('tunder_admin_students');
      if (students) {
        localStorage.setItem(
          'tunder_admin_students',
          JSON.stringify(JSON.parse(students).filter((s: any) => s.id !== userId))
        );
      }
      const companies = localStorage.getItem('tunder_admin_companies');
      if (companies) {
        localStorage.setItem(
          'tunder_admin_companies',
          JSON.stringify(JSON.parse(companies).filter((c: any) => c.id !== userId))
        );
      }
      return true;
    }

    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    return !error;
  }
};
