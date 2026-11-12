// ============================================================
// COMPONENTE: LoginForm
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateLogin } from '../../utils/validators';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';

// ============================================================
// CREDENCIALES DE DEMO (solo para pruebas locales)
// Se cargan de variables para no escribirlas directamente
// ============================================================
const DEMO_CREDENTIALS = {
  admin: {
    dni: import.meta.env.VITE_DEMO_ADMIN_DNI || '12345678',
    clave: import.meta.env.VITE_DEMO_ADMIN_PASS || 'admin123',
  },
  medico: {
    dni: import.meta.env.VITE_DEMO_MEDICO_DNI || '23456789',
    clave: import.meta.env.VITE_DEMO_MEDICO_PASS || 'medico123',
  },
  enfermera: {
    dni: import.meta.env.VITE_DEMO_ENFERMERA_DNI || '34567890',
    clave: import.meta.env.VITE_DEMO_ENFERMERA_PASS || 'enfermera123',
  },
};

function LoginForm({ onSuccess, onError }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ dni: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const validation = validateLogin(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    const result = await login(formData.dni, formData.password);
    setLoading(false);

    if (result.success) {
      if (onSuccess) onSuccess(result.user);
      navigate('/dashboard');
    } else {
      setServerError(result.error || 'Credenciales inválidas');
      if (onError) onError(result.error);
    }
  };

  const fillDemo = (rol) => {
    const demo = DEMO_CREDENTIALS[rol];
    if (demo) {
      setFormData({ dni: demo.dni, password: demo.clave });
      setErrors({});
      setServerError('');
    }
  };

  return (
    <div>
      {/* Error del servidor */}
      {serverError && (
        <div className="mb-4 animate-shake">
          <Alert variant="error" title="Error de autenticación" onClose={() => setServerError('')}>
            {serverError}
          </Alert>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="DNI"
          name="dni"
          value={formData.dni}
          onChange={handleChange}
          placeholder="Ej: 12345678"
          error={errors.dni}
          required
          maxLength={8}
          icon={(props) => (
            <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        />

        <Input
          label="Contraseña"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Ingresa tu contraseña"
          error={errors.password}
          required
          icon={(props) => (
            <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          )}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300 text-primary-500 focus:ring-primary-200" />
            Recordarme
          </label>
          <a href="#" className="text-sm text-primary-500 hover:text-primary-700 font-semibold">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
          Iniciar Sesión
        </Button>
      </form>

      {/* Credenciales de prueba */}
      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-center text-gray-400 dark:text-gray-500 mb-3 font-semibold">
          🔐 CREDENCIALES DE PRUEBA
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => fillDemo('admin')}
            className="px-3 py-2 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-semibold hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => fillDemo('medico')}
            className="px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          >
            Médico
          </button>
          <button
            type="button"
            onClick={() => fillDemo('enfermera')}
            className="px-3 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
          >
            Enfermera
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;