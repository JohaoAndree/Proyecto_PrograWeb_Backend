/** Tipos para los bodies de requests del backend */

export interface RegistroUsuarioBody {
  correo: string;
  password: string;
  nombre: string;
  foto?: string;
  pais: string;
}

export interface LoginUsuarioBody {
  correo: string;
  password: string;
}

export interface CrearJuegoBody {
  nombre: string;
  precio: string;
  descripcion?: string;
  categoriaId: string;
  descuento?: string;
  imagen?: string;
}

export interface EditarJuegoBody {
  nombre?: string;
  precio?: string;
  descripcion?: string;
  categoriaId?: string;
  descuento?: string;
  imagen?: string;
  estado?: boolean;
}

export interface NoticiaBody {
  nombre: string;
  descripcion: string;
}

export interface RecuperarPasswordBody {
  correo: string;
}

export interface NuevaClaveBody {
  nuevaClave: string;
}

export interface ActualizarPerfilBody {
  nombre?: string;
  correo?: string;
  foto?: string;
}
