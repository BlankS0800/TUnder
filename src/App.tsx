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

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<PageType>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
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
    </div>
  );
};
export default App;