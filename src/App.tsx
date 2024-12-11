import { useState, useEffect } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa'; // Importa los iconos de luna y sol
import Navegacion from './components/Navegacion';
import MapaIncidentes from './components/MapaIncidentes';
import FormularioReporte from './components/FormularioReporte';
import Alertas from './components/Alertas';
import ConsejosSeguridad from './components/ConsejosSeguridad';
import Perfil from './components/Perfil';
import AuthContainer from './components/Auth/AuthContainer';
import { useThemeStore } from './utils/themeStore';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState<'mapa' | 'alertas' | 'consejos' | 'perfil'>('mapa');
  const [mostrarReporte, setMostrarReporte] = useState(false);
  const { isDark, toggleTheme } = useThemeStore(); // Obtener el estado del tema (oscuro/claro) y una función para cambiarlo

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  if (!isAuthenticated) {
    return <AuthContainer onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  const secciones: Record<typeof seccionActiva, JSX.Element> = {
    mapa: <MapaIncidentes onReportar={() => setMostrarReporte(true)} />,
    alertas: <Alertas />,
    consejos: <ConsejosSeguridad />,
    perfil: <Perfil />,
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white transition-colors duration-200">
        {/* Barra de navegación con icono de tema (fija en la parte superior) */}
        <nav className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center bg-gray-800 text-white z-50">
          <h1 className="text-xl font-semibold">Aplicación</h1>
          <button onClick={toggleTheme} className="text-2xl">
            {isDark ? <FaMoon /> : <FaSun />} {/* Muestra la luna o el sol dependiendo del tema */}
          </button>
        </nav>

        {/* Modal de reporte */}
        {mostrarReporte && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-t-xl absolute bottom-0 w-full max-h-[90vh] overflow-y-auto transform transition-transform duration-300 translate-y-0">
              <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-semibold dark:text-white">Reportar Incidente</h2>
                <button
                  onClick={() => setMostrarReporte(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  &times;
                </button>
              </div>
              <FormularioReporte onClose={() => setMostrarReporte(false)} />
            </div>
          </div>
        )}

        {/* Contenido principal */}
        <main className="pt-16">{secciones[seccionActiva]}</main> {/* Ajusta el padding-top aquí para que no quede tapado por el nav */}

        {/* Navegación */}
        <Navegacion seccionActiva={seccionActiva} cambiarSeccion={setSeccionActiva} />
      </div>
    </div>
  );
}

export default App;
