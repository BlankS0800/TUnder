import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { InternshipOffer, Applicant, ApplicationStatus } from '../types';

const INITIAL_OFFERS: InternshipOffer[] = [
  {
    id: 1,
    titulo: 'Pasante de Desarrollo Frontend',
    empresa: 'TechAndes S.R.L.',
    carrera: 'Informática / Sistemas',
    tipo: 'Medio Tiempo',
    modalidad: 'Híbrida',
    validador: 'Convenio UMSA Validado',
    ubicacion: 'La Paz (Sopocachi)',
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
    descripcion: 'Desarrollo de módulos web e integración con microservicios para proyectos institucionales.',
    postulantes: [
      {
        id: 'app-1',
        nombre: 'Mikaela Mendoza',
        carrera: 'Informática (UMSA)',
        semestre: '8vo Semestre',
        disponibilidad: 'Mañanas (08:00 - 12:00)',
        habilidades: ['React', 'TypeScript', 'SQL'],
        fechaPostulacion: 'Hace 2 días',
        estado: 'Pendiente'
      }
    ]
  },
  {
    id: 2,
    titulo: 'Auxiliar de Análisis Financiero',
    empresa: 'Banco de Inversión Andino',
    carrera: 'Economía / Adm. Empresas',
    tipo: 'Medio Tiempo',
    modalidad: 'Presencial',
    validador: 'Convenio Institucional',
    ubicacion: 'La Paz (Calacoto)',
    skills: ['Excel Avanzado', 'Modelado Financiero'],
    descripcion: 'Soporte en la consolidación de estados financieros y análisis de riesgo de cartera crediticia.',
    postulantes: []
  },
  {
    id: 3,
    titulo: 'Practicante de Optimización de Procesos',
    empresa: 'Logística Boliviana S.A.',
    carrera: 'Ingeniería Industrial',
    tipo: 'Tiempo Completo',
    modalidad: 'Presencial',
    validador: 'Convenio Acreditado',
    ubicacion: 'El Alto (Parque Industrial)',
    skills: ['Control de Calidad', 'Mapeo de Procesos'],
    descripcion: 'Relevamiento de tiempos y movimientos en líneas operativas de almacenamiento y distribución.',
    postulantes: []
  }
];

