import React, { useState, useEffect } from 'react';
import type { PageType, User } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { EstudiantesPage } from './pages/EstudiantesPage';
import { EmpresasPage } from './pages/EmpresasPage';
import { UniversidadPage } from './pages/UniversidadPage';
import { OfertasPage } from './pages/OfertasPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ResenasPage } from './pages/ResenasPage';
import { authService } from './services/authService';
import { isSupabaseConfigured, supabase } from './lib/supabase';
import { Database, CheckCircle2, AlertCircle, X } from 'lucide-react';

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<PageType>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [showBackendModal, setShowBackendModal] = useState<boolean>(false);
  const isCloud = isSupabaseConfigured();

  useEffect(() => {
    // 1. Restaurar sesión de usuario (remota o local)
    const initAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error('Error restaurando usuario:', err);
      } finally {
        setLoadingUser(false);
      }
    };

    initAuth();

    // 2. Suscribirse a cambios de sesión si Supabase está activo
    if (isCloud) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const user = await authService.getCurrentUser();
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, [isCloud]);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    await authService.signOut();
    setCurrentUser(null);
    setActivePage('home');
  };

  const renderPage = (): React.ReactElement => {
    if (loadingUser) {
      return (
        <div className="flex-1 min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-tunder-cyan border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-500 font-medium">Iniciando plataforma TUnder...</p>
          </div>
        </div>
      );
    }

    switch (activePage) {
      case 'home':
        return <HomePage setPage={setActivePage} currentUser={currentUser} />;
      case 'ofertas':
        return <OfertasPage currentUser={currentUser} setActivePage={setActivePage} />;
      case 'resenas':
        return <ResenasPage currentUser={currentUser} setActivePage={setActivePage} />;
      case 'login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} setActivePage={setActivePage} />;
      case 'register':
        return <RegisterPage onRegisterSuccess={handleLoginSuccess} setActivePage={setActivePage} />;
      case 'estudiantes':
        return currentUser ? <EstudiantesPage currentUser={currentUser} /> : <LoginPage onLoginSuccess={handleLoginSuccess} setActivePage={setActivePage} />;
      case 'empresas':
        return currentUser ? <EmpresasPage currentUser={currentUser} /> : <LoginPage onLoginSuccess={handleLoginSuccess} setActivePage={setActivePage} />;
      case 'universidad':
        return currentUser ? <UniversidadPage /> : <LoginPage onLoginSuccess={handleLoginSuccess} setActivePage={setActivePage} />;
      default:
        return <HomePage setPage={setActivePage} currentUser={currentUser} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans relative">
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <main className="flex-1 min-w-0">
        {renderPage()}
      </main>
      <Footer />

      {/* Indicador de Estado del Backend Supabase */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setShowBackendModal(true)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold shadow-lg transition-all border ${
            isCloud
              ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60 hover:bg-emerald-900'
              : 'bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800'
          }`}
          title="Ver estado de conexión del backend"
        >
          <Database className={`w-3.5 h-3.5 ${isCloud ? 'text-emerald-400' : 'text-tunder-orange'}`} />
          <span>{isCloud ? 'Supabase Conectado' : 'Backend Supabase'}</span>
          <span className={`w-2 h-2 rounded-full ${isCloud ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
        </button>
      </div>

      {/* Modal Informativo del Backend */}
      {showBackendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 relative">
            <button
              onClick={() => setShowBackendModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${isCloud ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-tunder-cyan'}`}>
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-tunder-navy">Estado del Backend Supabase</h3>
                <p className="text-xs text-slate-500">Arquitectura de persistencia de TUnder</p>
              </div>
            </div>

            {isCloud ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> ¡Conexión con Supabase Activa!
                </div>
                <p>Las ofertas, perfiles, postulaciones y reseñas se están sincronizando en tiempo real con tu base de datos PostgreSQL en la nube.</p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-sm text-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600" /> Modo Local Autónomo Activo
                </div>
                <p>
                  El código del backend y servicios están 100% integrados. Actualmente el cliente opera con persistencia local y datos iniciales para pruebas.
                </p>
                <p className="font-medium">
                  Para conectar tu propio proyecto en la nube en 2 minutos:
                </p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Crea un proyecto en <a href="https://supabase.com" target="_blank" rel="noreferrer" className="underline font-bold">supabase.com</a>.</li>
                  <li>Ejecuta el archivo <code className="bg-amber-100 px-1 rounded">supabase/schema.sql</code> en el SQL Editor.</li>
                  <li>Agrega tus credenciales en el archivo <code className="bg-amber-100 px-1 rounded">.env</code> (<code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_URL</code> y <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code>).</li>
                </ol>
              </div>
            )}

            <div className="border-t border-slate-100 pt-4 text-xs text-slate-500 space-y-1.5">
              <div className="flex justify-between items-center">
                <span>Tablas soportadas:</span>
                <span className="font-mono font-bold text-slate-700">profiles, internship_offers, applications, reviews</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Seguridad:</span>
                <span className="font-bold text-emerald-600">Row Level Security (RLS) habilitado</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tiempo Real:</span>
                <span className="font-bold text-emerald-600">Supabase Realtime activado</span>
              </div>
            </div>

            <button
              onClick={() => setShowBackendModal(false)}
              className="w-full py-2.5 bg-tunder-navy text-white text-xs font-bold rounded-xl hover:bg-slate-900 transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;