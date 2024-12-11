import React, { useState, useRef } from 'react';
import { AlertTriangle, Camera, MapPin, Send, X, Image as ImageIcon } from 'lucide-react';
import { TipoIncidente } from '../types';
import { agregarIncidente } from '../utils/incidentesStore';

interface FormularioReporteProps {
  onClose: () => void;
}

const FormularioReporte: React.FC<FormularioReporteProps> = ({ onClose }) => {
  const [tipo, setTipo] = useState<TipoIncidente | ''>('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tiposIncidente = [
    { id: 'robo', nombre: 'Robo', icono: AlertTriangle },
    { id: 'vandalismo', nombre: 'Vandalismo', icono: AlertTriangle },
    { id: 'sospechoso', nombre: 'Actividad Sospechosa', icono: AlertTriangle },
    { id: 'accidente', nombre: 'Accidente', icono: AlertTriangle }
  ];

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagen(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!tipo || !descripcion) return;

    setEnviando(true);
    try {
      // Simular ubicación del usuario
      const ubicacion = { lat: Math.random() * 90, lng: Math.random() * 180 };
      
      await agregarIncidente({
        id: Date.now().toString(),
        tipo: tipo as TipoIncidente,
        descripcion,
        ubicacion,
        fecha: new Date(),
        imagen
      });

      setMensajeExito(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error al enviar reporte:', error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {mensajeExito ? (
        <div className="text-center py-8 animate-fade-in">
          <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
            <p className="font-medium">¡Gracias por tu reporte!</p>
            <p className="text-sm">Tu información ayuda a mantener segura la comunidad.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {tiposIncidente.map(({ id, nombre, icono: Icon }) => (
              <button
                key={id}
                onClick={() => setTipo(id as TipoIncidente)}
                className={`p-4 rounded-lg border transition-all ${
                  tipo === id 
                    ? 'border-blue-500 bg-blue-50 scale-105' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${
                  tipo === id ? 'text-blue-600' : 'text-gray-500'
                }`} />
                <span className="text-sm font-medium">{nombre}</span>
              </button>
            ))}
          </div>

          <textarea
            placeholder="Describe el incidente..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 min-h-[120px]"
          />

          <div className="mb-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImagenChange}
              accept="image/*"
              className="hidden"
            />
            
            {imagen ? (
              <div className="relative">
                <img
                  src={imagen}
                  alt="Vista previa"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={() => setImagen(null)}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-4 border-2 border-dashed rounded-lg flex flex-col items-center gap-2 text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
              >
                <ImageIcon className="w-8 h-8" />
                <span>Agregar imagen</span>
              </button>
            )}
          </div>

          <div className="flex gap-4 mb-4">
            <button className="flex-1 btn btn-secondary flex items-center justify-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>Ubicación actual</span>
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!tipo || !descripcion || enviando}
            className="w-full btn btn-primary flex items-center justify-center gap-2"
          >
            {enviando ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Enviar Reporte</span>
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
};

export default FormularioReporte;