import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onSwitchToRegister: () => void;
  onLogin: (email: string, password: string) => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToRegister, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { email: '', password: '' };

    if (!validateEmail(email)) {
      newErrors.email = 'Correo electrónico inválido';
    }
    if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      onLogin(email, password);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Iniciar Sesión
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Correo electrónico"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-10 pr-12 py-3 rounded-lg border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Contraseña"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Iniciar sesión
        </button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        ¿No tienes cuenta?{' '}
        <button
          onClick={onSwitchToRegister}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Regístrate
        </button>
      </p>
    </div>
  );
};

export default Login;