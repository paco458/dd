import { useState, useEffect } from 'react';
import { Incidente } from '../types';

// Simular almacenamiento local
const STORAGE_KEY = 'incidentes';

const getStoredIncidentes = (): Incidente[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const setStoredIncidentes = (incidentes: Incidente[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(incidentes));
};

export const agregarIncidente = async (incidente: Incidente) => {
  const incidentes = getStoredIncidentes();
  const nuevosIncidentes = [incidente, ...incidentes];
  setStoredIncidentes(nuevosIncidentes);
  return incidente;
};

export const useIncidentes = () => {
  const [incidentes, setIncidentes] = useState<Incidente[]>([]);

  useEffect(() => {
    setIncidentes(getStoredIncidentes());
  }, []);

  return { incidentes };
};