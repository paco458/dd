import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

interface AuthContainerProps {
  onAuthSuccess: () => void;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = (email: string, password: string) => {
    // Aquí implementarías la lógica real de autenticación
    console.log('Login:', { email, password });
    onAuthSuccess();
  };

  const handleRegister = (email: string, password: string) => {
    // Aquí implementarías la lógica real de registro
    console.log('Register:', { email, password });
    onAuthSuccess();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isLogin ? (
          <Login
            onSwitchToRegister={() => setIsLogin(false)}
            onLogin={handleLogin}
          />
        ) : (
          <Register
            onSwitchToLogin={() => setIsLogin(true)}
            onRegister={handleRegister}
          />
        )}
      </div>
    </div>
  );
};

export default AuthContainer;