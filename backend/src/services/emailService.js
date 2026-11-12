// ============================================================
// SERVICIO: Envío de Emails (simulado con consola)
// ============================================================

import logger from '../config/logger.js';
import config from '../config/env.js';

// ============================================================
// ENVIAR EMAIL (SIMULADO)
// ============================================================
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    // En producción usar Nodemailer/SendGrid
    logger.info('📧 [EMAIL SIMULADO]');
    logger.info(`   Para: ${to}`);
    logger.info(`   Asunto: ${subject}`);
    logger.info(`   Texto: ${text || '(solo HTML)'}`);

    // TODO: Implementar con nodemailer
    return { success: true, messageId: `sim-${Date.now()}` };
  } catch (error) {
    logger.error('Error al enviar email:', error);
    throw error;
  }
};

// ============================================================
// PLANTILLAS DE EMAIL
// ============================================================

export const sendWelcomeEmail = async (usuario, passwordTemporal) => {
  const html = `
    <h2>Bienvenido al Sistema HIS Postas</h2>
    <p>Hola ${usuario.nombres},</p>
    <p>Tu cuenta ha sido creada:</p>
    <ul>
      <li><strong>DNI:</strong> ${usuario.dni}</li>
      <li><strong>Email:</strong> ${usuario.email}</li>
      <li><strong>Contraseña temporal:</strong> ${passwordTemporal}</li>
    </ul>
    <p>Por favor, cambia tu contraseña al iniciar sesión.</p>
  `;

  return sendEmail({
    to: usuario.email,
    subject: 'Bienvenido al Sistema HIS Postas',
    html,
    text: `Bienvenido. Tu DNI es ${usuario.dni} y tu contraseña temporal es ${passwordTemporal}`,
  });
};

export const sendPasswordResetEmail = async (usuario, resetToken) => {
  const resetUrl = `${config.server.corsOrigin[0]}/reset-password?token=${resetToken}`;

  const html = `
    <h2>Recuperación de contraseña</h2>
    <p>Hola ${usuario.nombres},</p>
    <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
    <a href="${resetUrl}">Restablecer contraseña</a>
    <p>Este enlace expira en 1 hora.</p>
    <p>Si no solicitaste esto, ignora este email.</p>
  `;

  return sendEmail({
    to: usuario.email,
    subject: 'Recuperación de contraseña - HIS Postas',
    html,
    text: `Restablece tu contraseña: ${resetUrl}`,
  });
};

export const sendCitaRecordatorioEmail = async (paciente, cita) => {
  const html = `
    <h2>Recordatorio de cita</h2>
    <p>Hola ${paciente.nombres},</p>
    <p>Te recordamos tu cita programada:</p>
    <ul>
      <li><strong>Fecha:</strong> ${new Date(cita.fecha_hora).toLocaleString('es-PE')}</li>
      <li><strong>Motivo:</strong> ${cita.motivo}</li>
    </ul>
    <p>Por favor, llega 15 minutos antes.</p>
  `;

  return sendEmail({
    to: paciente.email,
    subject: 'Recordatorio de cita - HIS Postas',
    html,
  });
};

export default {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendCitaRecordatorioEmail,
};