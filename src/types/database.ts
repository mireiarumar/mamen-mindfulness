export type CategoriaSlug = string

export interface Meditacion {
  id: string
  titulo: string
  descripcion: string | null
  categoria: CategoriaSlug
  duracion_minutos: number | null
  url_audio: string
  activa: boolean
  orden: number
  created_at: string
}

export interface Curso {
  id: string
  titulo: string
  descripcion: string | null
  tipo: 'particular' | 'empresa'
  modalidad: 'Presencial' | 'Online' | 'Ambas'
  duracion: string | null
  imagen_url: string | null
  whatsapp_mensaje: string | null
  activo: boolean
  orden: number
  created_at: string
}

export interface Evento {
  id: string
  titulo: string
  descripcion: string | null
  fecha: string
  lugar: string | null
  imagen_url: string | null
  url_inscripcion: string | null
  tipo_inscripcion: 'whatsapp' | 'email' | 'url' | null
  activo: boolean
  created_at: string
}

export interface Categoria {
  id: string
  slug: string
  nombre: string
  orden: number
  created_at: string
}

export interface NewsletterSub {
  id: string
  email: string
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      meditaciones: { Row: Meditacion; Insert: Omit<Meditacion, 'id' | 'created_at'>; Update: Partial<Meditacion> }
      cursos: { Row: Curso; Insert: Omit<Curso, 'id' | 'created_at'>; Update: Partial<Curso> }
      eventos: { Row: Evento; Insert: Omit<Evento, 'id' | 'created_at'>; Update: Partial<Evento> }
      categorias: { Row: Categoria; Insert: Omit<Categoria, 'id' | 'created_at'>; Update: Partial<Categoria> }
      newsletter: { Row: NewsletterSub; Insert: Omit<NewsletterSub, 'id' | 'created_at'>; Update: Partial<NewsletterSub> }
    }
  }
}
