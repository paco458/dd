import { useState } from 'react'; // Asegúrate de importar useState
import { User, Edit2, Bell, Moon } from 'lucide-react';
import { useUserStore } from '../utils/userStore';
import EditarPerfil from './Perfil/EditarPerfil';
import HistorialAlertas from './Perfil/HistorialAlertas';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Perfil = () => {
  const { usuario, preferencias, setPreferencias } = useUserStore();
  const [mostrarEditarPerfil, setMostrarEditarPerfil] = useState(false);
  const [mostrarAlertas, setMostrarAlertas] = useState(false); // Nuevo estado para mostrar/ocultar alertas

  // Función para alternar el tema oscuro
  const toggleTemaOscuro = () => {
    setPreferencias({ ...preferencias, temaOscuro: !preferencias.temaOscuro });
  };

  // Función para alternar las notificaciones
  const toggleNotificaciones = () => {
    setPreferencias({ ...preferencias, notificaciones: !preferencias.notificaciones });
    if (!preferencias.notificaciones) {
      setMostrarAlertas(true); // Mostrar alertas cuando las notificaciones se activan
    } else {
      setMostrarAlertas(false); // Ocultar alertas cuando se desactivan las notificaciones
    }
  };

  return (
    <div className={`min-h-screen ${preferencias.temaOscuro ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-3xl mx-auto p-4">
        {/* Información del perfil */}
        <div className={`${preferencias.temaOscuro ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-6`}>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                {usuario?.fotoPerfil ? (
                  <img
                    src={usuario.fotoPerfil}
                    alt="Perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <button
                onClick={() => setMostrarEditarPerfil(true)}
                className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700"
                aria-label="Editar perfil"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className={`text-xl font-semibold ${preferencias.temaOscuro ? 'text-white' : 'text-gray-900'}`}>
                {usuario?.nombre ? `${usuario.nombre} ${usuario.apellido}` : 'Usuario'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{usuario?.email}</p>
              <p className="text-gray-600 dark:text-gray-400">
                {usuario?.telefono && `+51 ${usuario.telefono}`}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {usuario?.fechaNacimiento &&
                  `Fecha de nacimiento: ${format(new Date(usuario.fechaNacimiento), 'd MMMM yyyy', { locale: es })}`}
              </p>
            </div>
          </div>
        </div>

        {/* Preferencias */}
        <div className={`${preferencias.temaOscuro ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-6`}>
          <h3 className={`text-lg font-semibold mb-4 ${preferencias.temaOscuro ? 'text-white' : 'text-gray-900'}`}>Preferencias</h3>
          <div className="space-y-4">
            {/* Modo oscuro */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className={preferencias.temaOscuro ? 'text-white' : 'text-gray-900'}>Modo oscuro</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={preferencias.temaOscuro}
                  onChange={toggleTemaOscuro}
                  aria-label="Activar o desactivar modo oscuro"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Notificaciones */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className={preferencias.temaOscuro ? 'text-white' : 'text-gray-900'}>Notificaciones</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={preferencias.notificaciones}
                  onChange={toggleNotificaciones}
                  aria-label="Activar o desactivar notificaciones"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Historial de Alertas */}
        {mostrarAlertas && (
          <div className={`${preferencias.temaOscuro ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
            <h3 className={`text-lg font-semibold mb-4 ${preferencias.temaOscuro ? 'text-white' : 'text-gray-900'}`}>Historial de Alertas</h3>
            <HistorialAlertas />
          </div>
        )}
      </div>

      {/* Modal de editar perfil */}
      {mostrarEditarPerfil && (
        <EditarPerfil onClose={() => setMostrarEditarPerfil(false)} />
      )}
    </div>
  );
};

export default Perfil;
