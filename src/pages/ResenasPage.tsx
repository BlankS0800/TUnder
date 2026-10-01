import React, { useState, useEffect } from 'react';
import { 
  Star, 
  MessageSquarePlus, 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Filter,
  Loader2
} from 'lucide-react';
import type { Review, User, PageType, UserRole } from '../types';
import { reviewsService } from '../services/reviewsService';

interface ResenasPageProps {
  currentUser: User | null;
  setActivePage: (page: PageType) => void;
}

export const ResenasPage: React.FC<ResenasPageProps> = ({ currentUser, setActivePage }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<'todos' | UserRole>('todos');
  const [calificacion, setCalificacion] = useState<number>(5);
  const [comentario, setComentario] = useState<string>('');
  const [successToast, setSuccessToast] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    loadReviews();
  }, [selectedFilter]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewsService.getReviews(selectedFilter);
      setReviews(data);
    } catch (err) {
      console.error('Error cargando reseñas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !comentario.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await reviewsService.createReview({
        user_id: currentUser.id,
        autor: currentUser.nombre,
        rol: currentUser.rol,
        entidad: currentUser.entidad || (currentUser.rol === 'estudiante' ? 'Estudiante UMSA' : 'Entidad Aliada'),
        calificacion,
        comentario: comentario.trim()
      });

      setReviews([created, ...reviews]);
      setComentario('');
      setCalificacion(5);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3500);
    } catch (err) {
      console.error('Error guardando reseña:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleBadge = (rol: UserRole) => {
    switch (rol) {
      case 'estudiante':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
            <GraduationCap className="w-3.5 h-3.5" /> Estudiante
          </span>
        );
      case 'empresa':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
            <Building2 className="w-3.5 h-3.5" /> Empresa
          </span>
        );
      case 'universidad':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-tunder-orange" /> Universidad
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Cabecera */}
      <div className="max-w-3xl space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-tunder-navy">Reseñas y Experiencias de la Comunidad</h1>
        <p className="text-slate-600 text-sm">
          Conoce los testimonios reales de estudiantes, empresas contratantes y directores de carrera en TUnder.
        </p>
      </div>

      {/* Formulario de Reseña */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-tunder-navy border-b border-slate-100 pb-3">
          <MessageSquarePlus className="w-5 h-5 text-tunder-orange" />
          <h2 className="text-base font-bold">Dejar una Reseña sobre TUnder</h2>
        </div>

        {successToast && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ¡Tu reseña ha sido guardada en Supabase y ya es visible para toda la comunidad!
          </div>
        )}

        {currentUser ? (
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl">
              <div>
                <span className="text-xs text-slate-500 block">Publicando como:</span>
                <span className="text-sm font-bold text-tunder-navy">{currentUser.nombre}</span>
                <span className="text-xs text-slate-500 ml-2">({currentUser.entidad})</span>
              </div>
              <div>{getRoleBadge(currentUser.rol)}</div>
            </div>

            {/* Selector de Estrellas */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Calificación general:</label>
              <div className="flex gap-1.5 items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setCalificacion(star)}
                    className="p-1 hover:scale-110 transition-transform focus:outline-hidden"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= calificacion
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-600 ml-2">
                  {calificacion} de 5 estrellas
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tu Experiencia u Opinión:</label>
              <textarea
                required
                rows={3}
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Escribe cómo fue tu experiencia gestionando o realizando tu pasantía a través de TUnder..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-tunder-cyan"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-tunder-orange hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition shadow-md shadow-orange-500/20 flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Publicar Reseña
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white rounded-xl text-tunder-orange border border-slate-200">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-tunder-navy">Inicia sesión para compartir tu experiencia</h4>
                <p className="text-xs text-slate-500">Solo usuarios acreditados pueden publicar testimonios en la plataforma.</p>
              </div>
            </div>
            <button
              onClick={() => setActivePage('login')}
              className="px-4 py-2 bg-tunder-navy hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition shrink-0 shadow-sm"
            >
              Iniciar Sesión
            </button>
          </div>
        )}
      </div>

      {/* Filtros de Reseñas */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
          <Filter className="w-4 h-4 text-tunder-cyan" /> Filtrar por categoría:
        </div>
        <div className="flex flex-wrap gap-2">
          {(['todos', 'estudiante', 'empresa', 'universidad'] as const).map((filtro) => (
            <button
              key={filtro}
              onClick={() => setSelectedFilter(filtro)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition capitalize ${
                selectedFilter === filtro
                  ? 'bg-tunder-navy text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {filtro === 'todos' ? 'Todas las Reseñas' : `${filtro}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Reseñas */}
      {loading ? (
        <div className="py-16 text-center">
          <Loader2 className="w-8 h-8 text-tunder-cyan animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">Cargando testimonios de la comunidad...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-tunder-cyan transition"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex text-amber-400">
                    {Array.from({ length: rev.calificacion }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">{rev.fecha}</span>
                </div>

                <p className="text-xs text-slate-700 italic leading-relaxed">
                  "{rev.comentario}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-tunder-navy">{rev.autor}</h5>
                  <p className="text-[11px] text-slate-400">{rev.entidad}</p>
                </div>
                <div>{getRoleBadge(rev.rol)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};