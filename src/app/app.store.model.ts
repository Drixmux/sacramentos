export interface User {
  id: number;
  ci: string;
  nombres: string;
  apellidoMaterno: string;
  apellidoPaterno: string;
  celular: string;
  facebook: string;
  fechaNacimiento: string;
  genero: string;
  procedencia: string;
  fechaCreacion: string;
}
export interface Account {
  sub: string;
  email: string;
  exp: string;
  iat: string;
  role: string;
  permissions: string[];
  fechaCreacion: string;
  user: User;
}
export interface EmailPassword {
  email: string;
  password: string;
}
export interface Sacrament {
  id: number;
  sacramento: string;
  fechaCreacion: string;
}
export interface Certificate {
  id: number;
  parroquiaId: number;
  sacerdoteCertificadorId: number;
  sacerdoteCelebranteId: number;
  jurisdiccionId: number;
  fecha: string;
  observaciones: string;
  fechaCreacion: string;
  user: User;
  sacrament: Sacrament;
}
