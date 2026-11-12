// ============================================================
// VALIDADORES DE FORMULARIOS
// Sistema HIS Postas - Versión 1
// ============================================================

// ============================================================
// EXPRESIONES REGULARES
// ============================================================
export const REGEX = {
  DNI: /^\d{8}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  TELEFONO: /^[0-9+\-\s()]{6,20}$/,
  CELULAR: /^9\d{8}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  CODIGO_HC: /^\d{4}-\d{5}$/,
  CODIGO_CIE10: /^[A-Z]\d{2}(\.\d{1,2})?$/,
  SOLO_LETRAS: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,
  SOLO_NUMEROS: /^\d+$/,
  ALFANUMERICO: /^[a-zA-Z0-9\s]+$/,
};

// ============================================================
// VALIDACIONES BÁSICAS
// ============================================================
export const required = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

export const isEmail = (value) => REGEX.EMAIL.test(value);
export const isDNI = (value) => REGEX.DNI.test(value);
export const isPhone = (value) => REGEX.TELEFONO.test(value);
export const isCelular = (value) => REGEX.CELULAR.test(value);
export const isPassword = (value) => REGEX.PASSWORD.test(value);
export const isNumber = (value) => !isNaN(parseFloat(value)) && isFinite(value);
export const isPositive = (value) => isNumber(value) && Number(value) > 0;
export const minLength = (value, min) => String(value).length >= min;
export const maxLength = (value, max) => String(value).length <= max;
export const inRange = (value, min, max) => {
  const n = Number(value);
  return n >= min && n <= max;
};

// ============================================================
// VALIDACIONES DE PACIENTE
// ============================================================
export const validatePaciente = (data) => {
  const errors = {};

  // Nombres
  if (!required(data.nombres)) {
    errors.nombres = 'El nombre es obligatorio';
  } else if (!REGEX.SOLO_LETRAS.test(data.nombres)) {
    errors.nombres = 'Solo se permiten letras y espacios';
  } else if (data.nombres.trim().length < 2) {
    errors.nombres = 'Mínimo 2 caracteres';
  } else if (data.nombres.trim().length > 100) {
    errors.nombres = 'Máximo 100 caracteres';
  }

  // Apellidos
  if (!required(data.apellidos)) {
    errors.apellidos = 'El apellido es obligatorio';
  } else if (!REGEX.SOLO_LETRAS.test(data.apellidos)) {
    errors.apellidos = 'Solo se permiten letras y espacios';
  } else if (data.apellidos.trim().length < 2) {
    errors.apellidos = 'Mínimo 2 caracteres';
  } else if (data.apellidos.trim().length > 100) {
    errors.apellidos = 'Máximo 100 caracteres';
  }

  // DNI
  if (!required(data.dni)) {
    errors.dni = 'El DNI es obligatorio';
  } else if (!isDNI(data.dni)) {
    errors.dni = 'El DNI debe tener exactamente 8 dígitos';
  }

  // Fecha de nacimiento
  if (!required(data.fecha_nacimiento || data.fechaNacimiento)) {
    errors.fecha_nacimiento = 'La fecha de nacimiento es obligatoria';
  } else {
    const fecha = new Date(data.fecha_nacimiento || data.fechaNacimiento);
    const hoy = new Date();
    const edad = calcularEdadFromDate(fecha);
    if (fecha > hoy) {
      errors.fecha_nacimiento = 'La fecha no puede ser futura';
    } else if (edad > 120) {
      errors.fecha_nacimiento = 'Edad inválida (mayor a 120 años)';
    } else if (edad < 0) {
      errors.fecha_nacimiento = 'Fecha inválida';
    }
  }

  // Sexo
  if (!required(data.sexo)) {
    errors.sexo = 'El sexo es obligatorio';
  } else if (!['M', 'F'].includes(data.sexo)) {
    errors.sexo = 'El sexo debe ser M o F';
  }

  // Email (opcional)
  if (data.email && !isEmail(data.email)) {
    errors.email = 'Correo electrónico inválido';
  }

  // Teléfono (opcional)
  if (data.telefono && !isPhone(data.telefono)) {
    errors.telefono = 'Teléfono inválido';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ============================================================
// VALIDACIONES DE LOGIN
// ============================================================
export const validateLogin = (data) => {
  const errors = {};

  if (!required(data.dni)) {
    errors.dni = 'El DNI es obligatorio';
  } else if (!isDNI(data.dni)) {
    errors.dni = 'El DNI debe tener 8 dígitos';
  }

  if (!required(data.password)) {
    errors.password = 'La contraseña es obligatoria';
  } else if (data.password.length < 6) {
    errors.password = 'Mínimo 6 caracteres';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ============================================================
// VALIDACIONES DE CONSULTA
// ============================================================
export const validateConsulta = (data) => {
  const errors = {};

  if (!required(data.paciente_id || data.pacienteId)) {
    errors.paciente_id = 'Debe seleccionar un paciente';
  }

  if (!required(data.motivo_consulta || data.motivoConsulta)) {
    errors.motivo_consulta = 'El motivo de consulta es obligatorio';
  } else if ((data.motivo_consulta || data.motivoConsulta).length < 5) {
    errors.motivo_consulta = 'Mínimo 5 caracteres';
  }

  if (!required(data.diagnostico_principal || data.diagnosticoPrincipal)) {
    errors.diagnostico_principal = 'El diagnóstico es obligatorio';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ============================================================
// VALIDACIONES DE USUARIO
// ============================================================
export const validateUsuario = (data) => {
  const errors = {};

  if (!required(data.dni)) {
    errors.dni = 'El DNI es obligatorio';
  } else if (!isDNI(data.dni)) {
    errors.dni = 'El DNI debe tener 8 dígitos';
  }

  if (!required(data.nombres)) {
    errors.nombres = 'El nombre es obligatorio';
  }

  if (!required(data.apellidos)) {
    errors.apellidos = 'El apellido es obligatorio';
  }

  if (!required(data.email)) {
    errors.email = 'El email es obligatorio';
  } else if (!isEmail(data.email)) {
    errors.email = 'Correo electrónico inválido';
  }

  if (!required(data.password)) {
    errors.password = 'La contraseña es obligatoria';
  } else if (!isPassword(data.password)) {
    errors.password = 'Mínimo 8 caracteres, mayúscula, minúscula y número';
  }

  if (!required(data.rol_id)) {
    errors.rol_id = 'El rol es obligatorio';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ============================================================
// HELPERS
// ============================================================
const calcularEdadFromDate = (fecha) => {
  const hoy = new Date();
  const nacimiento = new Date(fecha);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
};

// ============================================================
// EXPORT DEFAULT
// ============================================================
export default {
  REGEX,
  required,
  isEmail,
  isDNI,
  isPhone,
  isCelular,
  isPassword,
  isNumber,
  isPositive,
  minLength,
  maxLength,
  inRange,
  validatePaciente,
  validateLogin,
  validateConsulta,
  validateUsuario,
};