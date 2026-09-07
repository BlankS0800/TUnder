import React, { useState } from 'react';
import { Zap, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import type { PageType, User } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  setActivePage: (page: PageType) => void;
}

// Credenciales por defecto del ecosistema
const DEFAULT_ACCOUNTS = [
  {
    email: 'estudiante@gmail.com',
    password: '123',
    user: {
      email: 'estudiante@gmail.com',
      nombre: 'Mikaela Mendoza',
      rol: 'estudiante' as const,
      entidad: 'UMSA'
    }
  },
  {
    email: 'empresa@gmail.com',
    password: '123',
    user: {
      email: 'empresa@gmail.com',
      nombre: 'Tech S.R.L.',
      rol: 'empresa' as const,
      entidad: 'Sector Tecnológico La Paz'
    }
  },
  {
    email: 'convenios@gmail.com',
    password: '123',
    user: {
      email: 'convenios@gmail.com',
      nombre: 'Dirección de Carrera',
      rol: 'universidad' as const,
      entidad: 'UMSA'
    }
  }
];

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, setActivePage }) => {
  const [email, setEmail] = useState<string>('estudiante@gmail.com');
  const [password, setPassword] = useState<string>('123');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const match = DEFAULT_ACCOUNTS.find(
      acc => acc.email.toLowerCase() === email.trim().toLowerCase() && acc.password === password
    );

    if (match) {
      onLoginSuccess(match.user);
      // Redirige según el rol autenticado
      if (match.user.rol === 'estudiante') setActivePage('estudiantes');
      else if (match.user.rol === 'empresa') setActivePage('empresas');
      else setActivePage('universidad');
    } else {
      setError('Credenciales inválidas. Usa una de las cuentas de prueba disponibles.');
    }
  };

  const handleQuickFill = (accEmail: string, accPass: string) => {
    setEmail(accEmail);
    setPassword(accPass);
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md space-y-6">
        {/* Encabezado */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-tunder-navy to-tunder-cyan items-center justify-center text-white shadow-md">
            <Zap className="w-7 h-7 text-tunder-orange fill-tunder-orange" />
          </div>
          <h1 className="text-2xl font-black text-tunder-navy">Ingresar a TUnder</h1>
          <p className="text-xs text-slate-500">Plataforma Universitaria de Intermediación de Pasantías</p>
        </div>

        {/* Tarjeta de Formulario */}
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-tunder-cyan"
                  placeholder="ejemplo@correo.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-tunder-cyan"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-tunder-orange hover:bg-orange-600 text-white text-sm font-bold rounded-lg transition shadow-md shadow-orange-500/20 flex items-center justify-center gap-2"
            >
              Iniciar Sesión <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Cuentas por defecto para pruebas */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Accesos de Prueba (Click para autocompletar):
            </span>
            <div className="space-y-1.5">
              {DEFAULT_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleQuickFill(acc.email, acc.password)}
                  className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition border flex justify-between items-center ${
                    email === acc.email
                      ? 'bg-sky-50 border-tunder-cyan text-tunder-navy font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>
                    <strong className="capitalize">{acc.user.rol}:</strong> {acc.email}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">pass: 123</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};