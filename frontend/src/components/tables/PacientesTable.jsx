// ============================================================
// COMPONENTE: PacientesTable
// Tabla de pacientes con acciones
// ============================================================

import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import Tooltip from '../ui/Tooltip';
import { formatDate, calcularEdad, formatDNI } from '../../utils/formatters';

// ============================================================
// TABLA DE PACIENTES
// ============================================================
function PacientesTable({
  pacientes = [],
  loading = false,
  onDelete,
  onEdit,
  onView,
  showActions = true,
}) {
  // --- LOADING ---
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-16">
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary-200 dark:border-primary-800 border-t-primary-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Cargando pacientes...
          </p>
        </div>
      </div>
    );
  }

  // --- EMPTY ---
  if (!pacientes || pacientes.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-16">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-5xl mb-4">
            👥
          </div>
          <h3 className="text-lg font-bold text-gray-700 dark:text-white mb-2">
            No hay pacientes registrados
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md">
            Comienza registrando tu primer paciente para gestionar sus historias clínicas.
          </p>
          <Link
            to="/pacientes/nuevo"
            className="px-5 py-2.5 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Registrar primer paciente
          </Link>
        </div>
      </div>
    );
  }

  // --- TABLA ---
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wider">
                Paciente
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wider">
                DNI / HC
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wider">
                Edad
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wider">
                Seguro
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wider">
                Registro
              </th>
              {showActions && (
                <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {pacientes.map((paciente) => {
              const edad = calcularEdad(paciente.fecha_nacimiento);
              const nombreCompleto = `${paciente.nombres} ${paciente.apellidos}`;

              return (
                <tr
                  key={paciente.id}
                  className="hover:bg-primary-50/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  {/* PACIENTE */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={nombreCompleto} size="md" />
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {nombreCompleto}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {paciente.sexo === 'M' ? 'Masculino' : 'Femenino'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* DNI / HC */}
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      <p className="font-mono text-xs text-gray-700 dark:text-gray-300">
                        {paciente.dni ? formatDNI(paciente.dni) : '—'}
                      </p>
                      <p className="font-mono text-[11px] text-primary-600 dark:text-primary-400 font-semibold">
                        HC: {paciente.historia_clinica || '—'}
                      </p>
                    </div>
                  </td>

                  {/* EDAD */}
                  <td className="px-4 py-3">
                    <span className="text-gray-700 dark:text-gray-300">{edad} años</span>
                  </td>

                  {/* CONTACTO */}
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        {paciente.telefono || '—'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                        {paciente.email || '—'}
                      </p>
                    </div>
                  </td>

                  {/* SEGURO */}
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        paciente.tipo_seguro === 'SIS'
                          ? 'success'
                          : paciente.tipo_seguro === 'ESSALUD'
                          ? 'info'
                          : paciente.tipo_seguro === 'Privado'
                          ? 'purple'
                          : 'gray'
                      }
                      size="sm"
                    >
                      {paciente.tipo_seguro || 'Ninguno'}
                    </Badge>
                  </td>

                  {/* REGISTRO */}
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {formatDate(paciente.created_at || paciente.fechaRegistro)}
                    </span>
                  </td>

                  {/* ACCIONES */}
                  {showActions && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Tooltip content="Ver detalle">
                          <button
                            onClick={() => onView && onView(paciente)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                            title="Ver"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </Tooltip>

                        <Tooltip content="Editar">
                          <button
                            onClick={() => onEdit && onEdit(paciente)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
                            title="Editar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </Tooltip>

                        <Tooltip content="Eliminar">
                          <button
                            onClick={() => onDelete && onDelete(paciente)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                            title="Eliminar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PacientesTable;