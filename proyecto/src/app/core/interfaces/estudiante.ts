export interface Estudiante {
  id?: number;
  numeroDocumento: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  email: string;
  telefono: number;
  direccion: string;
  fechaInscripcion: string;
  estado?: string;
  idDistrito: number;
  idPrograma: number;
  
}