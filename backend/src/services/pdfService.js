// ============================================================
// SERVICIO: Generación de PDFs
// ============================================================

import PDFDocument from 'pdfkit';
import logger from '../config/logger.js';

// ============================================================
// GENERAR PDF DE RECETA
// ============================================================
export const generateRecetaPDF = (data, res) => {
  try {
    const doc = new PDFDocument({ margin: 50 });

    // Headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="receta-${data.id}.pdf"`);

    doc.pipe(res);

    // Encabezado
    doc.fontSize(20).text('SISTEMA HIS POSTAS', { align: 'center' });
    doc.fontSize(12).text('Receta Médica', { align: 'center' });
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Datos del paciente
    doc.fontSize(10);
    doc.text(`Paciente: ${data.paciente.nombres} ${data.paciente.apellidos}`);
    doc.text(`DNI: ${data.paciente.dni}`);
    doc.text(`Historia Clínica: ${data.paciente.historia_clinica}`);
    doc.text(`Fecha: ${new Date(data.fecha_emision).toLocaleString('es-PE')}`);
    doc.moveDown();

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Medicamentos
    doc.fontSize(12).text('Medicamentos:', { underline: true });
    doc.moveDown(0.5);

    data.detalles.forEach((detalle, index) => {
      doc.fontSize(10);
      doc.text(`${index + 1}. ${detalle.medicamento.nombre_generico} - ${detalle.medicamento.presentacion}`);
      doc.text(`   Dosis: ${detalle.dosis || 'N/A'}`);
      doc.text(`   Frecuencia: ${detalle.frecuencia || 'N/A'}`);
      doc.text(`   Duración: ${detalle.duracion || 'N/A'}`);
      doc.text(`   Cantidad: ${detalle.cantidad}`);
      doc.moveDown(0.5);
    });

    // Indicaciones
    if (data.observaciones) {
      doc.moveDown();
      doc.fontSize(12).text('Indicaciones:', { underline: true });
      doc.fontSize(10).text(data.observaciones);
    }

    // Firma
    doc.moveDown(3);
    doc.text('______________________________', { align: 'right' });
    doc.text(`Dr(a). ${data.medico.nombres} ${data.medico.apellidos}`, { align: 'right' });
    doc.text(`Colegiatura: ${data.medico.colegiatura || 'N/A'}`, { align: 'right' });

    doc.end();
  } catch (error) {
    logger.error('Error al generar PDF de receta:', error);
    throw error;
  }
};

// ============================================================
// GENERAR PDF DE HISTORIA CLÍNICA
// ============================================================
export const generateHistoriaClinicaPDF = (data, res) => {
  try {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="HC-${data.historia_clinica}.pdf"`);

    doc.pipe(res);

    // Header
    doc.fontSize(20).text('SISTEMA HIS POSTAS', { align: 'center' });
    doc.fontSize(14).text('Historia Clínica', { align: 'center' });
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Datos del paciente
    doc.fontSize(12).text('DATOS DEL PACIENTE', { underline: true });
    doc.fontSize(10);
    doc.text(`Nombre: ${data.nombres} ${data.apellidos}`);
    doc.text(`DNI: ${data.dni || 'N/A'}`);
    doc.text(`Historia Clínica: ${data.historia_clinica}`);
    doc.text(`Fecha Nacimiento: ${data.fecha_nacimiento}`);
    doc.text(`Sexo: ${data.sexo === 'M' ? 'Masculino' : 'Femenino'}`);
    doc.text(`Teléfono: ${data.telefono || 'N/A'}`);
    doc.text(`Dirección: ${data.direccion || 'N/A'}`);
    doc.moveDown();

    // Alergias
    if (data.alergias) {
      doc.fontSize(12).text('ALERGIAS', { underline: true });
      doc.fontSize(10).text(data.alergias);
      doc.moveDown();
    }

    // Consultas
    if (data.consultas && data.consultas.length > 0) {
      doc.addPage();
      doc.fontSize(12).text('CONSULTAS MÉDICAS', { underline: true });
      doc.moveDown();

      data.consultas.forEach((consulta) => {
        doc.fontSize(10);
        doc.text(`Fecha: ${new Date(consulta.fecha_hora).toLocaleString('es-PE')}`);
        doc.text(`Médico: ${consulta.medico?.nombres} ${consulta.medico?.apellidos}`);
        doc.text(`Motivo: ${consulta.motivo_consulta}`);
        doc.text(`Diagnóstico: ${consulta.diagnostico_principal}`);
        doc.text(`Tratamiento: ${consulta.tratamiento || 'N/A'}`);
        doc.moveDown(0.5);
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);
      });
    }

    doc.end();
  } catch (error) {
    logger.error('Error al generar PDF de HC:', error);
    throw error;
  }
};

// ============================================================
// GENERAR PDF GENÉRICO DE REPORTE
// ============================================================
export const generateReportePDF = (titulo, data, res) => {
  try {
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="reporte-${Date.now()}.pdf"`);

    doc.pipe(res);

    doc.fontSize(18).text('SISTEMA HIS POSTAS', { align: 'center' });
    doc.fontSize(14).text(titulo, { align: 'center' });
    doc.fontSize(10).text(`Generado: ${new Date().toLocaleString('es-PE')}`, { align: 'center' });
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Tabla simple
    if (Array.isArray(data) && data.length > 0) {
      data.forEach((item, index) => {
        doc.fontSize(10);
        doc.text(`${index + 1}. ${JSON.stringify(item)}`);
        doc.moveDown(0.3);
      });
    }

    doc.end();
  } catch (error) {
    logger.error('Error al generar PDF:', error);
    throw error;
  }
};

export default {
  generateRecetaPDF,
  generateHistoriaClinicaPDF,
  generateReportePDF,
};