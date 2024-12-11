import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Phone, Calendar } from 'lucide-react';
import { useUserStore } from '../../utils/userStore';
import { format, differenceInYears } from 'date-fns';

interface RegisterProps {
  onSwitchToLogin: () => void;
  onRegister: (email: string, password: string) => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin, onRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellido: '',
    telefono: '',
    fechaNacimiento: '',
    codigoVerificacion: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [paso, setPaso] = useState(1); // 1: datos iniciales, 2: verificación
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellido: '',
    telefono: '',
    fechaNacimiento: '',
    terms: '',
    codigo: ''
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const age = differenceInYears(new Date(), birth);
    return age >= 18;
  };

  const handleEnviarCodigo = () => {
    if (!validatePhone(formData.telefono)) {
      setErrors(prev => ({
        ...prev,
        telefono: 'Ingresa un número de teléfono válido (9 dígitos)'
      }));
      return;
    }
    
    // Simular envío de código
    setCodigoEnviado(true);
    setPaso(2);
  };

  const verificarCodigo = () => {
    // Simular verificación - en una implementación real, validaríamos contra el backend
    if (formData.codigoVerificacion === '123456') {
      onRegister(formData.email, formData.password);
      // Guardar datos del usuario
      useUserStore.getState().setUsuario({
        id: Date.now().toString(),
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono,
        fechaNacimiento: new Date(formData.fechaNacimiento),
        notificaciones: true,
        preferenciasAlertas: ['robo', 'sospechoso'],
        temaOscuro: false
      });
    } else {
      setErrors(prev => ({
        ...prev,
        codigo: 'Código incorrecto'
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      email: '',
      password: '',
      confirmPassword: '',
      nombre: '',
      apellido: '',
      telefono: '',
      fechaNacimiento: '',
      terms: '',
      codigo: ''
    };

    // Validaciones
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    }
    if (!validatePhone(formData.telefono)) {
      newErrors.telefono = 'Teléfono inválido (9 dígitos)';
    }
    if (!formData.fechaNacimiento) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento es requerida';
    } else if (!validateAge(formData.fechaNacimiento)) {
      newErrors.fechaNacimiento = 'Debes ser mayor de edad para registrarte';
    }
    if (!acceptTerms) {
      newErrors.terms = 'Debes aceptar los términos y condiciones';
    }

    setErrors(newErrors);

    if (!Object.values(newErrors).some(error => error)) {
      handleEnviarCodigo();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        {paso === 1 ? 'Crear cuenta' : 'Verificar teléfono'}
      </h2>
      
      {paso === 1 ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  errors.nombre ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Nombre"
              />
            </div>
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={formData.apellido}
                onChange={(e) => setFormData(prev => ({ ...prev, apellido: e.target.value }))}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  errors.apellido ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Apellido"
              />
            </div>
            {errors.apellido && (
              <p className="mt-1 text-sm text-red-500">{errors.apellido}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  errors.telefono ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Teléfono (9 dígitos)"
                maxLength={9}
              />
            </div>
            {errors.telefono && (
              <p className="mt-1 text-sm text-red-500">{errors.telefono}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="date"
                value={formData.fechaNacimiento}
                onChange={(e) => setFormData(prev => ({ ...prev, fechaNacimiento: e.target.value }))}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  errors.fechaNacimiento ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                max={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>
            {errors.fechaNacimiento && (
              <p className="mt-1 text-sm text-red-500">{errors.fechaNacimiento}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
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

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Confirmar contraseña"
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300"
              />
              <span className="text-gray-700 text-sm">
                Acepto los términos y condiciones
              </span>
            </label>
            {errors.terms && (
              <p className="mt-1 text-sm text-red-500">{errors.terms}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Continuar
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          <p className="text-center text-gray-600">
            Hemos enviado un código de verificación al número
            <br />
            <span className="font-medium">+51 {formData.telefono}</span>
          </p>

          <div>
            <input
              type="text"
              value={formData.codigoVerificacion}
              onChange={(e) => setFormData(prev => ({ ...prev, codigoVerificacion: e.target.value }))}
              className="w-full text-center text-2xl tracking-widest py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="000000"
              maxLength={6}
            />
            {errors.codigo && (
              <p className="mt-1 text-sm text-red-500 text-center">{errors.codigo}</p>
            )}
          </div>

          <button
            onClick={verificarCodigo}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Verificar código
          </button>

          <p className="text-center text-sm text-gray-600">
            ¿No recibiste el código?{' '}
            <button
              onClick={handleEnviarCodigo}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Reenviar
            </button>
          </p>
        </div>
      )}

      <p className="mt-6 text-center text-gray-600">
        ¿Ya tienes cuenta?{' '}
        <button
          onClick={onSwitchToLogin}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Inicia sesión
        </button>
      </p>
    </div>
  );
};

export default Register;