import React from 'react';
import { LogIn, LogOut, UserPlus, LayoutDashboard, Menu, X } from 'lucide-react';
import type { PageType, User } from '../types';
import logoImagen from '../assets/logo_imagen.jpeg';

interface NavbarProps {
  activePage: PageType;
  setActivePage: (page: PageType) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage, currentUser, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navigate = (page: PageType) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  const dashboardPage: PageType = currentUser?.rol === 'estudiante'
    ? 'estudiantes'
    : currentUser?.rol === 'empresa'
      ? 'empresas'
      : 'universidad';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-20 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo */}
        <div 
          onClick={() => navigate('home')} 
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
            onClick={() => navigate('home')}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
              activePage === 'home'
                ? 'text-tunder-cyan bg-sky-50 font-bold'
                : 'text-slate-600 hover:text-tunder-navy hover:bg-slate-50'
            }`}
          >
            Información
          </button>

          <button
            onClick={() => navigate('ofertas')}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
              activePage === 'ofertas'
                ? 'text-tunder-cyan bg-sky-50 font-bold'
                : 'text-slate-600 hover:text-tunder-navy hover:bg-slate-50'
            }`}
          >
            Convocatorias
          </button>

          <button
            onClick={() => navigate('resenas')}
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
              onClick={() => navigate(dashboardPage)}
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
        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <span className="block text-xs font-bold text-tunder-navy">{currentUser.nombre}</span>
                <span className="block text-[10px] text-slate-500 font-medium capitalize">{currentUser.entidad}</span>
              </div>
              <button
                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                title="Cerrar sesión"
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('register')}
                className="hidden sm:flex px-3.5 py-2 text-xs font-bold rounded-xl transition items-center gap-1.5 text-slate-700 hover:bg-slate-100"
              >
                <UserPlus className="w-3.5 h-3.5 text-tunder-cyan" /> Registrarse
              </button>
              <button
                onClick={() => navigate('login')}
                className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-tunder-orange hover:bg-orange-600 transition shadow-sm flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" /> Iniciar Sesión
              </button>
            </div>
          )}
          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-tunder-navy hover:bg-slate-100 rounded-xl transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-slate-100 bg-white px-4 py-3 sm:px-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            <button onClick={() => navigate('home')} className={`w-full rounded-xl px-3 py-3 text-left text-sm font-semibold ${activePage === 'home' ? 'bg-sky-50 text-tunder-cyan' : 'text-slate-700 hover:bg-slate-50'}`}>Información</button>
            <button onClick={() => navigate('ofertas')} className={`w-full rounded-xl px-3 py-3 text-left text-sm font-semibold ${activePage === 'ofertas' ? 'bg-sky-50 text-tunder-cyan' : 'text-slate-700 hover:bg-slate-50'}`}>Convocatorias</button>
            <button onClick={() => navigate('resenas')} className={`w-full rounded-xl px-3 py-3 text-left text-sm font-semibold ${activePage === 'resenas' ? 'bg-sky-50 text-tunder-cyan' : 'text-slate-700 hover:bg-slate-50'}`}>Reseñas</button>
            {currentUser && <button onClick={() => navigate(dashboardPage)} className="w-full rounded-xl bg-slate-100 px-3 py-3 text-left text-sm font-bold text-tunder-navy">Panel {currentUser.rol.charAt(0).toUpperCase() + currentUser.rol.slice(1)}</button>}
            {!currentUser && <button onClick={() => navigate('register')} className="w-full rounded-xl px-3 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50">Registrarse</button>}
          </div>
        </nav>
      )}
    </header>
  );
};