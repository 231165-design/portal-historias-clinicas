// ============================================================
// HOOK: useForm
// Manejo de formularios con validación
// ============================================================

import { useState, useCallback } from 'react';

/**
 * Hook para manejar formularios
 *
 * @param {Object} initialValues - Valores iniciales
 * @param {Function} validateFn - Función de validación (opcional)
 * @param {Function} onSubmit - Función a ejecutar al enviar
 * @returns {Object} - { values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm, setFieldValue, setValues }
 *
 * @example
 * const form = useForm(
 *   { nombres: '', apellidos: '' },
 *   (values) => {
 *     const errors = {};
 *     if (!values.nombres) errors.nombres = 'Requerido';
 *     return errors;
 *   },
 *   (values) => console.log(values)
 * );
 */
export const useForm = (initialValues = {}, validateFn = null, onSubmit = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manejar cambio de input
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Limpiar error al cambiar
    setErrors((prev) => {
      if (prev[name]) {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      }
      return prev;
    });
  }, []);

  // Manejar blur
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  // Establecer un campo específico
  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Resetear formulario
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Enviar formulario
  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      // Validar
      if (validateFn) {
        const validationErrors = validateFn(values);
        setErrors(validationErrors);

        // Marcar todos como touched
        const allTouched = Object.keys(values).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {});
        setTouched(allTouched);

        if (Object.keys(validationErrors).length > 0) {
          return;
        }
      }

      // Enviar
      if (onSubmit) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [values, validateFn, onSubmit]
  );

  // Verificar si hay errores
  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setValues,
    setErrors,
  };
};

export default useForm;