import React, { useState, useRef } from 'react';
import { Camera, Save, X } from 'lucide-react';
import { useUserStore } from '../../utils/userStore';

interface EditarPerfilProps {
  onClose: () => void;
}

const EditarPerfil: React.FC<EditarPerfilProps> = ({ onClose }) => {
  const { usuario, actualizarPerfil } = useUserStore();
  const [nombre, setNombre] = useState(usuario?.nombre || '');
  const [apellido, setApellido] = useState(usuario?.apellido || '');
  const [fotoPerfil, setFotoPerfil] = useState<string | undefined>(usuario?.fotoPerfil);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPerfil(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    actualizarPerfil({
      nombre,
      apellido,
      fotoPerfil,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">Editar Perfil</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Foto de perfil */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                {fotoPerfil ? (
                  <img
                    src={fotoPerfil}
                    alt="Perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImagenChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Campos de texto */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="input"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="input"
                placeholder="Tu apellido"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn btn-primary flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditarPerfil;