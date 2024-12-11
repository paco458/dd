import  { useState, useEffect } from 'react';
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api'; // Cambié Marker por MarkerF
import { Incidente } from '../types';

// Datos de incidentes de ejemplo

const MapaIncidentes = ({ onReportar }: { onReportar: () => void }) => {
  const [ubicacionActual, setUbicacionActual] = useState<{ lat: number; lng: number } | null>(null);
  const [incidenteSeleccionado, setIncidenteSeleccionado] = useState<Incidente | null>(null);

  // Carga de la API de Google Maps con soporte para AdvancedMarkerElement
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY, // Usar variable de entorno
    libraries: ["marker"], // Cargar librería de AdvancedMarkerElement
  });

  // Obtener ubicación actual del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUbicacionActual({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error al obtener la ubicación actual:', error);
        }
      );
    }
  }, []);

  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <div className="relative h-screen">
      {/* Google Map */}
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={ubicacionActual || { lat: -12.0464, lng: -77.0428 }} // Centrar en ubicación actual o Lima, Perú
        zoom={ubicacionActual ? 15 : 14}
      >
        {/* Marcadores de incidentes */}
      

        {/* Marcador de ubicación actual */}
        {ubicacionActual && (
          <MarkerF
            position={ubicacionActual}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new window.google.maps.Size(32, 32),
            }}
          />
        )}
      </GoogleMap>

      {/* Modal de detalles del incidente */}
      {incidenteSeleccionado && (
        <div className="absolute bottom-24 left-4 right-4 bg-white p-4 rounded-lg shadow-lg animate-slide-up">
          <h3 className="text-lg font-semibold mb-2">
            {incidenteSeleccionado.tipo.charAt(0).toUpperCase() + incidenteSeleccionado.tipo.slice(1)}
          </h3>
          <p className="text-gray-600 mb-2">{incidenteSeleccionado.descripcion}</p>
          <p className="text-sm text-gray-500">
            {incidenteSeleccionado.fecha.toLocaleString()}
          </p>
          <button
            onClick={() => setIncidenteSeleccionado(null)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Botón flotante para reportar */}
      <button
        onClick={onReportar}
        className="fixed bottom-20 right-4 btn btn-primary shadow-lg flex items-center gap-2"
      >

        <span className="text-sm font-medium">Reportar Incidente</span>
      </button>
    </div>
  );
};

export default MapaIncidentes;
