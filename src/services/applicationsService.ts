import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { StudentApplication, ApplicationStatus } from '../types';

export const applicationsService = {
  async applyToOffer(offerId: number, studentId: string): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured()) {
      const stored = localStorage.getItem('tunder_applications');
      const apps: any[] = stored ? JSON.parse(stored) : [];

      const exists = apps.some((a) => a.offer_id === offerId && a.student_id === studentId);
      if (exists) {
        return { success: false, message: 'Ya tienes una postulación activa en esta convocatoria.' };
      }

      apps.push({
        id: `app-${Date.now()}`,
        offer_id: offerId,
        student_id: studentId,
        estado: 'Pendiente',
        created_at: new Date().toISOString()
      });

      localStorage.setItem('tunder_applications', JSON.stringify(apps));
      return { success: true, message: '¡Postulación enviada con éxito! Tu Perfil Académico fue remitido a la empresa.' };
    }

    try {
      // 1. Verificar si ya postuló
      const { data: existing, error: checkError } = await supabase
        .from('applications')
        .select('id')
        .eq('offer_id', offerId)
        .eq('student_id', studentId)
        .maybeSingle();

      if (checkError) {
        console.error('Error al comprobar postulación:', checkError);
      }

      if (existing) {
        return { success: false, message: 'Ya has postulado previamente a esta convocatoria.' };
      }

      // 2. Insertar postulación
      const { error: insertError } = await supabase.from('applications').insert({
        offer_id: offerId,
        student_id: studentId,
        estado: 'Pendiente'
      });

      if (insertError) {
        throw insertError;
      }

      return {
        success: true,
        message: '¡Postulación registrada exitosamente en Supabase! La empresa revisará tus antecedentes.'
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al registrar la postulación';
      return { success: false, message };
    }
  },

  async getStudentApplications(studentId: string): Promise<StudentApplication[]> {
    if (!isSupabaseConfigured()) {
      const storedApps = localStorage.getItem('tunder_applications');
      const apps: any[] = storedApps ? JSON.parse(storedApps) : [
        {
          id: 'app-demo-1',
          offer_id: 1,
          student_id: studentId,
          estado: 'Pendiente',
          created_at: new Date(Date.now() - 86400000 * 2).toISOString()
        }
      ];

      const storedOffers = localStorage.getItem('tunder_offers');
      const offers: any[] = storedOffers ? JSON.parse(storedOffers) : [];

      const studentApps = apps.filter((a) => a.student_id === studentId || studentId.startsWith('demo-'));
      return studentApps.map((a) => {
        const off = offers.find((o) => o.id === a.offer_id) || {
          titulo: 'Pasante de Desarrollo Frontend',
          empresa: 'TechAndes S.R.L.',
          carrera: 'Informática / Sistemas',
          tipo: 'Medio Tiempo',
          ubicacion: 'La Paz (Sopocachi)'
        };

        return {
          id: a.id,
          offer_id: a.offer_id,
          offer_titulo: off.titulo,
          offer_empresa: off.empresa,
          offer_carrera: off.carrera,
          offer_tipo: off.tipo,
          offer_ubicacion: off.ubicacion,
          estado: a.estado as ApplicationStatus,
          fechaPostulacion: new Date(a.created_at).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short'
          })
        };
      });
    }

    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          offer_id,
          estado,
          created_at,
          internship_offers (
            id,
            titulo,
            empresa,
            carrera,
            tipo,
            ubicacion
          )
        `)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!data) return [];

      return data.map((item: any) => ({
        id: item.id,
        offer_id: item.offer_id,
        offer_titulo: item.internship_offers?.titulo || 'Convocatoria de Pasantía',
        offer_empresa: item.internship_offers?.empresa || 'Empresa Conveniada',
        offer_carrera: item.internship_offers?.carrera || 'Carrera',
        offer_tipo: item.internship_offers?.tipo || 'Medio Tiempo',
        offer_ubicacion: item.internship_offers?.ubicacion || 'La Paz',
        estado: item.estado as ApplicationStatus,
        fechaPostulacion: new Date(item.created_at).toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'short'
        })
      }));
    } catch (err) {
      console.error('Error al obtener postulaciones del estudiante:', err);
      return [];
    }
  },

  async updateApplicationStatus(applicationId: string, newStatus: ApplicationStatus): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      const stored = localStorage.getItem('tunder_applications');
      if (stored) {
        const apps = JSON.parse(stored);
        const updated = apps.map((a: any) => (a.id === applicationId ? { ...a, estado: newStatus } : a));
        localStorage.setItem('tunder_applications', JSON.stringify(updated));
      }
      return true;
    }

    const { error } = await supabase
      .from('applications')
      .update({ estado: newStatus })
      .eq('id', applicationId);

    if (error) {
      console.error('Error actualizando estado de postulación:', error);
      return false;
    }
    return true;
  },

  async cancelApplication(applicationId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      const stored = localStorage.getItem('tunder_applications');
      if (stored) {
        const apps = JSON.parse(stored);
        const filtered = apps.filter((a: any) => a.id !== applicationId);
        localStorage.setItem('tunder_applications', JSON.stringify(filtered));
      }
      return true;
    }

    const { error } = await supabase.from('applications').delete().eq('id', applicationId);
    return !error;
  }
};
