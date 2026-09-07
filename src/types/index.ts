export type PageType = 'home' | 'ofertas' | 'resenas' | 'login' | 'register' | 'estudiantes' | 'empresas' | 'universidad';

export type UserRole = 'estudiante' | 'empresa' | 'universidad';

export interface User {
  email: string;
  nombre: string;
  rol: UserRole;
  entidad: string;
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
}

export interface InternshipOffer {
  id: number;
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
}

export interface StudentProfile {
  nombre: string;
  carrera: string;
  universidad: string;
  semestre: string;
  disponibilidad: string;
  modalidad: string;
  habilidades: string[];
  verificado: boolean;
}

export interface Review {
  id: string;
  autor: string;
  rol: UserRole;
  entidad: string;
  calificacion: number;
  comentario: string;
  fecha: string;
}