// ============================================================
// COMPONENTE: ValidacionesConsulta
// Aquí van las funciones de validación para no saturar el form
// ============================================================

export const validateConsulta = (formData) => {
  const newErrors = {};

  // Paciente
  if (!formData.paciente_id) {
    newErrors.paciente_id = 'Debe seleccionar un paciente';
  }

  // Motivo
  if (!formData.motivo_consulta.trim()) {
    newErrors.motivo_consulta = 'El motivo de consulta es obligatorio';
  } else if (formData.motivo_consulta.trim().length < 5) {
    newErrors.motivo_consulta = 'Mínimo 5 caracteres';
  }

  // Diagnóstico
  if (!formData.diagnostico_principal.trim()) {
    newErrors.diagnostico_principal = 'El diagnóstico es obligatorio';
  }

  // Signos vitales
  if (formData.temperatura) {
    const temp = parseFloat(formData.temperatura);
    if (temp < 30 || temp > 45) {
      newErrors.temperatura = 'Temperatura fuera de rango (30-45°C)';
    }
  }
  if (formData.presion_sistolica) {
    const ps = parseInt(formData.presion_sistolica);
    if (ps < 50 || ps > 300) {
      newErrors.presion_sistolica = 'Fuera de rango (50-300)';
    }
  }
  if (formData.presion_diastolica) {
    const pd = parseInt(formData.presion_diastolica);
    if (pd < 30 || pd > 200) {
      newErrors.presion_diastolica = 'Fuera de rango (30-200)';
    }
  }
  if (formData.frecuencia_cardiaca) {
    const fc = parseInt(formData.frecuencia_cardiaca);
    if (fc < 30 || fc > 250) {
      newErrors.frecuencia_cardiaca = 'Fuera de rango (30-250)';
    }
  }
  if (formData.saturacion_oxigeno) {
    const sat = parseInt(formData.saturacion_oxigeno);
    if (sat < 50 || sat > 100) {
      newErrors.saturacion_oxigeno = 'Fuera de rango (50-100)';
    }
  }
  if (formData.peso) {
    const peso = parseFloat(formData.peso);
    if (peso < 1 || peso > 500) {
      newErrors.peso = 'Peso fuera de rango';
    }
  }
  if (formData.talla) {
    const talla = parseFloat(formData.talla);
    if (talla < 30 || talla > 250) {
      newErrors.talla = 'Talla fuera de rango';
    }
  }

  return {
    isValid: Object.keys(newErrors).length === 0,
    errors: newErrors,
  };
};

// Helper para calcular IMC
export const calcularIMC = (peso, talla) => {
  if (peso && talla) {
    const tallaM = parseFloat(talla) / 100;
    const pesoKg = parseFloat(peso);
    if (tallaM > 0) return (pesoKg / (tallaM * tallaM)).toFixed(1);
  }
  return null;
};