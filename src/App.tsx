import React, { useState } from 'react';
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

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<PageType>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActivePage('home');
  };

  const renderPage = (): React.ReactElement => {
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
        return currentUser ? <EstudiantesPage /> : <LoginPage onLoginSuccess={handleLoginSuccess} setActivePage={setActivePage} />;
      case 'empresas':
        return currentUser ? <EmpresasPage currentUser={currentUser} /> : <LoginPage onLoginSuccess={handleLoginSuccess} setActivePage={setActivePage} />;
      case 'universidad':
        return currentUser ? <UniversidadPage /> : <LoginPage onLoginSuccess={handleLoginSuccess} setActivePage={setActivePage} />;
      default:
        return <HomePage setPage={setActivePage} currentUser={currentUser} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
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