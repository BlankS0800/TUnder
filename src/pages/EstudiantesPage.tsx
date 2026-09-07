import React, { useState } from 'react';
import { 
  CheckCircle, 
  Save, 
  Plus, 
  X, 
  User, 
  GraduationCap, 
  Clock, 
  Laptop, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import type { StudentProfile } from '../types';

export const EstudiantesPage: React.FC = () => {
  // Estado principal del perfil
  const [profile, setProfile] = useState<StudentProfile>({
    nombre: 'Mikaela Mendoza',
    carrera: 'Informática',
    universidad: 'Universidad Mayor de San Andrés (UMSA)',
    semestre: '8vo Semestre',
    disponibilidad: 'Medio Tiempo (Mañanas)',
    modalidad: 'Híbrida',
    habilidades: ['React', 'TypeScript', 'Bases de Datos SQL', 'Tailwind CSS', 'Git & GitHub'],
    verificado: true,
  });

  // Estado del formulario de edición
  const [formData, setFormData] = useState<StudentProfile>({ ...profile });
  const [newSkill, setNewSkill] = useState<string>('');
  const [showSavedToast, setShowSavedToast] = useState<boolean>(false);

  // Opciones predefinidas
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

  // Manejadores de cambios
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

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({ ...formData });
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  // Obtener iniciales para el avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-tunder-navy">Mi Perfil de Pasantía</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Mantén tu información actualizada para recibir convocatorias compatibles con tu horario y carrera.
          </p>
        </div>

        {showSavedToast && (
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> ¡Perfil actualizado exitosamente!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Vista previa en vivo del Perfil */}
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
                  <GraduationCap className="w-3.5 h-3.5 text-tunder-cyan" /> Nivel Académico:
                </span>
                <span className="font-bold text-slate-800">{profile.semestre}</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-tunder-orange" /> Disponibilidad:
                </span>
                <span className="font-bold text-slate-800 text-right">{profile.disponibilidad}</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5 text-tunder-blue" /> Modalidad:
                </span>
                <span className="font-bold text-slate-800">{profile.modalidad}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Competencias y Skills ({profile.habilidades.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {profile.habilidades.map((skill) => (
                  <span
                    key={skill}
                    className="text-[11px] px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de Modificación de Datos */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-tunder-navy border-b border-slate-100 pb-4">
              <User className="w-5 h-5 text-tunder-cyan" />
              <h2 className="text-lg font-bold">Datos Personales y Universitarios</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  name="nombre"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-tunder-cyan"
                  placeholder="Tu nombre y apellido"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Carrera</label>
                <input
                  type="text"
                  name="carrera"
                  required
                  value={formData.carrera}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-tunder-cyan"
                  placeholder="Ej. Informática"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Universidad / Sede</label>
                <input
                  type="text"
                  name="universidad"
                  required
                  value={formData.universidad}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-tunder-cyan"
                  placeholder="Ej. UMSA - La Paz"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Semestre Actual</label>
                <select
                  name="semestre"
                  value={formData.semestre}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-tunder-cyan bg-white"
                >
                  {semestresDisponibles.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 text-tunder-navy border-b border-slate-100 pb-4 pt-2">
              <Clock className="w-5 h-5 text-tunder-orange" />
              <h2 className="text-lg font-bold">Condiciones de Pasantía</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Disponibilidad de Horario</label>
                <select
                  name="disponibilidad"
                  value={formData.disponibilidad}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-tunder-cyan bg-white"
                >
                  {disponibilidades.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Modalidad Preferida</label>
                <select
                  name="modalidad"
                  value={formData.modalidad}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-tunder-cyan bg-white"
                >
                  {modalidades.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 text-tunder-navy border-b border-slate-100 pb-4 pt-2">
              <Sparkles className="w-5 h-5 text-tunder-cyan" />
              <h2 className="text-lg font-bold">Habilidades, Tecnologías y Conocimientos</h2>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Agregar habilidad (Ej. Python, Figma, Contabilidad...)"
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
                  <Plus className="w-4 h-4" /> Añadir
                </button>
              </div>

              <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200/60 rounded-2xl min-h-[50px] items-center">
                {formData.habilidades.length === 0 ? (
                  <span className="text-xs text-slate-400">No has agregado ninguna habilidad aún.</span>
                ) : (
                  formData.habilidades.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 text-slate-800 rounded-xl text-xs font-semibold shadow-xs"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-slate-400 hover:text-red-600 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3 bg-tunder-orange hover:bg-orange-600 text-white font-bold rounded-xl transition shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 text-sm"
              >
                <Save className="w-4 h-4" /> Guardar Cambios en mi Perfil
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};