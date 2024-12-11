import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AlertTriangle, MapPin } from 'lucide-react';
import { useIncidentes } from '../../utils/incidentesStore';
import { useUserStore } from '../../utils/userStore';

const HistorialAlertas = () => {
  const { incidentes } = useIncidentes();
  const { usuario } = useUserStore();
  
  // Filtrar incidentes del usuario actual
  const misIncidentes = incidentes.filter(
    (incidente) => incidente.usuarioId === usuario?.id
  );

  if (misIncidentes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p>No has reportado ningún incidente aún</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {misIncidentes.map((incidente) => (
        <div key={incidente.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-start gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium capitalize">
                {incidente.tipo}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {incidente.descripcion}
              </p>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>
                  {`${incidente.ubicacion.lat.toFixed(4)}, ${incidente.ubicacion.lng.toFixed(4)}`}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {format(new Date(incidente.fecha), "d 'de' MMMM 'a las' HH:mm", {
                  locale: es,
                })}
              </div>
            </div>
          </div>
          {incidente.imagen && (
            <div className="mt-3">
              <img
                src={incidente.imagen}
                alt="Evidencia"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default HistorialAlertas;