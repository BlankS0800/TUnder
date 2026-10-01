import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Save, 
  Plus, 
  X, 
  User as UserIcon, 
  GraduationCap, 
  Clock, 
  Laptop, 
  Sparkles,
  ShieldCheck,
  Building,
  MapPin,
  Trash2,
  FileText,
  AlertCircle
} from 'lucide-react';
import type { StudentProfile, User, StudentApplication } from '../types';
import { profileService } from '../services/profileService';
import { applicationsService } from '../services/applicationsService';

interface EstudiantesPageProps {
  currentUser?: User | null;
}

export const EstudiantesPage: React.FC<EstudiantesPageProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'perfil' | 'postulaciones'>('perfil');
  const [profile, setProfile] = useState<StudentProfile>({
    nombre: currentUser?.nombre || 'Mikaela Mendoza',
    carrera: currentUser?.carrera || 'Informática',
    universidad: currentUser?.universidad || 'Universidad Mayor de San Andrés (UMSA)',
    semestre: currentUser?.semestre || '8vo Semestre',
    disponibilidad: currentUser?.disponibilidad || 'Medio Tiempo (Mañanas)',
    modalidad: currentUser?.modalidad || 'Híbrida',
    habilidades: currentUser?.habilidades && currentUser.habilidades.length > 0
      ? currentUser.habilidades
      : ['React', 'TypeScript', 'Bases de Datos SQL', 'Tailwind CSS', 'Git & GitHub'],
    verificado: currentUser?.verificado ?? true,
    ci: currentUser?.ci || '9845124 LP'
  });

  const [formData, setFormData] = useState<StudentProfile>({ ...profile });
  const [newSkill, setNewSkill] = useState<string>('');
  const [showSavedToast, setShowSavedToast] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [myApplications, setMyApplications] = useState<StudentApplication[]>([]);
  const [loadingApps, setLoadingApps] = useState<boolean>(false);

  useEffect(() => {
    loadProfile();
    loadApplications();
  }, [currentUser]);

  const loadProfile = async () => {
    try {
      const fetched = await profileService.getStudentProfile(currentUser?.id);
      if (fetched) {
        setProfile(fetched);
        setFormData(fetched);
      }
    } catch (err) {
      console.error('Error cargando perfil:', err);
    }
  };

  const loadApplications = async () => {
    setLoadingApps(true);
    try {
      const apps = await applicationsService.getStudentApplications(currentUser?.id || 'demo-student-uuid');
      setMyApplications(apps);
    } catch (err) {
      console.error('Error cargando postulaciones:', err);
    } finally {
      setLoadingApps(false);
    }
  };

  const semestresDisponibles = [
    '5to Semestre',
    '6to Semestre',
    '7mo Semestre',
    '8vo Semestre',
    '9no Semestre',
    '10mo Semestre / Egresado'
  ];

  const disponibilidades = [
    'Medio Tiempo (Mañanas 08:00 - 12:00)',
    'Medio Tiempo (Tardes 14:00 - 18:00)',
    'Tiempo Completo (Horario Flexible)',
    'Por Horas / Fines de Semana'
  ];

  const modalidades = ['Presencial', 'Híbrida', 'Remoto'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !formData.habilidades.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        habilidades: [...prev.habilidades, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      habilidades: prev.habilidades.filter((s) => s !== skillToRemove)
    }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await profileService.updateStudentProfile(currentUser?.id, formData);
      setProfile({ ...formData });
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
    } catch (err) {
      console.error('Error guardando perfil:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelApplication = async (appId: string) => {
    if (confirm('¿Deseas retirar tu postulación a esta convocatoria?')) {
      const ok = await applicationsService.cancelApplication(appId);
      if (ok) {
        setMyApplications(myApplications.filter((a) => a.id !== appId));
      }
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'Aceptado':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" /> Seleccionado / Aceptado
          </span>
        );
      case 'Rechazado':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
            <AlertCircle className="w-3.5 h-3.5" /> Convocatoria Cerrada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> En Revisión por Empresa
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-tunder-navy">Panel del Estudiante</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gestiona tu información académica y haz seguimiento en tiempo real a tus postulaciones de pasantía.
          </p>
        </div>

        {showSavedToast && (
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> ¡Perfil sincronizado en Supabase!
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('perfil')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'perfil'
              ? 'border-tunder-cyan text-tunder-cyan'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserIcon className="w-4 h-4" /> Mi Perfil Académico
        </button>
        <button
          onClick={() => setActiveTab('postulaciones')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'postulaciones'
              ? 'border-tunder-cyan text-tunder-cyan'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" /> Mis Postulaciones
          <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
            {myApplications.length}
          </span>
        </button>
      </div>

      {/* TAB: POSTULACIONES */}
      {activeTab === 'postulaciones' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-tunder-navy">Historial de Postulaciones</h2>
                <p className="text-xs text-slate-500">
                  Estado actualizado por las empresas que revisan tu currículum universitario.
                </p>
              </div>
              <button
                onClick={loadApplications}
                className="text-xs font-bold text-tunder-cyan hover:underline"
              >
                Actualizar lista
              </button>
            </div>

            {loadingApps ? (
              <div className="py-12 text-center text-xs text-slate-500">Cargando postulaciones...</div>
            ) : myApplications.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <p className="text-sm font-bold text-slate-700">Aún no te has postulado a ninguna pasantía.</p>
                <p className="text-xs text-slate-500">
                  Explora las convocatorias abiertas y postula con un solo clic con tu perfil validado.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myApplications.map((app) => (
                  <div
                    key={app.id}
                    className="p-5 border border-slate-200 rounded-2xl hover:border-slate-300 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-tunder-navy text-sm sm:text-base">{app.offer_titulo}</h4>
                        {getStatusBadge(app.estado)}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <Building className="w-3.5 h-3.5 text-tunder-cyan" /> {app.offer_empresa}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-tunder-orange" /> {app.offer_ubicacion}
                        </span>
                        <span>Jornada: {app.offer_tipo}</span>
                        <span>Postulado el: {app.fechaPostulacion}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleCancelApplication(app.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition text-xs font-semibold flex items-center gap-1"
                        title="Retirar postulación"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="sm:hidden">Retirar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: PERFIL ACADÉMICO */}
      {activeTab === 'perfil' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vista previa del Perfil */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 sticky top-24">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  Vista Previa Institucional
                </span>
                {profile.verificado && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                    <ShieldCheck className="w-3.5 h-3.5" /> Acreditado
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-tunder-navy to-tunder-cyan flex items-center justify-center font-black text-lg text-white shadow-md">
                  {getInitials(profile.nombre) || 'ES'}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-tunder-navy text-base truncate">{profile.nombre}</h3>
                  <p className="text-xs font-semibold text-tunder-cyan truncate">{profile.carrera}</p>
                  <p className="text-[11px] text-slate-400 truncate">{profile.universidad}</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-tunder-cyan" /> Semestre:
                  </span>
                  <span className="font-semibold text-slate-800">{profile.semestre}</span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-tunder-orange" /> Disponibilidad:
                  </span>
                  <span className="font-semibold text-slate-800 text-right truncate max-w-[150px]">
                    {profile.disponibilidad}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Laptop className="w-4 h-4 text-indigo-500" /> Modalidad:
                  </span>
                  <span className="font-semibold text-slate-800">{profile.modalidad}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Habilidades & Tecnologías:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.habilidades.map((skill, index) => (
                    <span
                      key={index}
                      className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 font-medium rounded-lg flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-tunder-orange" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de Edición */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-tunder-navy">Actualizar Datos Académicos</h2>
                <p className="text-xs text-slate-500">
                  Esta información se sincroniza directamente con tu perfil en Supabase y será vista por los reclutadores.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-tunder-cyan"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cédula de Identidad (CI)</label>
                  <input
                    type="text"
                    name="ci"
                    value={formData.ci || ''}
                    onChange={handleChange}
                    placeholder="Ej. 9845124 LP"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-tunder-cyan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Carrera</label>
                  <input
                    type="text"
                    name="carrera"
                    value={formData.carrera}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-tunder-cyan"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Universidad / Institución</label>
                  <input
                    type="text"
                    name="universidad"
                    value={formData.universidad}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-tunder-cyan"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Semestre Actual</label>
                  <select
                    name="semestre"
                    value={formData.semestre}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-tunder-cyan"
                  >
                    {semestresDisponibles.map((sem) => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Modalidad Preferida</label>
                  <select
                    name="modalidad"
                    value={formData.modalidad}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-tunder-cyan"
                  >
                    {modalidades.map((mod) => (
                      <option key={mod} value={mod}>{mod}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Horario y Disponibilidad</label>
                <select
                  name="disponibilidad"
                  value={formData.disponibilidad}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-tunder-cyan"
                >
                  {disponibilidades.map((disp) => (
                    <option key={disp} value={disp}>{disp}</option>
                  ))}
                </select>
              </div>

              {/* Habilidades */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700">Competencias y Habilidades Técnicas</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Ej. Python, Docker, Análisis Contable..."
                    className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-tunder-cyan"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Agregar
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {formData.habilidades.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-sky-50 text-tunder-navy border border-sky-200 text-xs font-semibold rounded-xl flex items-center gap-2"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-tunder-navy hover:bg-slate-900 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-md shadow-blue-950/20"
                >
                  <Save className="w-4 h-4 text-tunder-orange" />
                  {saving ? 'Guardando en Supabase...' : 'Guardar Perfil'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};