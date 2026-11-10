# 🏥 HIS Postas - Sistema de Historias Clínicas

Sistema web completo para la gestión de historias clínicas, consultas médicas, citas y vacunas en postas de salud del Perú. Desarrollado con una arquitectura cliente-servidor moderna, garantizando seguridad, escalabilidad y una experiencia de usuario óptima.

## 📋 Características Principales

- **Gestión de Pacientes:** CRUD completo con búsqueda avanzada, paginación y registro de antecedentes.
- **Consultas Médicas:** Registro detallado utilizando el formato SOAP (Subjetivo, Objetivo, Análisis, Plan) y signos vitales.
- **Gestión de Citas:** Programación, confirmación y cancelación de citas médicas.
- **Registro de Vacunas:** Control y seguimiento del esquema de vacunación por paciente.
- **Dashboard Interactivo:** Estadísticas en tiempo real, gráficos dinámicos (Recharts) y actividad reciente.
- **Administración de Usuarios:** Control de acceso basado en roles (RBAC) y auditoría de acciones.
- **Seguridad:** Autenticación robusta con JSON Web Tokens (JWT), encriptación de contraseñas con Bcrypt y protección contra inyecciones SQL y XSS.
- **Interfaz de Usuario:** Diseño responsive (adaptable a móviles), modo claro/oscuro y notificaciones interactivas.

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** (con Hooks como `useState`, `useEffect`, `useContext`)
- **Vite** (empaquetador y servidor de desarrollo)
- **React Router DOM** (navegación SPA)
- **TailwindCSS** (diseño y estilos responsive)
- **Axios** (consumo de API REST)
- **Recharts** (gráficos estadísticos)
- **React Hot Toast** (notificaciones)

### Backend
- **Node.js & Express** (servidor y API REST)
- **Sequelize** (ORM para base de datos)
- **MySQL** (gestor de base de datos relacional)
- **JWT (JSON Web Tokens)** (autenticación)
- **Bcrypt** (hash de contraseñas)
- **Express Validator** (validación de datos)
- **Winston** (registro de logs y auditoría)

## 🚀 Instalación y Ejecución

### Requisitos previos
- Node.js (v18 o superior)
- XAMPP (con el módulo MySQL iniciado)
- Git

### 1. Clonar el repositorio
```bash
git clone https://github.com/231165-design/portal-historias-clinicas.git
cd portal-historias-clinicas







