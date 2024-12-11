// Tipos de datos principales para la aplicación
export type TipoIncidente = 'robo' | 'vandalismo' | 'sospechoso' | 'accidente';

export interface Ubicacion {
  lat: number;
  lng: number;
}

export interface Incidente {
  id: string;
  tipo: TipoIncidente;
  descripcion: string;
  ubicacion: Ubicacion;
  fecha: Date;
  imagen?: string | null;
  usuarioId: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento: Date; // Cambiado de yearNacimiento a fechaNacimiento
  fotoPerfil?: string;
  notificaciones: boolean;
  preferenciasAlertas: TipoIncidente[];
  temaOscuro: boolean;
}

export interface Preferencias {
  temaOscuro: boolean;
  notificaciones: boolean;
  tiposAlerta: TipoIncidente[];
}

export interface ConsejoUsuario {
  id: string;
  usuarioId: string;
  categoria: string;
  titulo: string;
  descripcion: string;
  imagen?: string;
  consejos: string[];
  calificaciones: {
    usuarioId: string;
    valor: number;
  }[];
  fecha: Date;
}