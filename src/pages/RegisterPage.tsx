import React, { useState } from 'react';
import { Zap, ArrowRight, GraduationCap, Building2 } from 'lucide-react';
import type { PageType, User } from '../types';

interface RegisterPageProps {
  onRegisterSuccess: (user: User) => void;
  setActivePage: (page: PageType) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onRegisterSuccess, setActivePage }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState<'estudiante' | 'empresa'>('estudiante');
  const [carreraOSector, setCarreraOSector] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      nombre,
      email,
      rol,
      entidad: carreraOSector || (rol === 'estudiante' ? 'Carrera Universitaria' : 'Empresa Aliada')
    };
    onRegisterSuccess(newUser);
    if (rol === 'estudiante') setActivePage('estudiantes');
    else setActivePage('empresas');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-tunder-navy to-tunder-cyan items-center justify-center text-white shadow-md">
            <Zap className="w-7 h-7 text-tunder-orange fill-tunder-orange" />
          </div>
          <h1 className="text-2xl font-black text-tunder-navy">Crear Cuenta en TUnder</h1>
          <p className="text-xs text-slate-500">Portal oficial de pasantías universitarias</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm space-y-5">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Registro</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRol('estudiante')}
                  className={`py-2.5 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-2 transition ${
                    rol === 'estudiante'
                      ? 'bg-sky-50 border-tunder-cyan text-tunder-navy shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-tunder-cyan" /> Soy Estudiante
                </button>
                <button
                  type="button"
                  onClick={() => setRol('empresa')}
                  className={`py-2.5 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-2 transition ${
                    rol === 'empresa'
                      ? 'bg-orange-50 border-tunder-orange text-tunder-navy shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-tunder-orange" /> Soy Empresa
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {rol === 'estudiante' ? 'Nombre Completo' : 'Razón Social de la Empresa'}
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder={rol === 'estudiante' ? 'Ej. Mikaela Mendoza' : 'Ej. TechBolivia S.R.L.'}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-tunder-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {rol === 'estudiante' ? 'Carrera' : 'Rubro o Sector Productivo'}
              </label>
              <input
                type="text"
                required
                value={carreraOSector}
                onChange={(e) => setCarreraOSector(e.target.value)}
                placeholder={rol === 'estudiante' ? 'Ej. Informática / Economía' : 'Ej. Tecnología, Banca, Logística'}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-tunder-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@dominio.com"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-tunder-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-tunder-cyan"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-tunder-navy hover:bg-slate-900 text-white text-sm font-bold rounded-lg transition flex items-center justify-center gap-2 shadow-md shadow-blue-950/10"
            >
              Completar Registro <ArrowRight className="w-4 h-4 text-tunder-orange" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">
            ¿Ya tienes una cuenta?{' '}
            <button onClick={() => setActivePage('login')} className="text-tunder-cyan font-bold hover:underline">
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};