import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  FileSpreadsheet, 
  Search, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  AlertTriangle
} from 'lucide-react';

interface StudentData {
  id: string;
  nombre: string;
  ci: string;
  carrera: string;
  semestre: string;
  estado: 'Verificado' | 'Pendiente' | 'Suspendido';
  postulaciones: number;
}

interface CompanyData {
  id: string;
  nombre: string;
  nit: string;
  sector: string;
  convenioEstado: 'Validado' | 'En Revisión' | 'Revocado';
  ofertasActivas: number;
}

export const UniversidadPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'estudiantes' | 'empresas' | 'estadisticas'>('estudiantes');
  const [search, setSearch] = useState('');

  // Estado mutable de Estudiantes
  const [estudiantes, setEstudiantes] = useState<StudentData[]>([
    { id: '1', nombre: 'Mikaela Mendoza', ci: '9845124 LP', carrera: 'Informática', semestre: '8vo', estado: 'Verificado', postulaciones: 3 },
    { id: '2', nombre: 'Rodrigo Flores', ci: '8741203 LP', carrera: 'Economía', semestre: '7mo', estado: 'Pendiente', postulaciones: 1 },
    { id: '3', nombre: 'Camila Quispe', ci: '1029384 LP', carrera: 'Ingeniería Industrial', semestre: '9no', estado: 'Verificado', postulaciones: 4 },
    { id: '4', nombre: 'Andrés Morales', ci: '7451290 LP', carrera: 'Informática', semestre: '6to', estado: 'Suspendido', postulaciones: 0 },
  ]);

  // Estado mutable de Empresas Colaboradoras
  const [empresas, setEmpresas] = useState<CompanyData[]>([
    { id: '1', nombre: 'TechAndes S.R.L.', nit: '492819024', sector: 'Tecnología', convenioEstado: 'Validado', ofertasActivas: 2 },
    { id: '2', nombre: 'Banco de Inversión Andino', nit: '102938472', sector: 'Finanzas', convenioEstado: 'Validado', ofertasActivas: 3 },
    { id: '3', nombre: 'Logística Boliviana S.A.', nit: '883920194', sector: 'Operaciones', convenioEstado: 'En Revisión', ofertasActivas: 1 },
    { id: '4', nombre: 'Consultores Alfa', nit: '556102938', sector: 'Auditoría', convenioEstado: 'Revocado', ofertasActivas: 0 },
  ]);

  // Acciones de Superusuario para Estudiantes
  const toggleStudentStatus = (id: string) => {
    setEstudiantes(prev => prev.map(est => {
      if (est.id === id) {
        const nuevoEstado = est.estado === 'Verificado' ? 'Suspendido' : 'Verificado';
        return { ...est, estado: nuevoEstado };
      }
      return est;
    }));
  };

  const deleteStudent = (id: string) => {
    if (confirm('¿Seguro que deseas eliminar este registro universitario?')) {
      setEstudiantes(prev => prev.filter(e => e.id !== id));
    }
  };

  // Acciones de Superusuario para Empresas
  const toggleCompanyConvenio = (id: string) => {
    setEmpresas(prev => prev.map(emp => {
      if (emp.id === id) {
        const nuevoEstado = emp.convenioEstado === 'Validado' ? 'Revocado' : 'Validado';
        return { ...emp, convenioEstado: nuevoEstado };
      }
      return emp;
    }));
  };

  const deleteCompany = (id: string) => {
    if (confirm('¿Seguro que deseas dar de baja este convenio empresarial?')) {
      setEmpresas(prev => prev.filter(c => c.id !== id));
    }
  };

  const filteredStudents = estudiantes.filter(e => 
    e.nombre.toLowerCase().includes(search.toLowerCase()) ||
    e.carrera.toLowerCase().includes(search.toLowerCase()) ||
    e.ci.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCompanies = empresas.filter(c => 
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    c.sector.toLowerCase().includes(search.toLowerCase()) ||
    c.nit.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Institucional / Superuser */}
      <div className="bg-tunder-navy text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-tunder-orange text-xs font-bold uppercase tracking-wider border border-orange-500/30">
            <ShieldCheck className="w-4 h-4" /> Consola de Administración Central (Superuser)
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Panel de Control Universitario</h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Gestión integral de convenios institucionales, perfiles de estudiantes y fiscalización de convocatorias de pasantías.
          </p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => alert('Generando informe institucional en PDF...')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition border border-white/20"
          >
            <FileSpreadsheet className="w-4 h-4 text-tunder-cyan" /> Reporte Acreditación
          </button>
        </div>
      </div>

      {/* Navegación de Pestañas y Búsqueda */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setActiveTab('estudiantes'); setSearch(''); }}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'estudiantes'
                ? 'bg-tunder-navy text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4 text-tunder-cyan" />
            Estudiantes ({estudiantes.length})
          </button>

          <button
            onClick={() => { setActiveTab('empresas'); setSearch(''); }}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'empresas'
                ? 'bg-tunder-navy text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-4 h-4 text-tunder-orange" />
            Empresas & Convenios ({empresas.length})
          </button>
        </div>

        {/* Buscador Rápido */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder={`Filtrar ${activeTab}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-tunder-cyan shadow-sm"
          />
        </div>
      </div>

      {/* TAB: ESTUDIANTES */}
      {activeTab === 'estudiantes' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-sm font-bold text-tunder-navy">Padrón de Estudiantes Registrados</h3>
            <span className="text-xs text-slate-500">Total: {filteredStudents.length} registros</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Estudiante / CI</th>
                  <th className="py-3 px-4">Carrera / Semestre</th>
                  <th className="py-3 px-4">Postulaciones</th>
                  <th className="py-3 px-4">Estado Académico</th>
                  <th className="py-3 px-4 text-right">Acciones de Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredStudents.map((est) => (
                  <tr key={est.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{est.nombre}</div>
                      <div className="text-slate-400 text-[11px] font-mono">{est.ci}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{est.carrera}</div>
                      <div className="text-slate-400 text-[11px]">{est.semestre}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-semibold font-mono">
                        {est.postulaciones} activas
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        est.estado === 'Verificado'
                          ? 'bg-green-100 text-green-800'
                          : est.estado === 'Pendiente'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {est.estado === 'Verificado' && <CheckCircle className="w-3 h-3" />}
                        {est.estado === 'Suspendido' && <XCircle className="w-3 h-3" />}
                        {est.estado === 'Pendiente' && <AlertTriangle className="w-3 h-3" />}
                        {est.estado}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => toggleStudentStatus(est.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
                          est.estado === 'Verificado'
                            ? 'bg-red-50 text-red-700 hover:bg-red-100'
                            : 'bg-green-50 text-green-700 hover:bg-green-100'
                        }`}
                      >
                        {est.estado === 'Verificado' ? 'Suspender' : 'Aprobar'}
                      </button>
                      <button
                        onClick={() => deleteStudent(est.id)}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded transition inline-flex"
                        title="Eliminar registro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: EMPRESAS Y CONVENIOS */}
      {activeTab === 'empresas' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-sm font-bold text-tunder-navy">Empresas Acreditadas y Convenios</h3>
            <span className="text-xs text-slate-500">Total: {filteredCompanies.length} empresas</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Razón Social / NIT</th>
                  <th className="py-3 px-4">Sector Productivo</th>
                  <th className="py-3 px-4">Ofertas Publicadas</th>
                  <th className="py-3 px-4">Estado del Convenio</th>
                  <th className="py-3 px-4 text-right">Acciones Institucionales</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredCompanies.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{emp.nombre}</div>
                      <div className="text-slate-400 text-[11px] font-mono">NIT: {emp.nit}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-sky-50 text-tunder-cyan font-medium rounded">
                        {emp.sector}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-700">{emp.ofertasActivas} pasantías</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        emp.convenioEstado === 'Validado'
                          ? 'bg-green-100 text-green-800'
                          : emp.convenioEstado === 'En Revisión'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {emp.convenioEstado === 'Validado' && <CheckCircle className="w-3 h-3" />}
                        {emp.convenioEstado === 'Revocado' && <XCircle className="w-3 h-3" />}
                        {emp.convenioEstado === 'En Revisión' && <AlertTriangle className="w-3 h-3" />}
                        {emp.convenioEstado}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => toggleCompanyConvenio(emp.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
                          emp.convenioEstado === 'Validado'
                            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                            : 'bg-green-50 text-green-700 hover:bg-green-100'
                        }`}
                      >
                        {emp.convenioEstado === 'Validado' ? 'Revocar Convenio' : 'Validar Convenio'}
                      </button>
                      <button
                        onClick={() => deleteCompany(emp.id)}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded transition inline-flex"
                        title="Eliminar de la plataforma"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};