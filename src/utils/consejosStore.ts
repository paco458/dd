import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { ConsejoUsuario } from '../types';

interface ConsejosState {
  consejos: ConsejoUsuario[];
  agregarConsejo: (consejo: Omit<ConsejoUsuario, 'id' | 'calificaciones' | 'fecha'>) => void;
  calificarConsejo: (consejoId: string, usuarioId: string, valor: number) => void;
  obtenerCalificacionPromedio: (consejoId: string) => number;
}

export const useConsejosStore = create<ConsejosState>()(
  persist(
    (set, get) => ({
      consejos: [],
      agregarConsejo: (nuevoConsejo) => {
        const consejo: ConsejoUsuario = {
          ...nuevoConsejo,
          id: nanoid(),
          calificaciones: [],
          fecha: new Date(),
        };
        set((state) => ({
          consejos: [consejo, ...state.consejos],
        }));
      },
      calificarConsejo: (consejoId, usuarioId, valor) => {
        set((state) => ({
          consejos: state.consejos.map((consejo) => {
            if (consejo.id === consejoId) {
              const calificaciones = consejo.calificaciones.filter(
                (c) => c.usuarioId !== usuarioId
              );
              return {
                ...consejo,
                calificaciones: [...calificaciones, { usuarioId, valor }],
              };
            }
            return consejo;
          }),
        }));
      },
      obtenerCalificacionPromedio: (consejoId) => {
        const consejo = get().consejos.find((c) => c.id === consejoId);
        if (!consejo || consejo.calificaciones.length === 0) return 0;
        
        const suma = consejo.calificaciones.reduce((acc, curr) => acc + curr.valor, 0);
        return suma / consejo.calificaciones.length;
      },
    }),
    {
      name: 'consejos-storage',
    }
  )
);