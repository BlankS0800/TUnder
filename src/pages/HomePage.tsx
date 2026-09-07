import React from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Building2, 
  GraduationCap, 
  CheckCircle2
} from 'lucide-react';
import type { PageType, User } from '../types';

interface HomePageProps {
  setPage: (page: PageType) => void;
  currentUser: User | null;
}

export const HomePage: React.FC<HomePageProps> = ({ setPage, currentUser }) => {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero Institucional */}
      <section className="relative overflow-hidden pt-12 lg:pt-20 bg-gradient-to-b from-sky-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/*<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-tunder-cyan text-xs font-bold tracking-wide border border-sky-200">
              <Zap className="w-4 h-4 text-tunder-orange fill-tunder-orange" />
              Portal Oficial de Pasantías y Prácticas Preprofesionales
            </div>*/}
           

            <h1 className="text-4xl sm:text-6xl font-black text-tunder-navy tracking-tight leading-tight">
              Conectamos el talento universitario con las mejores <span className="text-transparent bg-clip-text bg-gradient-to-r from-tunder-cyan to-tunder-orange">empresas del país</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              La plataforma oficial donde las empresas publican convocatorias exclusivas y los estudiantes acceden a pasantías con respaldo académico formal.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button 
                onClick={() => setPage('ofertas')} 
                className="px-7 py-3.5 rounded-xl bg-tunder-orange text-white font-bold hover:bg-orange-600 transition flex items-center gap-2 shadow-xl shadow-orange-500/25 text-sm"
              >
                Explorar Convocatorias <ArrowRight className="w-4 h-4" />
              </button>
              
              {!currentUser ? (
                <button 
                  onClick={() => setPage('register')} 
                  className="px-7 py-3.5 rounded-xl bg-white border border-slate-300 text-tunder-navy font-bold hover:bg-slate-50 transition text-sm shadow-sm"
                >
                  Registrarse en la Plataforma
                </button>
              ) : (
                <button 
                  onClick={() => setPage(currentUser.rol === 'universidad' ? 'universidad' : currentUser.rol === 'empresa' ? 'empresas' : 'estudiantes')} 
                  className="px-7 py-3.5 rounded-xl bg-tunder-blue text-white font-bold hover:bg-tunder-navy transition flex items-center gap-2 shadow-lg text-sm"
                >
                  Ir a mi Panel ({currentUser.rol}) <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Estadísticas de Impacto */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
            <div className="text-center p-3 border-r border-slate-100 last:border-0">
              <div className="text-2xl sm:text-3xl font-black text-tunder-navy">100%</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Convocatorias Validadas</div>
            </div>
            <div className="text-center p-3 sm:border-r border-slate-100 last:border-0">
              <div className="text-2xl sm:text-3xl font-black text-tunder-cyan">Acreditado</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Modalidad de Titulación</div>
            </div>
            <div className="text-center p-3 border-r border-slate-100 last:border-0">
              <div className="text-2xl sm:text-3xl font-black text-tunder-orange">Directo</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Sin Intermediarios Dispersos</div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl sm:text-3xl font-black text-slate-800">La Paz</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Sede Universitaria</div>
            </div>
          </div>
        </div>
      </section>

      {/* Secciones para Estudiantes y Empresas */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tarjeta Estudiantes */}
          <div className="bg-gradient-to-br from-white to-sky-50/50 border border-sky-100 rounded-3xl p-8 space-y-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-tunder-cyan flex items-center justify-center">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-tunder-navy">Para Estudiantes Universitarios</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Postula a prácticas preprofesionales formales que respetan tus horarios de clase y convalidan tu avance de graduación.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-tunder-cyan shrink-0" />
                  Perfil basado en materias aprobadas y proyectos académicos.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-tunder-cyan shrink-0" />
                  Convocatorias verificadas institucionalmente por la dirección de carrera.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-tunder-cyan shrink-0" />
                  Certificación directa de horas de pasantía completadas.
                </li>
              </ul>
            </div>
            <button
              onClick={() => setPage(currentUser ? 'estudiantes' : 'register')}
              className="w-full py-3 bg-tunder-navy hover:bg-slate-900 text-white font-bold rounded-xl transition text-xs flex items-center justify-center gap-2"
            >
              Crear Perfil Académico <ArrowRight className="w-4 h-4 text-tunder-orange" />
            </button>
          </div>

          {/* Tarjeta Empresas */}
          <div className="bg-gradient-to-br from-white to-orange-50/50 border border-orange-100 rounded-3xl p-8 space-y-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-tunder-orange flex items-center justify-center">
                <Building2 className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-tunder-navy">Para Empresas e Instituciones</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Publica ofertas con requisitos formativos puntuales e incorpora a los perfiles más capacitados de las diferentes facultades.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-tunder-orange shrink-0" />
                  Acceso directo a estudiantes de semestres avanzados.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-tunder-orange shrink-0" />
                  Convenios formales y marco legal institucional garantizado.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-tunder-orange shrink-0" />
                  Emparejamiento según disponibilidad de tiempo y competencias.
                </li>
              </ul>
            </div>
            <button
              onClick={() => setPage(currentUser ? 'empresas' : 'register')}
              className="w-full py-3 bg-tunder-orange hover:bg-orange-600 text-white font-bold rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/20"
            >
              Publicar Convocatoria <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Banner de Garantía Institucional */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-tunder-navy text-white rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-tunder-cyan uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Plataforma Supervisada
            </div>
            <h3 className="text-xl sm:text-2xl font-black">Supervisión y Respaldo Institucional</h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Cada pasantía completada en TUnder cuenta con el registro y validación directa de la universidad para fines académicos y profesionales.
            </p>
          </div>
          <button
            onClick={() => setPage('ofertas')}
            className="px-6 py-3 bg-white text-tunder-navy hover:bg-slate-100 font-bold rounded-xl text-xs shrink-0 transition"
          >
            Ver Convocatorias
          </button>
        </div>
      </section>
    </div>
  );
};