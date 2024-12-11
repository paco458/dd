import React, { useState } from 'react';
import { Home, Phone, Shield, Lock, ChevronRight, MessageSquare, Star, Plus } from 'lucide-react';
import Chatbot from './Chatbot';
import FormularioConsejo from './Consejos/FormularioConsejo';
import CompartirBoton from './Compartir/CompartirBoton';
import { useConsejosStore } from '../utils/consejosStore';
import { useUserStore } from '../utils/userStore';

interface Categoria {
  id: string;
  titulo: string;
  descripcion: string;
  icono: React.ElementType;
}

const categorias: Categoria[] = [
  {
    id: 'hogar',
    titulo: 'Protege tu hogar',
    descripcion: 'Consejos básicos para mantener tu casa segura',
    icono: Home
  },
  {
    id: 'estafas',
    titulo: 'Evita estafas telefónicas',
    descripcion: 'Cómo identificar y prevenir fraudes por teléfono',
    icono: Phone
  },
  {
    id: 'personal',
    titulo: 'Seguridad personal',
    descripcion: 'Tips para mantenerte seguro en la calle',
    icono: Shield
  },
  {
    id: 'digital',
    titulo: 'Seguridad digital',
    descripcion: 'Protege tus datos y dispositivos',
    icono: Lock
  }
];

const ConsejosSeguridad = () => {
  const [mostrarChatbot, setMostrarChatbot] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const { consejos, calificarConsejo, obtenerCalificacionPromedio } = useConsejosStore();
  const { usuario } = useUserStore();

  const consejosPorCategoria = categoriaSeleccionada
    ? consejos.filter((consejo) => consejo.categoria === categoriaSeleccionada)
    : [];

  const handleCalificar = (consejoId: string, valor: number) => {
    if (!usuario) return;
    calificarConsejo(consejoId, usuario.id, valor);
  };

  return (
    <div className="p-4 pb-20">
      {!categoriaSeleccionada ? (
        <div className="grid gap-4">
          {categorias.map((categoria) => (
            <div 
              key={categoria.id}
              onClick={() => setCategoriaSeleccionada(categoria.id)}
              className="card cursor-pointer dark:bg-gray-800 dark:text-white"
            >
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 dark:bg-blue-900 rounded-full p-3">
                  <categoria.icono className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{categoria.titulo}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{categoria.descripcion}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCategoriaSeleccionada(null)}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <ChevronRight className="w-5 h-5 transform rotate-180" />
              <span>Volver</span>
            </button>
            <button
              onClick={() => setMostrarFormulario(true)}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Agregar consejo</span>
            </button>
          </div>

          <div className="space-y-4">
            {consejosPorCategoria.map((consejo) => (
              <div key={consejo.id} className="card dark:bg-gray-800">
                {consejo.imagen && (
                  <img
                    src={consejo.imagen}
                    alt={consejo.titulo}
                    className="w-full h-48 object-cover rounded-t-lg -mt-4 -mx-4 mb-4"
                  />
                )}
                <h3 className="text-lg font-semibold mb-2 dark:text-white">
                  {consejo.titulo}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {consejo.descripcion}
                </p>
                <ul className="space-y-2 mb-4">
                  {consejo.consejos.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-1" />
                      <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between mt-4 pt-4 border-t dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((valor) => (
                      <button
                        key={valor}
                        onClick={() => handleCalificar(consejo.id, valor)}
                        className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          obtenerCalificacionPromedio(consejo.id) >= valor
                            ? 'text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      >
                        <Star className="w-5 h-5" />
                      </button>
                    ))}
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      ({consejo.calificaciones.length})
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {(['facebook', 'twitter', 'whatsapp'] as const).map((plataforma) => (
                      <CompartirBoton
                        key={plataforma}
                        url={window.location.href}
                        titulo={consejo.titulo}
                        plataforma={plataforma}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón flotante para mostrar el chatbot */}
      {!mostrarChatbot && (
        <button
          onClick={() => setMostrarChatbot(true)}
          className="fixed bottom-20 right-4 btn btn-primary shadow-lg flex items-center gap-2 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Asistente</span>
        </button>
      )}

      {mostrarChatbot && <Chatbot onClose={() => setMostrarChatbot(false)} />}

      {/* Modal de formulario de consejo */}
      {mostrarFormulario && categoriaSeleccionada && (
        <FormularioConsejo
          categoria={categoriaSeleccionada}
          onClose={() => setMostrarFormulario(false)}
        />
      )}
    </div>
  );
};

export default ConsejosSeguridad;