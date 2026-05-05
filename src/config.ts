// Configuración estática de la app. Edita los valores aquí cuando quieras
// cambiar la foto del hero, el contacto o los enlaces de redes sociales.

export const config = {
  // URL de la foto de Mamen en el hero. Sustituye por la URL definitiva.
  heroImageUrl:
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=80&auto=format&fit=crop",

  // Texto del logo en el navbar
  brand: {
    name: "Mamen Fernández",
    tagline: "Mindfulness",
  },

  // Contacto principal
  contact: {
    whatsappNumber: "+34722349179",
    whatsappE164: "34722349179", // sin "+" para wa.me/...
    email: "", // opcional, si Mamen quiere mostrar email
  },

  // Perfiles de redes sociales — edita las URLs cuando estén confirmadas
  social: {
    facebook: "",
    instagram: "",
    youtube: "",
    linkedin: "",
  },

  // Web pública
  website: "https://mamenfd.es",
} as const

export type Config = typeof config
