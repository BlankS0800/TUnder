import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building, Clock, ArrowUpRight, Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import type { InternshipOffer, PageType, User } from '../types';
import { offersService } from '../services/offersService';
import { applicationsService } from '../services/applicationsService';

interface OfertasPageProps {
  currentUser: User | null;
  setActivePage: (page: PageType) => void;
}

export const OfertasPage: React.FC<OfertasPageProps> = ({ currentUser, setActivePage }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [ofertas, setOfertas] = useState<InternshipOffer[]>([]);
  const [appliedOfferIds, setAppliedOfferIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [applyingId, setApplyingId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadOffers();
  }, [searchTerm]);

  useEffect(() => {
    if (currentUser?.id && currentUser.rol === 'estudiante') {
      loadStudentApplications();
    }
  }, [currentUser]);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const data = await offersService.getOffers(searchTerm);
      setOfertas(data);
    } catch (err) {
      console.error('Error cargando convocatorias:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStudentApplications = async () => {
    if (!currentUser?.id) return;
    try {
      const myApps = await applicationsService.getStudentApplications(currentUser.id);
      setAppliedOfferIds(myApps.map((a) => a.offer_id));
    } catch (err) {
      console.error('Error cargando postulaciones del alumno:', err);
    }
  };

  const showToast = (text: string, type: 'success' | 'error') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleApply = async (offerId: number) => {
    if (!currentUser) {
      setActivePage('login');
      return;
    }

    if (currentUser.rol !== 'estudiante') {
      showToast('Solo los perfiles con rol de Estudiante pueden postular a pasantías.', 'error');
      return;
    }

    setApplyingId(offerId);
    try {
      const result = await applicationsService.applyToOffer(offerId, currentUser.id || 'demo-student-uuid');
      if (result.success) {
        setAppliedOfferIds((prev) => [...prev, offerId]);
        showToast(result.message, 'success');
      } else {
        showToast(result.message, 'error');
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Error al procesar postulación', 'error');
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Toast Notificación */}
      {toastMessage && (
        <div
          className={`fixed top-24 right-4 z-50 max-w-md p-4 rounded-2xl shadow-xl border flex items-center gap-3 animate-fade-in ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span className="text-xs font-semibold">{toastMessage.text}</span>
        </div>
      )}

      <div className="max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-tunder-navy">Convocatorias de Pasantías Activas</h1>
        <p className="text-slate-600 mt-1">
          Oportunidades laborales validadas y supervisadas por las unidades académicas en La Paz.
        </p>
      </div>

      {/* Buscador */}
      <div className="relative max-w-xl">
        <Search className="w-5 h-5 absolute left-3 top-3.5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Buscar por carrera, empresa o especialidad..." 
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-tunder-cyan shadow-sm"
        />
      </div>

      {/* Loader */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 text-tunder-cyan animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Sincronizando convocatorias desde la base de datos...</p>
        </div>
      ) : ofertas.length === 0 ? (
        <div className="py-16 text-center bg-white border border-slate-200 rounded-2xl p-8 space-y-2">
          <p className="font-bold text-slate-700">No se encontraron convocatorias</p>
          <p className="text-xs text-slate-500">Prueba ajustando el término de búsqueda o revisa más tarde.</p>
        </div>
      ) : (
        /* Grid de Convocatorias */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ofertas.map((item) => {
            const hasApplied = appliedOfferIds.includes(item.id);
            const isSubmitting = applyingId === item.id;

            return (
              <div 
                key={item.id} 
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-tunder-cyan transition hover:shadow-md flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-tunder-cyan uppercase">
                      {item.validador}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {item.tipo}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 leading-snug">{item.titulo}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <Building className="w-3.5 h-3.5" /> {item.empresa}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">{item.descripcion}</p>

                  <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <p><strong>Carrera:</strong> {item.carrera}</p>
                    <p className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-tunder-orange" /> {item.modalidad} - {item.ubicacion}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.skills.map((s) => (
                      <span key={s} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {hasApplied ? (
                  <button 
                    disabled
                    className="w-full py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-default"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Ya te has postulado
                  </button>
                ) : (
                  <button 
                    onClick={() => handleApply(item.id)}
                    disabled={isSubmitting}
                    className="w-full py-2 bg-slate-50 hover:bg-tunder-cyan hover:text-white text-tunder-navy text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Procesando...
                      </>
                    ) : currentUser ? (
                      <>
                        Postular con Perfil TUnder <ArrowUpRight className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        Iniciar Sesión para Postular <Lock className="w-3.5 h-3.5 text-tunder-orange" />
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};