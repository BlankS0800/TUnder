import React, { useState } from 'react';
import { 
  Star, 
  MessageSquarePlus, 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Filter 
} from 'lucide-react';
import type { Review, User, PageType, UserRole } from '../types';

interface ResenasPageProps {
  currentUser: User | null;
  setActivePage: (page: PageType) => void;
}

export const ResenasPage: React.FC<ResenasPageProps> = ({ currentUser, setActivePage }) => {
  const [reviews, setReviews] = useState<Review[]>([
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
      entidad: 'Universidad',
      calificacion: 5,
      comentario: 'Excelente herramienta institucional para supervisar convenios y garantizar que los estudiantes realicen prácticas seguras y convalidables.',
      fecha: 'Hace 2 semanas'
    }
  ]);

  const [selectedFilter, setSelectedFilter] = useState<'todos' | UserRole>('todos');
  const [calificacion, setCalificacion] = useState<number>(5);
  const [comentario, setComentario] = useState<string>('');
  const [successToast, setSuccessToast] = useState<boolean>(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !comentario.trim()) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      autor: currentUser.nombre,
      rol: currentUser.rol,
      entidad: currentUser.entidad,
      calificacion,
      comentario: comentario.trim(),
      fecha: 'Justo ahora'
    };

    setReviews([newReview, ...reviews]);
    setComentario('');
    setCalificacion(5);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  const filteredReviews = selectedFilter === 'todos' 
    ? reviews 
    : reviews.filter((r) => r.rol === selectedFilter);

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
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-navy-800 bg-slate-100 text-tunder-navy px-2.5 py-0.5 rounded-full border border-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-tunder-orange" /> Universidad
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Cabecera */}
      <div className="max-w-3xl space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-tunder-navy">Reseñas y Experiencias del Ecosistema</h1>
        <p className="text-slate-600 text-sm">
          Conoce las valoraciones dejadas por estudiantes, empresas colaboradoras y las autoridades universitarias.
        </p>
      </div>

      {/* Formulario de Reseña */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-tunder-navy border-b border-slate-100 pb-3">
          <MessageSquarePlus className="w-5 h-5 text-tunder-orange" />
          <h2 className="text-base font-bold">Dejar una Reseña sobre TUnder</h2>
        </div>

        {successToast && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ¡Tu reseña ha sido publicada con éxito!
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
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setCalificacion(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition"
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tu Comentario / Experiencia</label>
              <textarea
                rows={3}
                required
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Cuéntanos cómo fue tu experiencia usando la plataforma..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-tunder-cyan"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-tunder-orange hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition shadow-md shadow-orange-500/20"
            >
              Publicar Reseña
            </button>
          </form>
        ) : (
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3">
            <Lock className="w-8 h-8 text-tunder-orange mx-auto" />
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Debes iniciar sesión con tu cuenta de Estudiante, Empresa o Universidad para publicar una reseña verificada.
            </p>
            <button
              onClick={() => setActivePage('login')}
              className="px-5 py-2 bg-tunder-navy hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition"
            >
              Iniciar Sesión para Opinar
            </button>
          </div>
        )}
      </div>

      {/* Filtro de Reseñas */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-700">Filtrar opiniones por actor:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['todos', 'estudiante', 'empresa', 'universidad'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                selectedFilter === filter
                  ? 'bg-tunder-navy text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {filter === 'todos' ? 'Todas las Reseñas' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Reseñas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{rev.autor}</h3>
                  <p className="text-[11px] text-slate-400">{rev.entidad}</p>
                </div>
                {getRoleBadge(rev.rol)}
              </div>

              {/* Estrellas */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= rev.calificacion
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed italic">
                "{rev.comentario}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
              Publicado {rev.fecha}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};