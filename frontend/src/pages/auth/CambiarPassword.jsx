// ============================================================
// PÁGINA: Cambiar Contraseña
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import authService from '../../services/authService';

function CambiarPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPass: '',
    newPass: '',
    confirmPass: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.currentPass) newErrors.currentPass = 'Requerido';
    if (formData.newPass.length < 8) newErrors.newPass = 'Mínimo 8 caracteres';
    if (formData.newPass !== formData.confirmPass) {
      newErrors.confirmPass = 'Las contraseñas no coinciden';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await authService.changePassword(formData.currentPass, formData.newPass);
      toast.success('Contraseña actualizada correctamente');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Error al cambiar contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto animate-fade-in">
      <Card padding="lg">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🔒</div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Cambiar Contraseña
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Actualiza tu contraseña de acceso
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Contraseña actual"
            type="password"
            name="currentPass"
            value={formData.currentPass}
            onChange={handleChange}
            error={errors.currentPass}
            placeholder="Ingresa tu contraseña actual"
            required
          />
          <Input
            label="Nueva contraseña"
            type="password"
            name="newPass"
            value={formData.newPass}
            onChange={handleChange}
            error={errors.newPass}
            placeholder="Mínimo 8 caracteres"
            helper="Mínimo 8 caracteres, mayúscula, minúscula y número"
            required
          />
          <Input
            label="Confirmar nueva contraseña"
            type="password"
            name="confirmPass"
            value={formData.confirmPass}
            onChange={handleChange}
            error={errors.confirmPass}
            placeholder="Repite la nueva contraseña"
            required
          />
          <Button type="submit" variant="primary" fullWidth loading={loading}>
            Actualizar contraseña
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default CambiarPassword;