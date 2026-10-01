export type PageType = 'home' | 'ofertas' | 'resenas' | 'login' | 'register' | 'estudiantes' | 'empresas' | 'universidad';

export type UserRole = 'estudiante' | 'empresa' | 'universidad';

export interface User {
  id?: string;
  email: string;
  nombre: string;
  rol: UserRole;
  entidad: string;
  carrera?: string;
  semestre?: string;
  universidad?: string;
  disponibilidad?: string;
  modalidad?: string;
  habilidades?: string[];
  verificado?: boolean;
  ci?: string;
  nit?: string;
  sector?: string;
}

export type ApplicationStatus = 'Pendiente' | 'Aceptado' | 'Rechazado';

export interface Applicant {
  id: string;
  nombre: string;
  carrera: string;
  semestre: string;
  disponibilidad: string;
  habilidades: string[];
  fechaPostulacion: string;
  estado: ApplicationStatus;
  email?: string;
}

export interface StudentApplication {
  id: string;
  offer_id: number;
  offer_titulo: string;
  offer_empresa: string;
  offer_carrera: string;
  offer_tipo: string;
  offer_ubicacion: string;
  estado: ApplicationStatus;
  fechaPostulacion: string;
}

export interface InternshipOffer {
  id: number;
  empresa_id?: string;
  titulo: string;
  empresa: string;
  carrera: string;
  tipo: 'Medio Tiempo' | 'Tiempo Completo';
  modalidad: string;
  validador: string;
  ubicacion: string;
  skills: string[];
  descripcion: string;
  postulantes?: Applicant[];
  created_at?: string;
}

export interface StudentProfile {
  id?: string;
  nombre: string;
  carrera: string;
  universidad: string;
  semestre: string;
  disponibilidad: string;
  modalidad: string;
  habilidades: string[];
  verificado: boolean;
  ci?: string;
}

export interface Review {
  id: string;
  user_id?: string;
  autor: string;
  rol: UserRole;
  entidad: string;
  calificacion: number;
  comentario: string;
  fecha: string;
}

export interface StudentData {
  id: string;
  nombre: string;
  ci: string;
  carrera: string;
  semestre: string;
  estado: 'Verificado' | 'Pendiente' | 'Suspendido';
  postulaciones: number;
}

export interface CompanyData {
  id: string;
  nombre: string;
  nit: string;
  sector: string;
  convenioEstado: 'Validado' | 'En Revisión' | 'Revocado';
  ofertasActivas: number;
}