import React from 'react';
import { LogIn, LogOut, UserPlus, LayoutDashboard } from 'lucide-react';
import type { PageType, User } from '../types';
import logoImagen from '../assets/logo_imagen.jpeg';

interface NavbarProps {
  activePage: PageType;
  setActivePage: (page: PageType) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage, currentUser, onLogout }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setActivePage('home')} 
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <img 
            src={logoImagen} 
            alt="TUnder Emblema" 
            className="h-12 w-auto object-contain rounded-xl shadow-xs group-hover:scale-105 transition-transform duration-200"
          />
          <div className="leading-tight">
            <span className="text-2xl font-black tracking-tight text-tunder-navy">
              T<span className="text-tunder-orange">UNDER</span>
            </span>
            <span className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Plataforma de Pasantías
            </span>
          </div>
        </div>

        {/* Links Públicos */}
        <nav className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setActivePage('home')}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
              activePage === 'home'
                ? 'text-tunder-cyan bg-sky-50 font-bold'
                : 'text-slate-600 hover:text-tunder-navy hover:bg-slate-50'
            }`}
          >
            Información
          </button>

          <button
            onClick={() => setActivePage('ofertas')}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
              activePage === 'ofertas'
                ? 'text-tunder-cyan bg-sky-50 font-bold'
                : 'text-slate-600 hover:text-tunder-navy hover:bg-slate-50'
            }`}
          >
            Convocatorias
          </button>

          <button
            onClick={() => setActivePage('resenas')}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
              activePage === 'resenas'
                ? 'text-tunder-cyan bg-sky-50 font-bold'
                : 'text-slate-600 hover:text-tunder-navy hover:bg-slate-50'
            }`}
          >
            Reseñas
          </button>

          {/* Panel Privado */}
          {currentUser && (
            <button
              onClick={() => setActivePage(
                currentUser.rol === 'estudiante' 
                  ? 'estudiantes' 
                  : currentUser.rol === 'empresa' 
                  ? 'empresas' 
                  : 'universidad'
              )}
              className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                ['estudiantes', 'empresas', 'universidad'].includes(activePage)
                  ? 'text-white bg-tunder-blue shadow-sm'
                  : 'text-tunder-navy bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-tunder-orange" />
              Panel {currentUser.rol.charAt(0).toUpperCase() + currentUser.rol.slice(1)}
            </button>
          )}
        </nav>

        {/* Auth Area */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <span className="block text-xs font-bold text-tunder-navy">{currentUser.nombre}</span>
                <span className="block text-[10px] text-slate-500 font-medium capitalize">{currentUser.entidad}</span>
              </div>
              <button
                onClick={onLogout}
                title="Cerrar sesión"
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivePage('register')}
                className="px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 text-slate-700 hover:bg-slate-100"
              >
                <UserPlus className="w-3.5 h-3.5 text-tunder-cyan" /> Registrarse
              </button>
              <button
                onClick={() => setActivePage('login')}
                className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-tunder-orange hover:bg-orange-600 transition shadow-sm flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" /> Iniciar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};