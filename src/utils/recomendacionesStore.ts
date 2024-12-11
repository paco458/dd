import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { TipoIncidente } from '../types';

// Interfaces para el store de recomendaciones
interface Recomendacion {
  id: string;
  tipoIncidente: TipoIncidente;
  titulo: string;
  descripcion: string;
  pasos: string[];
  imagen?: string;
  calificaciones: {
    usuarioId: string;
    valor: number;
  }[];
  comentarios?: {
    id: string;
    usuarioId: string;
    texto: string;
    fecha: Date;
  }[];
  fecha: Date;
}

interface RecomendacionesState {
  recomendaciones: Recomendacion[];
  agregarRecomendacion: (recomendacion: Omit<Recomendacion, 'id' | 'calificaciones' | 'comentarios' | 'fecha'>) => void;
  calificarRecomendacion: (recomendacionId: string, valor: number) => void;
  agregarComentario: (recomendacionId: string, texto: string) => void;
  obtenerCalificacionPromedio: (recomendacionId: string) => number;
}

// Store de recomendaciones con persistencia
export const useRecomendacionesStore = create<RecomendacionesState>()(
  persist(
    (set, get) => ({
      recomendaciones: [],
      
      // Agregar una nueva recomendación
      agregarRecomendacion: (nuevaRecomendacion) => {
        const recomendacion: Recomendacion = {
          ...nuevaRecomendacion,
          id: nanoid(),
          calificaciones: [],
          comentarios: [],
          fecha: new Date(),
        };
        set((state) => ({
          recomendaciones: [recomendacion, ...state.recomendaciones],
        }));
      },
      
      // Calificar una recomendación
      calificarRecomendacion: (recomendacionId, valor) => {
        const usuarioId = 'usuario-actual'; // En una implementación real, obtener del contexto de autenticación
        set((state) => ({
          recomendaciones: state.recomendaciones.map((recomendacion) => {
            if (recomendacion.id === recomendacionId) {
              const calificaciones = recomendacion.calificaciones.filter(
                (c) => c.usuarioId !== usuarioId
              );
              return {
                ...recomendacion,
                calificaciones: [...calificaciones, { usuarioId, valor }],
              };
            }
            return recomendacion;
          }),
        }));
      },
      
      // Agregar un comentario a una recomendación
      agregarComentario: (recomendacionId, texto) => {
        const usuarioId = 'usuario-actual'; // En una implementación real, obtener del contexto de autenticación
        set((state) => ({
          recomendaciones: state.recomendaciones.map((recomendacion) => {
            if (recomendacion.id === recomendacionId) {
              return {
                ...recomendacion,
                comentarios: [
                  ...(recomendacion.comentarios || []),
                  {
                    id: nanoid(),
                    usuarioId,
                    texto,
                    fecha: new Date(),
                  },
                ],
              };
            }
            return recomendacion;
          }),
        }));
      },
      
      // Calcular el promedio de calificaciones
      obtenerCalificacionPromedio: (recomendacionId) => {
        const recomendacion = get().recomendaciones.find((r) => r.id === recomendacionId);
        if (!recomendacion || recomendacion.calificaciones.length === 0) return 0;
        
        const suma = recomendacion.calificaciones.reduce((acc, curr) => acc + curr.valor, 0);
        return suma / recomendacion.calificaciones.length;
      },
    }),
    {
      name: 'recomendaciones-storage',
    }
  )
);