export const offersService = {
  async getOffers(searchTerm?: string): Promise<InternshipOffer[]> {
    if (!isSupabaseConfigured()) {
      const stored = localStorage.getItem('tunder_offers');
      let offers: InternshipOffer[] = stored ? JSON.parse(stored) : INITIAL_OFFERS;
      if (!stored) {
        localStorage.setItem('tunder_offers', JSON.stringify(INITIAL_OFFERS));
      }

      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        offers = offers.filter(
          (o) =>
            o.titulo.toLowerCase().includes(query) ||
            o.carrera.toLowerCase().includes(query) ||
            o.empresa.toLowerCase().includes(query)
        );
      }
      return offers;
    }

    try {
      let query = supabase
        .from('internship_offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`titulo.ilike.%${searchTerm}%,carrera.ilike.%${searchTerm}%,empresa.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        // Si no hay datos en la tabla remota aún, devolvemos los iniciales
        return INITIAL_OFFERS;
      }

      return data.map((item) => ({
        id: item.id,
        empresa_id: item.empresa_id,
        titulo: item.titulo,
        empresa: item.empresa,
        carrera: item.carrera,
        tipo: item.tipo,
        modalidad: item.modalidad,
        validador: item.validador,
        ubicacion: item.ubicacion,
        skills: item.skills || [],
        descripcion: item.descripcion,
        created_at: item.created_at
      }));
    } catch (err) {
      console.error('Error al obtener ofertas:', err);
      return INITIAL_OFFERS;
    }
  },

  async getOffersByEmpresa(empresaId?: string, empresaNombre?: string): Promise<InternshipOffer[]> {
    if (!isSupabaseConfigured()) {
      const stored = localStorage.getItem('tunder_offers');
      const list: InternshipOffer[] = stored ? JSON.parse(stored) : INITIAL_OFFERS;
      return list;
    }

    try {
      let query = supabase
        .from('internship_offers')
        .select(`
          *,
          applications (
            id,
            estado,
            created_at,
            profiles:student_id (
              id,
              nombre,
              carrera,
              semestre,
              disponibilidad,
              habilidades,
              email
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (empresaId) {
        query = query.eq('empresa_id', empresaId);
      } else if (empresaNombre) {
        query = query.eq('empresa', empresaNombre);
      }

      const { data, error } = await query;
      if (error) throw error;
      if (!data || data.length === 0) {
        return await this.getOffers();
      }

      return data.map((row: any) => {
        const postulantes: Applicant[] = (row.applications || []).map((app: any) => ({
          id: app.id,
          nombre: app.profiles?.nombre || 'Estudiante Postulante',
          carrera: app.profiles?.carrera || 'Carrera Universitaria',
          semestre: app.profiles?.semestre || 'Semestre Avanzado',
          disponibilidad: app.profiles?.disponibilidad || 'Medio Tiempo',
          habilidades: app.profiles?.habilidades || [],
          fechaPostulacion: new Date(app.created_at).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short'
          }),
          estado: app.estado as ApplicationStatus,
          email: app.profiles?.email
        }));

        return {
          id: row.id,
          empresa_id: row.empresa_id,
          titulo: row.titulo,
          empresa: row.empresa,
          carrera: row.carrera,
          tipo: row.tipo,
          modalidad: row.modalidad,
          validador: row.validador,
          ubicacion: row.ubicacion,
          skills: row.skills || [],
          descripcion: row.descripcion,
          created_at: row.created_at,
          postulantes
        };
      });
    } catch (err) {
      console.error('Error al obtener ofertas de la empresa:', err);
      return await this.getOffers();
    }
  },

  async createOffer(offerData: Omit<InternshipOffer, 'id' | 'postulantes'>): Promise<InternshipOffer> {
    if (!isSupabaseConfigured()) {
      const stored = localStorage.getItem('tunder_offers');
      const list: InternshipOffer[] = stored ? JSON.parse(stored) : INITIAL_OFFERS;
      const newOffer: InternshipOffer = {
        ...offerData,
        id: Date.now(),
        postulantes: []
      };
      const updated = [newOffer, ...list];
      localStorage.setItem('tunder_offers', JSON.stringify(updated));
      return newOffer;
    }

    const { data, error } = await supabase
      .from('internship_offers')
      .insert({
        empresa_id: offerData.empresa_id,
        titulo: offerData.titulo,
        empresa: offerData.empresa,
        carrera: offerData.carrera,
        tipo: offerData.tipo,
        modalidad: offerData.modalidad,
        validador: offerData.validador || 'Convenio Institucional Validado',
        ubicacion: offerData.ubicacion,
        skills: offerData.skills,
        descripcion: offerData.descripcion
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error al crear oferta: ${error.message}`);
    }

    return {
      id: data.id,
      empresa_id: data.empresa_id,
      titulo: data.titulo,
      empresa: data.empresa,
      carrera: data.carrera,
      tipo: data.tipo,
      modalidad: data.modalidad,
      validador: data.validador,
      ubicacion: data.ubicacion,
      skills: data.skills || [],
      descripcion: data.descripcion,
      postulantes: []
    };
  },

  async deleteOffer(offerId: number): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      const stored = localStorage.getItem('tunder_offers');
      if (stored) {
        const list: InternshipOffer[] = JSON.parse(stored);
        const filtered = list.filter((o) => o.id !== offerId);
        localStorage.setItem('tunder_offers', JSON.stringify(filtered));
      }
      return true;
    }

    const { error } = await supabase.from('internship_offers').delete().eq('id', offerId);
    if (error) {
      console.error('Error al eliminar oferta:', error);
      return false;
    }
    return true;
  },

  async updateOfferValidation(offerId: number, validador: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      const stored = localStorage.getItem('tunder_offers');
      if (stored) {
        const list: InternshipOffer[] = JSON.parse(stored);
        const updated = list.map((o) => (o.id === offerId ? { ...o, validador } : o));
        localStorage.setItem('tunder_offers', JSON.stringify(updated));
      }
      return true;
    }

    const { error } = await supabase
      .from('internship_offers')
      .update({ validador })
      .eq('id', offerId);

    return !error;
  }
};
