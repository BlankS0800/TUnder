import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Trash2, 
  Clock, 
  MapPin, 
  Briefcase, 
  X, 
  CheckCircle2, 
  Users, 
  Check, 
  XCircle, 
  ChevronDown, 
  ChevronUp,
  GraduationCap,
  AlertTriangle
} from 'lucide-react';
import type { InternshipOffer, User, ApplicationStatus } from '../types';

interface EmpresasPageProps {
  currentUser?: User | null;
}

export const EmpresasPage: React.FC<EmpresasPageProps> = ({ currentUser }) => {
  // Convocatorias gestionadas por la empresa
  const [misOfertas, setMisOfertas] = useState<InternshipOffer[]>([
    {
      id: 1,
      titulo: 'Pasante de Desarrollo Frontend',
      empresa: currentUser?.nombre || 'TechAndes S.R.L.',
      carrera: 'Informática / Sistemas',
      tipo: 'Medio Tiempo',
      modalidad: 'Híbrida',
      validador: 'Convenio Institucional Validado',
      ubicacion: 'La Paz (Sopocachi)',
      skills: ['React', 'TypeScript', 'Tailwind CSS'],
      descripcion: 'Desarrollo de interfaces de usuario interactivas e integración con APIs institucionales.',
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
        },
        {
          id: 'app-2',
          nombre: 'Rodrigo Flores',
          carrera: 'Informática (UMSA)',
          semestre: '7mo Semestre',
          disponibilidad: 'Tardes (14:00 - 18:00)',
          habilidades: ['JavaScript', 'HTML/CSS', 'Git'],
          fechaPostulacion: 'Hace 1 día',
          estado: 'Pendiente'
        }
      ]
    },
    {
      id: 2,
      titulo: 'Auxiliar de Análisis de Datos',
      empresa: currentUser?.nombre || 'TechAndes S.R.L.',
      carrera: 'Informática / Estadística',
      tipo: 'Medio Tiempo',
      modalidad: 'Remoto',
      validador: 'En Revisión por Universidad',
      ubicacion: 'La Paz',
      skills: ['Python', 'SQL', 'Power BI'],
      descripcion: 'Soporte en la limpieza, extracción y visualización de conjuntos de datos operativos.',
      postulantes: [] // Vacío porque aún no ha sido aprobada
    }
  ]);

  const [expandedOfferId, setExpandedOfferId] = useState<number | null>(1);
  const [showForm, setShowForm] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [carrera, setCarrera] = useState('');
  const [tipo, setTipo] = useState<'Medio Tiempo' | 'Tiempo Completo'>('Medio Tiempo');
  const [modalidad, setModalidad] = useState('Híbrida');
  const [ubicacion, setUbicacion] = useState('La Paz');
  const [descripcion, setDescripcion] = useState('');
  const [currentSkill, setCurrentSkill] = useState('');
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleUpdateStatus = (offerId: number, applicantId: string, newStatus: ApplicationStatus) => {
    setMisOfertas((prev) =>
      prev.map((offer) => {
        if (offer.id === offerId && offer.postulantes) {
          const updatedApplicants = offer.postulantes.map((applicant) =>
            applicant.id === applicantId ? { ...applicant, estado: newStatus } : applicant
          );
          return { ...offer, postulantes: updatedApplicants };
        }
        return offer;
      })
    );
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSkill.trim() && !skillsList.includes(currentSkill.trim())) {
      setSkillsList([...skillsList, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkillsList(skillsList.filter((s) => s !== skill));
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !carrera || !descripcion) return;

    const newOffer: InternshipOffer = {
      id: Date.now(),
      titulo,
      empresa: currentUser?.nombre || 'Empresa Aliada',
      carrera,
      tipo,
      modalidad,
      ubicacion,
      validador: 'En Revisión por Universidad',
      skills: skillsList.length > 0 ? skillsList : ['Competencias Generales'],
      descripcion,
      postulantes: []
    };

    setMisOfertas([newOffer, ...misOfertas]);
    setShowForm(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);

    setTitulo('');
    setCarrera('');
    setDescripcion('');
    setSkillsList([]);
  };

  const handleDeleteOffer = (id: number) => {
    if (confirm('¿Estás seguro de retirar esta convocatoria del catálogo?')) {
      setMisOfertas(misOfertas.filter((o) => o.id !== id));
      if (expandedOfferId === id) setExpandedOfferId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-tunder-navy to-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-tunder-orange text-xs font-bold uppercase tracking-wider border border-orange-500/30">
            <Building2 className="w-4 h-4" /> Portal de Reclutamiento Empresarial
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {currentUser?.nombre || 'Gestión de Convocatorias y Postulantes'}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Publica plazas de pasantía y gestiona a los universitarios postulados en convocatorias validadas por la institución.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-3 bg-tunder-orange hover:bg-orange-600 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition shadow-lg shadow-orange-500/30 shrink-0"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cerrar Formulario' : 'Nueva Convocatoria'}
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ¡Convocatoria enviada a revisión institucional! La universidad la validará en breve.
        </div>
      )}

      {/* FORMULARIO */}
      {showForm && (
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-tunder-navy border-b border-slate-100 pb-4">
            <Briefcase className="w-5 h-5 text-tunder-orange" />
            <h2 className="text-lg font-bold">Publicar Nueva Convocatoria de Pasantía</h2>
          </div>

          <form onSubmit={handleCreateOffer} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Título de la Convocatoria</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Pasante de Desarrollo Frontend"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-tunder-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Carrera / Área Académica</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Informática, Industrial, Economía"
                  value={carrera}
                  onChange={(e) => setCarrera(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-tunder-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Jornada</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as 'Medio Tiempo' | 'Tiempo Completo')}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-tunder-cyan bg-white"
                >
                  <option value="Medio Tiempo">Medio Tiempo</option>
                  <option value="Tiempo Completo">Tiempo Completo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Modalidad</label>
                <select
                  value={modalidad}
                  onChange={(e) => setModalidad(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-tunder-cyan bg-white"
                >
                  <option value="Presencial">Presencial</option>
                  <option value="Híbrida">Híbrida</option>
                  <option value="Remoto">Remoto</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ubicación / Sede</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. La Paz (Calacoto / Sopocachi)"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-tunder-cyan"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción y Funciones</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe las actividades formativas del pasante..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-tunder-cyan"
                />
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-slate-700">Requisitos Técnicos Deseados</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ej. React, Excel Avanzado, SQL..."
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-tunder-cyan"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(e);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {skillsList.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-50 text-tunder-navy border border-sky-200 text-xs font-semibold rounded-lg"
                  >
                    {skill}
                    <button type="button" onClick={() => handleRemoveSkill(skill)}>
                      <X className="w-3 h-3 text-slate-400 hover:text-red-500" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-tunder-navy hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition shadow-md"
              >
                Enviar a Revisión
              </button>
            </div>
          </form>
        </div>
      )}

      {/* LISTA DE CONVOCATORIAS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-tunder-navy">Convocatorias Publicadas ({misOfertas.length})</h2>
          <span className="text-xs text-slate-500">Solo las convocatorias validadas reciben postulaciones</span>
        </div>

        <div className="space-y-6">
          {misOfertas.map((offer) => {
            const isApproved = offer.validador.includes('Validado');
            const isExpanded = expandedOfferId === offer.id;
            const postulantes = offer.postulantes || [];
            const pendientes = postulantes.filter((p) => p.estado === 'Pendiente').length;

            return (
              <div
                key={offer.id}
                className={`bg-white border rounded-3xl overflow-hidden shadow-sm transition-all ${
                  isApproved ? 'border-slate-200' : 'border-amber-200/80 bg-amber-50/10'
                }`}
              >
                {/* Cabecera */}
                <div className="p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        isApproved
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {offer.validador}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {offer.tipo} • {offer.modalidad}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteOffer(offer.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition self-end sm:self-auto"
                      title="Eliminar convocatoria"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{offer.titulo}</h3>
                    <p className="text-xs text-slate-600 mt-1">{offer.descripcion}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-3 text-slate-500">
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-tunder-cyan" /> {offer.carrera}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-tunder-orange" /> {offer.ubicacion}
                      </span>
                    </div>

                    {isApproved ? (
                      <button
                        onClick={() => setExpandedOfferId(isExpanded ? null : offer.id)}
                        className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-2 text-xs ${
                          isExpanded
                            ? 'bg-tunder-navy text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <Users className="w-3.5 h-3.5 text-tunder-orange" />
                        Postulantes ({postulantes.length})
                        {pendientes > 0 && (
                          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        )}
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 font-semibold bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                        <AlertTriangle className="w-3.5 h-3.5" /> Esperando aprobación institucional
                      </span>
                    )}
                  </div>
                </div>

                {/* Bandeja de Postulantes (Solo si está aprobada) */}
                {isApproved && isExpanded && (
                  <div className="bg-slate-50 border-t border-slate-200 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Postulaciones recibidas para esta plaza
                      </h4>
                      <span className="text-xs text-slate-500">
                        {pendientes} pendiente(s) por evaluar
                      </span>
                    </div>

                    {postulantes.length === 0 ? (
                      <div className="text-center py-8 bg-white border border-slate-200/80 rounded-2xl">
                        <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs text-slate-500 font-medium">Aún no hay postulaciones registradas en esta oferta.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {postulantes.map((postulante) => (
                          <div
                            key={postulante.id}
                            className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3"
                          >
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="text-sm font-bold text-slate-900">{postulante.nombre}</h5>
                                  <p className="text-xs text-tunder-cyan font-medium">{postulante.carrera}</p>
                                </div>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    postulante.estado === 'Aceptado'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : postulante.estado === 'Rechazado'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {postulante.estado}
                                </span>
                              </div>

                              <div className="text-xs text-slate-600 space-y-1">
                                <p><strong>Semestre:</strong> {postulante.semestre}</p>
                                <p><strong>Disponibilidad:</strong> {postulante.disponibilidad}</p>
                              </div>

                              <div className="flex flex-wrap gap-1 pt-1">
                                {postulante.habilidades.map((h) => (
                                  <span key={h} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                                    {h}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                              <button
                                onClick={() => handleUpdateStatus(offer.id, postulante.id, 'Aceptado')}
                                disabled={postulante.estado === 'Aceptado'}
                                className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 ${
                                  postulante.estado === 'Aceptado'
                                    ? 'bg-emerald-600 text-white cursor-default'
                                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                }`}
                              >
                                <Check className="w-3.5 h-3.5" /> Aceptar
                              </button>

                              <button
                                onClick={() => handleUpdateStatus(offer.id, postulante.id, 'Rechazado')}
                                disabled={postulante.estado === 'Rechazado'}
                                className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 ${
                                  postulante.estado === 'Rechazado'
                                    ? 'bg-red-600 text-white cursor-default'
                                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                                }`}
                              >
                                <XCircle className="w-3.5 h-3.5" /> Rechazar
                              </button>

                              {postulante.estado !== 'Pendiente' && (
                                <button
                                  onClick={() => handleUpdateStatus(offer.id, postulante.id, 'Pendiente')}
                                  className="px-2 py-1.5 text-[10px] text-slate-400 hover:text-slate-700 rounded-lg"
                                  title="Restablecer a Pendiente"
                                >
                                  Revertir
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};