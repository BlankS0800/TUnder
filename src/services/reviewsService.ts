import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Review, UserRole } from '../types';

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    autor: 'Mikaela Mendoza',
    rol: 'estudiante',
    entidad: 'Informática - UMSA',
    calificacion: 5,
    comentario: 'La plataforma me permitió conseguir una pasantía formal que se acomoda perfectamente a mis horarios de clases del 8vo semestre. Muy recomendada.',
    fecha: 'Hace 3 días'
  },
  {
    id: 'rev-2',
    autor: 'TechAndes S.R.L.',
    rol: 'empresa',
    entidad: 'Sector Tecnológico La Paz',
    calificacion: 5,
    comentario: 'Encontramos rápidamente pasantes con conocimientos reales en React y Node.js. El filtro por materias aprobadas ahorra semanas de reclutamiento.',
    fecha: 'Hace 1 semana'
  },
  {
    id: 'rev-3',
    autor: 'Dirección de Carrera',
    rol: 'universidad',
    entidad: 'Universidad Mayor de San Andrés',
    calificacion: 5,
    comentario: 'Excelente herramienta institucional para supervisar convenios y garantizar que los estudiantes realicen prácticas seguras y convalidables.',
    fecha: 'Hace 2 semanas'
  }
];

export const reviewsService = {
  async getReviews(roleFilter?: 'todos' | UserRole): Promise<Review[]> {
    if (!isSupabaseConfigured()) {
      const stored = localStorage.getItem('tunder_reviews');
      let list: Review[] = stored ? JSON.parse(stored) : INITIAL_REVIEWS;
      if (roleFilter && roleFilter !== 'todos') {
        list = list.filter((r) => r.rol === roleFilter);
      }
      return list;
    }

    try {
      let query = supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (roleFilter && roleFilter !== 'todos') {
        query = query.eq('rol', roleFilter);
      }

      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return roleFilter && roleFilter !== 'todos'
          ? INITIAL_REVIEWS.filter((r) => r.rol === roleFilter)
          : INITIAL_REVIEWS;
      }

      return data.map((item) => ({
        id: item.id,
        user_id: item.user_id,
        autor: item.autor,
        rol: item.rol as UserRole,
        entidad: item.entidad,
        calificacion: item.calificacion,
        comentario: item.comentario,
        fecha: new Date(item.created_at).toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'short'
        })
      }));
    } catch (err) {
      console.error('Error al obtener reseñas:', err);
      return INITIAL_REVIEWS;
    }
  },

  async createReview(reviewData: {
    user_id?: string;
    autor: string;
    rol: UserRole;
    entidad: string;
    calificacion: number;
    comentario: string;
  }): Promise<Review> {
    if (!isSupabaseConfigured()) {
      const stored = localStorage.getItem('tunder_reviews');
      const list: Review[] = stored ? JSON.parse(stored) : INITIAL_REVIEWS;
      const newRev: Review = {
        ...reviewData,
        id: `rev-${Date.now()}`,
        fecha: 'Justo ahora'
      };
      localStorage.setItem('tunder_reviews', JSON.stringify([newRev, ...list]));
      return newRev;
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        user_id: reviewData.user_id,
        autor: reviewData.autor,
        rol: reviewData.rol,
        entidad: reviewData.entidad,
        calificacion: reviewData.calificacion,
        comentario: reviewData.comentario
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error al publicar reseña: ${error.message}`);
    }

    return {
      id: data.id,
      user_id: data.user_id,
      autor: data.autor,
      rol: data.rol as UserRole,
      entidad: data.entidad,
      calificacion: data.calificacion,
      comentario: data.comentario,
      fecha: 'Justo ahora'
    };
  }
};
