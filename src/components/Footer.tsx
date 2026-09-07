import React from 'react';
import { MapPin, Mail } from 'lucide-react';
import logoLetras from '../assets/logo_letras.jpeg';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-tunder-navy text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
        {/* Marca con logo_letras */}
        <div className="space-y-4">
          <div className="bg-white p-2.5 rounded-2xl inline-block shadow-md">
            <img 
              src={logoLetras} 
              alt="TUnder Letras y Lema" 
              className="h-17 w-auto object-contain"
            />
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Plataforma universitaria especializada en la intermediación y acreditación formal de pasantías en La Paz, Bolivia.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-white mb-3 text-sm">Ecosistema</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="hover:text-white transition cursor-pointer">Portal Estudiantes</li>
            <li className="hover:text-white transition cursor-pointer">Empresas Acreditadas</li>
            <li className="hover:text-white transition cursor-pointer">Convenios Institucionales</li>
            <li className="hover:text-white transition cursor-pointer">Supervisión Académica</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-3 text-sm">Marco y Cobertura</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-tunder-orange shrink-0" /> La Paz, Bolivia
            </li>
            <li>Modelo B2B2C Institucional</li>
            <li>Transición Formativa-Laboral</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-3 text-sm">Contacto Institucional</h4>
          <p className="text-slate-400 text-xs flex items-center gap-2">
            <Mail className="w-4 h-4 text-tunder-cyan shrink-0" /> contacto@tunder.bo
          </p>
          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500">
            © {new Date().getFullYear()} TUnder. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
};