// ============================================================
// RUTAS DE LA APLICACIÓN
// ============================================================

import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

// Auth
import Login from '../pages/auth/Login';
import RecuperarPassword from '../pages/auth/RecuperarPassword';
import CambiarPassword from '../pages/auth/CambiarPassword';

// Dashboard
import Dashboard from '../pages/dashboard/Dashboard';

// Pacientes
import ListaPacientes from '../pages/pacientes/ListaPacientes';
import NuevoPaciente from '../pages/pacientes/NuevoPaciente';
import EditarPaciente from '../pages/pacientes/EditarPaciente';
import DetallePaciente from '../pages/pacientes/DetallePaciente';

// Consultas
import ListaConsultas from '../pages/consultas/ListaConsultas';
import NuevaConsulta from '../pages/consultas/NuevaConsulta';
import DetalleConsulta from '../pages/consultas/DetalleConsulta';

// Citas
import ListaCitas from '../pages/citas/ListaCitas';
import NuevaCita from '../pages/citas/NuevaCita';

// Vacunas
import ListaVacunas from '../pages/vacunas/ListaVacunas';
import NuevaVacuna from '../pages/vacunas/NuevaVacuna';

// Historia
import HistoriaClinica from '../pages/historia/HistoriaClinica';

// Farmacia
import Inventario from '../pages/farmacia/Inventario';

// Reportes
import Reportes from '../pages/reportes/Reportes';

// Admin
import Usuarios from '../pages/admin/Usuarios';
import Auditoria from '../pages/admin/Auditoria';
import Configuracion from '../pages/admin/Configuracion';

// Errores
import NotFound from '../pages/errors/NotFound';
import Unauthorized from '../pages/errors/Unauthorized';
import ServerError from '../pages/errors/ServerError';

function AppRoutes() {
  return (
    <Routes>
      {/* ===== RUTAS DE AUTENTICACIÓN ===== */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar-password" element={<RecuperarPassword />} />
      </Route>

      {/* ===== RUTAS PROTEGIDAS ===== */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* ===== PACIENTES ===== */}
          <Route path="/pacientes" element={<ListaPacientes />} />
          <Route path="/pacientes/nuevo" element={<NuevoPaciente />} />
          <Route path="/pacientes/:id" element={<DetallePaciente />} />
          <Route path="/pacientes/:id/editar" element={<EditarPaciente />} />

          {/* ===== CONSULTAS ===== */}
          <Route path="/consultas" element={<ListaConsultas />} />
          <Route path="/consultas/nueva" element={<NuevaConsulta />} />
          <Route path="/consultas/:id" element={<DetalleConsulta />} />

          {/* ===== CITAS ===== */}
          <Route path="/citas" element={<ListaCitas />} />
          <Route path="/citas/nueva" element={<NuevaCita />} />

          {/* ===== VACUNAS ===== */}
          <Route path="/vacunas" element={<ListaVacunas />} />
          <Route path="/vacunas/nueva" element={<NuevaVacuna />} />

          {/* ===== HISTORIA CLÍNICA ===== */}
          <Route path="/historia" element={<HistoriaClinica />} />
          <Route path="/historia/:id" element={<HistoriaClinica />} />

          {/* ===== FARMACIA ===== */}
          <Route path="/farmacia" element={<Inventario />} />

          {/* ===== REPORTES ===== */}
          <Route path="/reportes" element={<Reportes />} />

          {/* ===== CAMBIAR CONTRASEÑA ===== */}
          <Route path="/cambiar-password" element={<CambiarPassword />} />

          {/* ===== ADMIN (solo rol admin) ===== */}
          <Route element={<RoleRoute allowedRoles={['admin']} />}>
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/auditoria" element={<Auditoria />} />
            <Route path="/configuracion" element={<Configuracion />} />
          </Route>
        </Route>
      </Route>

      {/* ===== ERRORES ===== */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/server-error" element={<ServerError />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;