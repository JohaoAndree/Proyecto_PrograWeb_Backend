# GameStore Backend — API REST

API REST desarrollada con Express, TypeScript y Prisma ORM para la tienda de videojuegos GameStore. Provee endpoints para autenticación, catálogo de juegos, carrito de compras, noticias, ventas y panel de administración.

> Proyecto académico — Curso de Programación Web, Universidad de Lima.

---

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Variables de Entorno](#variables-de-entorno)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Modelo de Datos](#modelo-de-datos)
- [Endpoints de la API](#endpoints-de-la-api)
- [Equipo de Desarrollo](#equipo-de-desarrollo)

---

## Características

- **Autenticación**: Registro, login y recuperación de contraseña con token por correo.
- **Catálogo de juegos**: CRUD completo con filtro por categoría y eliminación lógica (soft delete).
- **Gestión de usuarios**: Listado, conteo y perfiles.
- **Gestión de noticias**: CRUD con subida de imágenes vía Multer.
- **Estadísticas de ventas**: Ganancias mensuales de los últimos 12 meses.
- **Envío de correos**: Bienvenida al registrarse y recuperación de contraseña con Nodemailer.
- **Seguridad**: Hashing de contraseñas con bcrypt.
- **ORM**: Prisma con PostgreSQL y migraciones versionadas.

---

## Tecnologías

| Componente | Tecnología |
|---|---|
| Runtime | Node.js |
| Lenguaje | TypeScript 5.8 |
| Framework | Express 5 |
| ORM | Prisma 6 |
| Base de datos | PostgreSQL |
| Hashing | bcrypt |
| Email | Nodemailer (Gmail SMTP) |
| Upload de archivos | Multer |
| Utilidades de fechas | date-fns |
| HTTP Client | Axios |
| Logger | Morgan |
| Dev server | Nodemon + ts-node |

---

## Requisitos Previos

- **Node.js 18+** y **npm 9+**
- **PostgreSQL** instalado y corriendo (local o remoto)
- Cuenta de **Gmail** con contraseña de aplicación (para Nodemailer)

---

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/JohaoAndree/Proyecto_PrograWeb_Backend.git
cd Proyecto_PrograWeb_Backend

# Instalar dependencias
npm install

# Generar el cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy
```

---

## Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
PORT=5020
NODE_ENV=development
DATABASE_URL=postgresql://usuario:password@localhost:5432/gamestore
FRONTEND_URL=http://localhost:5173/Proyecto_PrograWeb
```

> **Nota:** Para el envío de correos (Nodemailer), configurar las credenciales de Gmail dentro de los controladores correspondientes o extraerlas como variables de entorno adicionales.

---

## Ejecución

```bash
# Servidor de desarrollo (con hot reload)
npm run dev

# Build de producción
npm run build

# Iniciar en producción
npm start
```

El servidor estará disponible en `http://localhost:5020`.

---

## Estructura del Proyecto

```
src/
├── index.ts                          # Punto de entrada del servidor
├── app.ts                            # Configuración de Express (cors, morgan, rutas)
│
├── config/
│   └── env.ts                        # Variables de entorno tipadas
│
├── middlewares/
│   └── upload.ts                     # Configuración de Multer (subida de imágenes)
│
├── devs/                             # Módulos organizados por desarrollador
│   ├── johao/                        # Usuarios, noticias, estadísticas (admin)
│   │   ├── game.routes.ts
│   │   └── game.controller.ts
│   │
│   ├── fabiana/                      # Juegos (CRUD), autenticación, perfiles
│   │   ├── game.routes.ts
│   │   ├── game.controller.ts
│   │   ├── juego.router.ts
│   │   ├── juego.controller.ts
│   │   ├── user.routes.ts
│   │   └── user.controller.ts
│   │
│   ├── gerson/                       # Registro con email, juegos populares
│   │   ├── game.routes.ts
│   │   └── game.controller.ts
│   │
│   ├── diego/                        # Registro, juegos estáticos, carrito en memoria
│   │   ├── game.routes.ts
│   │   └── game.controller.ts
│   │
│   └── patrick/                      # Recuperación de contraseña
│       ├── game.routes.ts
│       └── game.controller.ts
│
prisma/
├── schema.prisma                     # Esquema de base de datos
└── migrations/                       # Historial de migraciones
│
public/
└── imagenes/                         # Archivos estáticos (fotos de noticias y usuarios)
    ├── noticia/
    └── usuario/
```

---

## Modelo de Datos

```
┌───────────┐       ┌───────────────┐       ┌─────────────┐
│  Usuario  │       │     Juego     │       │  Categoria  │
│───────────│       │───────────────│       │─────────────│
│ id        │──┐    │ id            │──┐    │ id          │
│ correo    │  │    │ nombre        │  │    │ nombre      │
│ password  │  │    │ precio        │  │    └─────────────┘
│ nombre    │  │    │ descuento     │  │
│ pais      │  │    │ foto/imagen   │  │
│ foto      │  │    │ descripcion   │  │
│ token     │  │    │ estaOferta    │  │
│ estado    │  │    │ masVendido    │  │
└───────────┘  │    │ estado        │  │
      │        │    │ categoriaId   │──┘
      │        │    └───────────────┘
      │        │           │
      │        │    ┌──────┴──────┐
      │        │    │             │
┌─────▼──┐  ┌─▼────▼──┐  ┌───────▼─────────┐  ┌────────────┐
│ Venta  │  │Calific. │  │JuegoPlataforma  │  │ Plataforma │
│────────│  │─────────│  │─────────────────│  │────────────│
│ id     │  │ id      │  │ id              │  │ id         │
│ fecha  │  │ valor.  │  │ juegoId         │  │ nombre     │
│ codigo │  │ coment. │  │ plataformaId    │──┘            │
│ monto  │  │ juegoId │  └─────────────────┘  └────────────┘
│ userId │  │ userId  │
│ juegoId│  └─────────┘
└────────┘

┌───────────┐
│  Noticia  │
│───────────│
│ id        │
│ titulo    │
│ texto     │
│ foto      │
│ activo    │
└───────────┘
```

---

## Endpoints de la API

### Autenticación y Usuarios

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/users/register` | Registrar usuario |
| `POST` | `/api/users/login` | Iniciar sesión |
| `GET` | `/api/users/:id` | Obtener perfil de usuario |
| `PUT` | `/api/users/:id` | Actualizar perfil |
| `POST` | `/api/gerson/games/registro` | Registro con email de bienvenida |
| `POST` | `/api/patrick/games/recuperar` | Solicitar recuperación de contraseña |
| `POST` | `/api/patrick/games/reset-password/:token` | Restablecer contraseña |

### Panel de Administración (Johao)

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/johao/usuarios` | Listar todos los usuarios |
| `GET` | `/api/johao/usuarios/count` | Contar usuarios registrados |
| `GET` | `/api/johao/ventas/ganancias` | Ganancias mensuales (últimos 12 meses) |
| `GET` | `/api/johao/noticias` | Listar noticias activas |
| `POST` | `/api/johao/noticias` | Crear noticia (con imagen) |
| `PUT` | `/api/johao/noticias/:id` | Editar noticia |
| `DELETE` | `/api/johao/noticias/:id` | Eliminar noticia (soft delete) |

### Juegos

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/juegos` | Listar juegos activos con categoría |
| `POST` | `/api/juegos` | Crear juego |
| `PUT` | `/api/juegos/:id` | Editar juego |
| `PUT` | `/api/juegos/eliminar/:id` | Eliminar juego (soft delete) |
| `GET` | `/api/juegos/categorias` | Listar categorías |
| `GET` | `/api/gerson/games/masvendidos` | Juegos más vendidos |

---

## Equipo de Desarrollo

| Integrante | Módulos |
|---|---|
| **Johao** | Endpoints admin (usuarios, noticias, estadísticas de ventas) |
| **Fabiana** | CRUD de juegos, autenticación (login/registro), perfiles de usuario |
| **Gerson** | Registro con email de bienvenida, juegos más vendidos y populares |
| **Diego** | Registro alternativo, juegos estáticos, carrito en memoria |
| **Patrick** | Recuperación y restablecimiento de contraseña con token |

---

## Licencia

Proyecto académico con fines educativos.
