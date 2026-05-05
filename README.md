# Mamen Fernández · Mindfulness

Web pública con meditaciones guiadas, catálogo de cursos y agenda de eventos. Incluye un panel de administración protegido con contraseña para que Mamen gestione todo el contenido sin tocar código.

- **Stack:** React 18 + Vite 5 + TypeScript + Tailwind CSS v4 + React Router v6
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Deploy:** Netlify
- **PWA:** instalable en móvil

---

## 1. Setup local

### Requisitos previos

- Node.js 20+ ([descargar](https://nodejs.org))
- Una cuenta de [Supabase](https://supabase.com) (gratuita)
- Git

### Instalar dependencias

```bash
npm install
```

### Configurar variables de entorno

Copia el archivo de ejemplo y rellena con los valores reales (los obtendrás en el siguiente paso al crear el proyecto Supabase):

```bash
cp .env.example .env
```

Edita `.env`:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

### Levantar el servidor de desarrollo

```bash
npm run dev
```

Abre http://localhost:5173.

---

## 2. Crear el proyecto Supabase

### 2.1. Crear el proyecto

1. Entra en https://supabase.com y crea una cuenta (con Google o email).
2. Pulsa **"New project"**.
3. Rellena:
   - **Name:** `mamen-mindfulness` (o el que prefieras)
   - **Database password:** genera una larga y guárdala en un gestor de contraseñas
   - **Region:** elige `West EU (Paris)` o `West EU (Ireland)` para latencia baja desde España
4. Espera 1-2 minutos a que se cree.

### 2.2. Copiar las claves a `.env`

En el panel de Supabase de tu proyecto:

1. Menú lateral → **Settings (⚙️) → API**
2. Copia **Project URL** → es el valor de `VITE_SUPABASE_URL`
3. Copia **Project API keys → `anon` `public`** → es el valor de `VITE_SUPABASE_ANON_KEY`

⚠️ **NO** uses la clave `service_role`. Esa es secreta y no debe ir nunca al frontend.

### 2.3. Ejecutar los SQL en el orden indicado

En el panel de Supabase → **SQL Editor → New query**, pega y ejecuta cada archivo de la carpeta [`db/`](db/) **en este orden exacto**:

1. **`db/01_schema.sql`** — crea las tablas y las políticas de seguridad (RLS).
2. **`db/02_seed.sql`** — inserta las categorías, las 21 meditaciones precargadas y los cursos iniciales.
3. **`db/03_storage.sql`** — crea los buckets de almacenamiento (`meditaciones`, `cursos`, `eventos`) y sus permisos.

Cada archivo es idempotente: puedes ejecutarlo varias veces sin romper nada.

### 2.4. Crear el usuario administrador

Para que Mamen pueda entrar en `/admin`:

1. En Supabase → **Authentication → Users → "Add user" → "Create new user"**
2. Rellena:
   - **Email:** `mamen@…` (el que use Mamen)
   - **Password:** una contraseña fuerte
   - ✅ Marca **"Auto Confirm User"** (importante: si no, no podrá entrar hasta confirmar email)
3. Pulsa **Create user**.

Para añadir más administradores en el futuro: el mismo proceso.

> 💡 Para resetear la contraseña: en **Authentication → Users**, selecciona el usuario y pulsa **"Send password recovery"**, o cambia la contraseña directamente.

### 2.5. (Opcional) Permitir registro abierto: **NO**

El brief especifica que no hay registro de usuarios. La autenticación está **solo** para el admin. Por defecto, Supabase permite signup público — desactívalo para más seguridad:

**Authentication → Providers → Email**:
- ✅ Enable Email provider
- ❌ Desactiva **"Enable sign-ups"** (el admin se crea solo desde el panel)

---

## 3. Personalización

### 3.1. Foto del hero, redes sociales, contacto

Edita [`src/config.ts`](src/config.ts):

```ts
export const config = {
  heroImageUrl: "https://...",   // foto de Mamen en la home
  contact: {
    whatsappNumber: "+34722349179",
    whatsappE164: "34722349179",
  },
  social: {
    facebook:  "https://facebook.com/...",
    instagram: "https://instagram.com/...",
    youtube:   "https://youtube.com/@...",
    linkedin:  "https://linkedin.com/in/...",
  },
}
```

Las redes sociales aparecen en el footer **solo si tienen una URL**. Las vacías se ocultan automáticamente.

### 3.2. Colores e imagen de marca

Los colores corporativos están centralizados en [`src/index.css`](src/index.css), bajo `@theme`. Si Mamen los cambia en el futuro, solo hay que tocar ahí.

### 3.3. Contenido (meditaciones, cursos, eventos, categorías)

Mamen lo gestiona desde `/admin` directamente — no hace falta tocar código.

---

## 4. Deploy en Netlify

### 4.1. Subir el repo a GitHub

(Si aún no lo has hecho.)

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/mireiarumar/mamen-mindfulness.git
git branch -M main
git push -u origin main
```

### 4.2. Conectar Netlify

1. Entra en https://app.netlify.com
2. **"Add new site" → "Import an existing project" → "GitHub"**
3. Autoriza Netlify y selecciona el repo `mamen-mindfulness`
4. La detección automática es correcta (lee `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **Antes de pulsar "Deploy"**: pulsa **"Add environment variables"** y añade:
   - `VITE_SUPABASE_URL` → la URL de tu proyecto Supabase
   - `VITE_SUPABASE_ANON_KEY` → la anon key
6. Pulsa **Deploy**.

### 4.3. (Opcional) Dominio personalizado

En Netlify → **Domain settings → Add custom domain**. Sigue las instrucciones para apuntar el DNS de `mamenfd.es` (u otro dominio) a Netlify.

---

## 5. Estructura del proyecto

```
.
├── db/                       # SQL para Supabase (esquema, seed, storage)
├── public/                   # Assets estáticos (icons, manifest, sw.js)
├── src/
│   ├── components/           # Componentes reutilizables
│   │   ├── admin/            # Componentes del panel admin
│   │   ├── Footer.tsx
│   │   ├── Layout.tsx
│   │   ├── MiniPlayer.tsx
│   │   ├── Navbar.tsx
│   │   └── Skeleton.tsx
│   ├── contexts/             # AuthContext, PlayerContext
│   ├── lib/                  # supabase client, helpers de formato
│   ├── pages/
│   │   ├── admin/            # Login + CRUDs del panel
│   │   ├── Home.tsx
│   │   ├── Meditaciones.tsx
│   │   ├── Cursos.tsx
│   │   └── Eventos.tsx
│   ├── types/database.ts     # Tipos TS de las tablas Supabase
│   ├── config.ts             # Foto del hero, RRSS, contacto
│   ├── index.css             # Tailwind v4 + tema corporativo
│   ├── main.tsx
│   └── App.tsx               # Router principal
├── .env.example
├── index.html
├── netlify.toml              # Config de deploy
├── package.json
├── tsconfig.*.json
└── vite.config.ts
```

---

## 6. Cómo gestionar contenido (para Mamen)

### Entrar en el panel

Ve a `https://tu-dominio.com/admin` (en local: http://localhost:5173/admin).

### Añadir una meditación

1. Pestaña **Meditaciones** → **+ Nueva**
2. Rellena título, categoría y duración.
3. Para el audio: o pega una URL (ej. de mamenfd.es) o pulsa **"Subir archivo"** y sube el MP3 directamente.
4. Marca **"Visible en la web pública"** y guarda.

El archivo subido va al bucket `meditaciones` de Supabase Storage automáticamente.

### Añadir un evento

1. **Eventos** → **+ Nuevo**
2. La fecha es importante: si es **anterior a hoy**, el evento aparecerá automáticamente en la sección "Eventos pasados" de la web.
3. Si quieres que la gente se inscriba, elige **Tipo de inscripción** (WhatsApp, email o URL externa) y rellena el dato.

### Crear una categoría nueva

1. **Categorías** → **+ Nueva**
2. Solo necesitas el nombre: el "identificador" se genera solo.
3. Esa categoría aparecerá inmediatamente en el filtro público y en el formulario de meditaciones.

---

## 7. Comandos útiles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción → dist/
npm run preview      # Servir el build localmente
npm run typecheck    # Solo verificación de tipos
```

---

## 8. Solución de problemas

**"No se pudieron cargar las meditaciones"**
→ Revisa que `.env` tiene los valores correctos y que ejecutaste los 3 SQL en Supabase.

**El admin no puede entrar**
→ ¿Está confirmado el usuario? En Supabase → Authentication → Users, comprueba que la columna `Last sign in` no es `Never` o que `Email confirmed at` está rellena.

**No se sube un archivo desde el admin**
→ Asegúrate de haber ejecutado `db/03_storage.sql` para crear los buckets y sus permisos.

**Las URLs de los audios precargados de mamenfd.es no funcionan**
→ Esos audios viven en el servidor de WordPress de Mamen. Si en el futuro mueve el dominio o reorganiza los archivos, hay que actualizar las URLs (desde el panel admin, una a una, o con un UPDATE SQL en Supabase).

---

## 9. Licencia

Privada. Todos los derechos reservados a Mamen Fernández.
