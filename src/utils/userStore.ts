import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Usuario, Preferencias } from '../types';

interface UserState {
  usuario: Usuario | null;
  preferencias: Preferencias;
  setUsuario: (usuario: Usuario) => void;
  actualizarPerfil: (datos: Partial<Usuario>) => void;
  toggleTemaOscuro: () => void;
  toggleNotificaciones: () => void;
}

const usuarioInicial: Usuario = {
  id: '1',
  nombre: '',
  apellido: '',
  email: '',
  notificaciones: true,
  preferenciasAlertas: ['robo', 'sospechoso'],
  temaOscuro: false,
};

const preferenciasIniciales: Preferencias = {
  temaOscuro: false,
  notificaciones: true,
  tiposAlerta: ['robo', 'sospechoso'],
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      usuario: usuarioInicial,
      preferencias: preferenciasIniciales,
      setUsuario: (usuario) => set({ usuario }),
      actualizarPerfil: (datos) =>
        set((state) => ({
          usuario: state.usuario ? { ...state.usuario, ...datos } : null,
        })),
      toggleTemaOscuro: () =>
        set((state) => ({
          preferencias: {
            ...state.preferencias,
            temaOscuro: !state.preferencias.temaOscuro,
          },
        })),
      toggleNotificaciones: () =>
        set((state) => ({
          preferencias: {
            ...state.preferencias,
            notificaciones: !state.preferencias.notificaciones,
          },
        })),
    }),
    {
      name: 'user-storage',
    }
  )
);