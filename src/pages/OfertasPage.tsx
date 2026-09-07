import React, { useState } from 'react';
import { Search, MapPin, Building, Clock, ArrowUpRight, Lock } from 'lucide-react';
import type { InternshipOffer, PageType, User } from '../types';

interface OfertasPageProps {
  currentUser: User | null;
  setActivePage: (page: PageType) => void;
}

export const OfertasPage: React.FC<OfertasPageProps> = ({ currentUser, setActivePage }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const ofertas: InternshipOffer[] = [
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
      descripcion: 'Desarrollo de módulos web e integración con microservicios para proyectos institucionales.'
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
      descripcion: 'Soporte en la consolidación de estados financieros y análisis de riesgo de cartera crediticia.'
    },
    {
      id: 3,
      titulo: 'Practicante de Optimización de Procesos',
      empresa: 'Logística Boliviana',
      carrera: 'Ingeniería Industrial',
      tipo: 'Tiempo Completo',
      modalidad: 'Presencial',
      validador: 'Convenio Acreditado',
      ubicacion: 'El Alto (Parque Industrial)',
      skills: ['Control de Calidad', 'Mapeo de Procesos'],
      descripcion: 'Relevamiento de tiempos y movimientos en líneas operativas de almacenamiento y distribución.'
    }
  ];

  const filtered = ofertas.filter((o) => 
    o.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.carrera.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.empresa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApply = () => {
    if (!currentUser) {
      setActivePage('login');
    } else if (currentUser.rol !== 'estudiante') {
      alert('Solo los perfiles con rol de Estudiante pueden postular a pasantías.');
    } else {
      alert('¡Postulación enviada con éxito! Tu Perfil Académico fue remitido a la empresa.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-extrabold text-tunder-navy">Convocatorias de Pasantías Activas</h1>
        <p className="text-slate-600 mt-1">Oportunidades validadas por las unidades académicas en La Paz.</p>
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

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-tunder-cyan transition hover:shadow-md flex flex-col justify-between space-y-4">
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

            <button 
              onClick={handleApply}
              className="w-full py-2 bg-slate-50 hover:bg-tunder-cyan hover:text-white text-tunder-navy text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5"
            >
              {currentUser ? (
                <>Postular con Perfil TUnder <ArrowUpRight className="w-3.5 h-3.5" /></>
              ) : (
                <>Iniciar Sesión para Postular <Lock className="w-3.5 h-3.5 text-tunder-orange" /></>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};