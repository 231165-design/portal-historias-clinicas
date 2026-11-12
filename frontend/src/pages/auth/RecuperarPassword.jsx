// ============================================================
// PÁGINA: Recuperar Contraseña
// ============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';
import authService from '../../services/authService';

function RecuperarPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Ingrese su email');
      return;
    }
    setLoading(true);
    try {
      await authService.recoverPassword(email);
      setEnviado(true);
      toast.success('Instrucciones enviadas');
    } catch (error) {
      toast.error(error.message || 'Error al enviar');
    } finally {
      setLoading(false);
    }
  };

  if (enviado) {
    return (
      <div className="w-full text-center animate-fade-in">
        <div className="text-6xl mb-4">📧</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Email enviado</h2>
        <p className="text-sm text-gray-500 mb-6">
          Si el email <strong>{email}</strong> está registrado, recibirás instrucciones.
        </p>
        <Link to="/login" className="text-primary-600 hover:underline font-semibold">
          ← Volver al login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-in">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🔑</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Recuperar contraseña</h2>
        <p className="text-sm text-gray-500">
          Ingresa tu email y te enviaremos un enlace
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
        />
        <Button type="submit" variant="primary" fullWidth loading={loading}>
          Enviar instrucciones
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link to="/login" className="text-sm text-primary-600 hover:underline">
          ← Volver al login
        </Link>
      </div>
    </div>
  );
}

export default RecuperarPassword;