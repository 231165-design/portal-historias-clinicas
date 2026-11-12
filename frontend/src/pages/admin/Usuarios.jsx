// ============================================================
// PÁGINA: Usuarios (Solo Admin)
// ============================================================

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Modal from '../../components/ui/Modal';
import ConfirmModal from '../../components/modals/ConfirmModal';
import Spinner from '../../components/ui/Spinner';
import Select from '../../components/ui/Select';
import useDebounce from '../../hooks/useDebounce';
import usuarioService from '../../services/usuarioService';
import { ROLES_LABELS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

const ROLES_OPTIONS = [
  { value: 1, label: 'Admin' },
  { value: 2, label: 'Médico' },
  { value: 3, label: 'Enfermera' },
  { value: 4, label: 'Obstetra' },
  { value: 5, label: 'Admisión' },
  { value: 6, label: 'Farmacia' },
];

// Mock de usuarios
const MOCK_USUARIOS = [
  { id: 1, dni: '12345678', nombres: 'Carlos', apellidos: 'Mendoza', email: 'admin@posta.gob.pe', rol: { id: 1, nombre: 'admin' }, activo: true, created_at: '2026-01-15' },
  { id: 2, dni: '23456789', nombres: 'Ana', apellidos: 'Torres', email: 'medico@posta.gob.pe', rol: { id: 2, nombre: 'medico' }, activo: true, created_at: '2026-02-20' },
  { id: 3, dni: '34567890', nombres: 'Luis', apellidos: 'Ramírez', email: 'enfermera@posta.gob.pe', rol: { id: 3, nombre: 'enfermera' }, activo: true, created_at: '2026-03-10' },
];

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setUsuarios(MOCK_USUARIOS);
      setLoading(false);
    }, 500);
  }, []);

  const usuariosFiltrados = usuarios.filter((u) =>
    `${u.nombres} ${u.apellidos} ${u.dni} ${u.email}`.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleNuevo = () => {
    setUsuarioEditar(null);
    setFormData({ dni: '', nombres: '', apellidos: '', email: '', password: '', rol_id: 2 });
    setModalOpen(true);
  };

  const handleEditar = (u) => {
    setUsuarioEditar(u);
    setFormData({ ...u, rol_id: u.rol.id });
    setModalOpen(true);
  };

  const handleEliminar = (u) => {
    setUsuarioAEliminar(u);
    setModalDelete(true);
  };

  const confirmarEliminar = async () => {
    try {
      await usuarioService.eliminar(usuarioAEliminar.id);
      setUsuarios(usuarios.filter((u) => u.id !== usuarioAEliminar.id));
      toast.success('Usuario desactivado');
      setModalDelete(false);
    } catch (error) {
      toast.error(error.message || 'Error al eliminar');
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Simulación
      await new Promise((r) => setTimeout(r, 800));
      toast.success(usuarioEditar ? 'Usuario actualizado' : 'Usuario creado');
      setModalOpen(false);
    } catch (error) {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">⚙️ Gestión de Usuarios</h1>
          <p className="text-sm text-gray-500 mt-1">Administra el personal del sistema</p>
        </div>
        <Button variant="primary" onClick={handleNuevo}>➕ Nuevo Usuario</Button>
      </div>

      <Card padding="md">
        <Input placeholder="🔍 Buscar por nombre, DNI o email..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </Card>

      {loading ? (
        <Card padding="lg"><div className="text-center py-10"><Spinner size="lg" text="Cargando usuarios..." /></div></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {usuariosFiltrados.map((u) => (
            <Card key={u.id} padding="md" hover>
              <div className="flex items-start gap-3">
                <Avatar name={`${u.nombres} ${u.apellidos}`} size="lg" status={u.activo ? 'online' : 'offline'} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 truncate">{u.nombres} {u.apellidos}</h3>
                  <p className="text-xs text-gray-500">{u.email}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Badge variant="primary" size="sm">{ROLES_LABELS[u.rol.nombre]}</Badge>
                    <Badge variant={u.activo ? 'success' : 'gray'} size="sm">{u.activo ? 'Activo' : 'Inactivo'}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">DNI: {u.dni}</span>
                <div className="flex gap-1">
                  <button onClick={() => handleEditar(u)} className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100">✏️</button>
                  <button onClick={() => handleEliminar(u)} className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100">🗑️</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* MODAL CREAR/EDITAR */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={usuarioEditar ? 'Editar Usuario' : 'Nuevo Usuario'}>
        <form onSubmit={handleGuardar} className="space-y-4">
          <Input label="DNI" value={formData.dni || ''} onChange={(e) => setFormData({ ...formData, dni: e.target.value })} required maxLength={8} />
          <Input label="Nombres" value={formData.nombres || ''} onChange={(e) => setFormData({ ...formData, nombres: e.target.value })} required />
          <Input label="Apellidos" value={formData.apellidos || ''} onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })} required />
          <Input label="Email" type="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          {!usuarioEditar && <Input label="Contraseña" type="password" value={formData.password || ''} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />}
          <Select label="Rol" value={formData.rol_id || 2} onChange={(e) => setFormData({ ...formData, rol_id: e.target.value })} options={ROLES_OPTIONS} />
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="primary" loading={saving}>Guardar</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal isOpen={modalDelete} onClose={() => setModalDelete(false)} onConfirm={confirmarEliminar} title="¿Desactivar usuario?" message={`Se desactivará a ${usuarioAEliminar?.nombres} ${usuarioAEliminar?.apellidos}`} variant="danger" confirmText="Sí, desactivar" />
    </div>
  );
}

export default Usuarios;