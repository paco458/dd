import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Bell, Shield, Clock, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Incidente } from '../types';
import CompartirAlerta from './CompartirAlerta';
import Recomendaciones from './Alertas/Recomendaciones';
import { useIncidentes } from '../utils/incidentesStore';
import { useRecomendacionesStore } from '../utils/recomendacionesStore';

const Alertas = () => {
  const { incidentes } = useIncidentes();
  const { recomendaciones } = useRecomendacionesStore();
  const [alertaSeleccionada, setAlertaSeleccionada] = useState<Incidente | null>(null);
  const [mostrarRecomendaciones, setMostrarRecomendaciones] = useState<Incidente | null>(null);
  const [notificacionesEnviadas, setNotificacionesEnviadas] = useState<Set<string>>(new Set()); // Estado para controlar las notificaciones enviadas

  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Usar useCallback para evitar la recreación de la función en cada renderizado
  const enviarNotificacion = useCallback((alerta: Incidente) => {
    // Verificamos si ya se ha enviado la notificación para este incidente
    if (Notification.permission === 'granted' && !notificacionesEnviadas.has(alerta.id)) {
      new Notification('Nueva Alerta', {
        body: `${alerta.tipo}: ${alerta.descripcion}`,
        icon: alerta.imagen || '/default-icon.png',
      });

      // Actualizamos el estado para marcar que la notificación ha sido enviada
      setNotificacionesEnviadas(prev => new Set(prev).add(alerta.id));
    }
  }, [notificacionesEnviadas]); // Dependencia de notificacionesEnviadas

  useEffect(() => {
    let prevIncidentes: Incidente[] = [];

    const interval = setInterval(() => {
      if (prevIncidentes.length < incidentes.length) {
        const nuevos = incidentes.slice(prevIncidentes.length);
        nuevos.forEach((alerta) => enviarNotificacion(alerta));
      }
      prevIncidentes = [...incidentes];
    }, 1000);

    return () => clearInterval(interval);
  }, [incidentes, enviarNotificacion]); // Agregar enviarNotificacion a las dependencias

  const contarRecomendaciones = (tipo: string): number =>
    recomendaciones.filter((rec) => rec.tipoIncidente === tipo).length;

  return (
    <div className="p-4 pb-20">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
        <div className="flex items-center">
          <Bell className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-red-800 font-medium">Alerta Importante</h3>
            <p className="text-red-700 text-sm">Se han reportado varios incidentes en la zona.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {incidentes.map((alerta) => {
          const numRecomendaciones = contarRecomendaciones(alerta.tipo);

          return (
            <div key={alerta.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {alerta.imagen && (
                <div className="relative h-48">
                  <img
                    src={alerta.imagen}
                    alt={alerta.tipo}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">
                      {alerta.tipo.charAt(0).toUpperCase() + alerta.tipo.slice(1)}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{alerta.descripcion}</p>
                    <div className="flex items-center justify-between text-gray-500 text-xs">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>
                          {format(alerta.fecha, "d 'de' MMMM 'a las' HH:mm", { locale: es })}
                        </span>
                      </div>
                      <button
                        onClick={() => setAlertaSeleccionada(alerta)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Compartir</span>
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  className="w-full mt-3 text-blue-600 text-sm font-medium flex items-center justify-center gap-2 hover:text-blue-700 relative"
                  onClick={() => setMostrarRecomendaciones(alerta)}
                >
                  <Shield className="w-4 h-4" />
                  <span>Ver recomendaciones</span>
                  {numRecomendaciones > 0 && (
                    <span className="absolute -right-1 -top-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {numRecomendaciones}
                    </span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {alertaSeleccionada && (
        <CompartirAlerta
          alerta={alertaSeleccionada}
          onClose={() => setAlertaSeleccionada(null)}
        />
      )}
      {mostrarRecomendaciones && (
        <Recomendaciones
          incidente={mostrarRecomendaciones}
          onClose={() => setMostrarRecomendaciones(null)}
        />
      )}
    </div>
  );
};

export default Alertas;
