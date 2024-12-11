import React from 'react';
import { MapPin, Bell, Shield, User } from 'lucide-react';

// Componente de navegación principal
const Navegacion = ({ seccionActiva, cambiarSeccion }: { 
  seccionActiva: string;
  cambiarSeccion: (seccion: string) => void;
}) => {
  const botones = [
    { id: 'mapa', icono: MapPin, texto: 'Mapa' },
    { id: 'alertas', icono: Bell, texto: 'Alertas' },
    { id: 'consejos', icono: Shield, texto: 'Consejos' },
    { id: 'perfil', icono: User, texto: 'Perfil' }
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16">
        {botones.map(({ id, icono: Icono, texto }) => (
          <button
            key={id}
            onClick={() => cambiarSeccion(id)}
            className={`flex flex-col items-center p-2 ${
              seccionActiva === id ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Icono className="w-6 h-6" />
            <span className="text-xs mt-1">{texto}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navegacion;