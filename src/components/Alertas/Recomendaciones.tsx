import React, { useState, useRef } from 'react';
import { Camera, Plus, X } from 'lucide-react';
import { useRecomendacionesStore } from '../../utils/recomendacionesStore';
import { TipoIncidente } from '../../types';

interface FormularioRecomendacionProps {
  tipoIncidente: TipoIncidente;
  onClose: () => void;
}

const FormularioRecomendacion: React.FC<FormularioRecomendacionProps> = ({
  tipoIncidente,
  onClose
}) => {
  const { agregarRecomendacion } = useRecomendacionesStore();
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [pasos, setPasos] = useState<string[]>(['']);
  const [imagen, setImagen] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleAgregarPaso = () => {
    setPasos([...pasos, '']);
  };

  const handlePasoChange = (index: number, valor: string) => {
    const nuevosPasos = [...pasos];
    nuevosPasos[index] = valor;
    setPasos(nuevosPasos);
  };

  const handleEliminarPaso = (index: number) => {
    setPasos(pasos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    agregarRecomendacion({
      tipoIncidente,
      titulo,
      descripcion,
      pasos: pasos.filter(paso => paso.trim() !== ''),
      imagen,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-semibold dark:text-white">Agregar Recomendación</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Título
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="input dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Título de la recomendación"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="input dark:bg-gray-700 dark:text-white dark:border-gray-600"
              rows={3}
              placeholder="Describe el contexto de la recomendación"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Imagen
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer border-2 border-dashed rounded-lg p-4 text-center hover:border-blue-500 transition-colors dark:border-gray-600 dark:hover:border-blue-500"
            >
              {imagen ? (
                <img
                  src={imagen}
                  alt="Vista previa"
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <Camera className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500 mt-2">
                    Click para agregar imagen
                  </span>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImagenChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Pasos o recomendaciones específicas
            </label>
            <div className="space-y-3">
              {pasos.map((paso, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={paso}
                    onChange={(e) => handlePasoChange(index, e.target.value)}
                    className="input flex-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    placeholder="Escribe una recomendación específica"
                  />
                  {pasos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleEliminarPaso(index)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAgregarPaso}
                className="text-blue-600 text-sm hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                + Agregar otra recomendación
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn btn-primary flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Publicar recomendación
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormularioRecomendacion;