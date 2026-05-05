-- Datos iniciales para mamen-mindfulness
-- Ejecuta este archivo en el SQL Editor DESPUÉS de 01_schema.sql

-- ──────────────────────────────────────────────────────────────
-- Categorías
-- ──────────────────────────────────────────────────────────────
insert into public.categorias (slug, nombre, orden) values
  ('respiracion',       'Respiración',         10),
  ('escaner-corporal',  'Escáner corporal',    20),
  ('emociones',         'Emociones',           30),
  ('pensamientos',      'Pensamientos',        40),
  ('gestion-estres',    'Gestión del estrés',  50),
  ('general',           'General',             60)
on conflict (slug) do nothing;

-- ──────────────────────────────────────────────────────────────
-- Meditaciones (21 audios precargados de mamenfd.es)
-- duracion_minutos se deja null; Mamen la rellenará desde el panel
-- ──────────────────────────────────────────────────────────────
insert into public.meditaciones (titulo, descripcion, categoria, url_audio, orden) values
  ('Atención a la respiración',                   null, 'respiracion',      'https://mamenfd.es/wp-content/uploads/2019/11/atención-a-la-respiracion.mp3', 10),
  ('Escáner corporal',                            null, 'escaner-corporal', 'https://mamenfd.es/wp-content/uploads/2020/01/escaneo.mp3', 20),
  ('Escáner 2',                                   null, 'escaner-corporal', 'https://mamenfd.es/wp-content/uploads/2025/04/ESCANEO-2.mp3', 30),
  ('Cultivo de la paciencia',                     null, 'general',          'https://mamenfd.es/wp-content/uploads/2019/12/paci.mp3', 40),
  ('Trabajar emociones difíciles',                null, 'emociones',        'https://mamenfd.es/wp-content/uploads/2020/01/acoger-emociones-difíciles.mp3', 50),
  ('Observar nuestros pensamientos',              null, 'pensamientos',     'https://mamenfd.es/wp-content/uploads/2019/12/observar-pensamientos.mp3', 60),
  ('Encontrar nuestra postura de meditación',     null, 'general',          'https://mamenfd.es/wp-content/uploads/2019/12/postura-meditacion.mp3', 70),
  ('Quién soy',                                   null, 'general',          'https://mamenfd.es/wp-content/uploads/2020/01/QUIEN-SOY.mp3', 80),
  ('Evitar sabotajes',                            null, 'pensamientos',     'https://mamenfd.es/wp-content/uploads/2020/01/Sabotajes.mp3', 90),
  ('Pausa de cinco minutos',                      null, 'gestion-estres',   'https://mamenfd.es/wp-content/uploads/2019/12/pausa-5-minutos.mp3', 100),
  ('Pensamientos recurrentes',                    null, 'pensamientos',     'https://mamenfd.es/wp-content/uploads/2020/01/pensamientos-recurrentes.mp3', 110),
  ('Meditación para momentos de dolor físico',    null, 'general',          'https://mamenfd.es/wp-content/uploads/2020/01/MED-PARA-MOMENTOS-DE-DOLOR.mp3', 120),
  ('La Montaña',                                  null, 'general',          'https://mamenfd.es/wp-content/uploads/2020/02/la-Montaña.mp3', 130),
  ('Recuperar la sensibilidad',                   null, 'emociones',        'https://mamenfd.es/wp-content/uploads/2024/11/Sensibilidad.mp3', 140),
  ('Espalda fuerte, corazón suave',               null, 'emociones',        'https://mamenfd.es/wp-content/uploads/2024/11/Espalda-fuerte-corazon-suave.mp3', 150),
  ('La Ecuanimidad',                              null, 'general',          'https://mamenfd.es/wp-content/uploads/2024/11/ecuanimidad-1-1.mp3', 160),
  ('Calmar la ansiedad',                          null, 'gestion-estres',   'https://mamenfd.es/wp-content/uploads/2024/01/calmar-momentos-de-ansiedad.mp3', 170),
  ('Necesidad de aprobación',                     null, 'emociones',        'https://mamenfd.es/wp-content/uploads/2023/12/Necesidad-de-aprobacion.mp3', 180),
  ('La Gratitud',                                 null, 'general',          'https://mamenfd.es/wp-content/uploads/2020/03/gratitud.mp3', 190),
  ('Gratitud nueva',                              null, 'general',          'https://mamenfd.es/wp-content/uploads/2025/08/GRATITUD-NUEVA.mp3', 200),
  ('La aceptación',                               null, 'emociones',        'https://mamenfd.es/wp-content/uploads/2020/04/aceptacion.mp3', 210);

-- ──────────────────────────────────────────────────────────────
-- Cursos precargados
-- ──────────────────────────────────────────────────────────────
insert into public.cursos (titulo, descripcion, tipo, modalidad, whatsapp_mensaje, orden) values
  ('Formación en Mindfulness para particulares',
   'Programas de mindfulness para mejorar el bienestar y gestionar el estrés cotidiano.',
   'particular', 'Ambas',
   'Hola Mamen, me interesa la formación en mindfulness para particulares.', 10),

  ('Nuevos estilos de liderazgo',
   'Evolucionar desde modelos reactivos hacia un liderazgo consciente y eficaz.',
   'empresa', 'Ambas',
   'Hola Mamen, querría más información sobre el curso "Nuevos estilos de liderazgo".', 20),

  ('Comunicación efectiva',
   'Habilidades de comunicación aplicadas al entorno laboral para reducir conflictos.',
   'empresa', 'Ambas',
   'Hola Mamen, querría más información sobre el curso "Comunicación efectiva".', 30),

  ('Gestión de equipos',
   'Herramientas para organizar mejor el trabajo y mejorar el rendimiento colectivo.',
   'empresa', 'Ambas',
   'Hola Mamen, querría más información sobre el curso "Gestión de equipos".', 40),

  ('Trabajo bajo presión',
   'Mantener claridad mental y control emocional en situaciones de alta exigencia.',
   'empresa', 'Ambas',
   'Hola Mamen, querría más información sobre el curso "Trabajo bajo presión".', 50),

  ('Adaptación al cambio',
   'Gestión del cambio individual y organizacional para transiciones más eficaces.',
   'empresa', 'Ambas',
   'Hola Mamen, querría más información sobre el curso "Adaptación al cambio".', 60),

  ('Feedback constructivo',
   'Dar y recibir feedback de forma efectiva para mejorar la cultura de equipo.',
   'empresa', 'Ambas',
   'Hola Mamen, querría más información sobre el curso "Feedback constructivo".', 70),

  ('De Bombero a Líder',
   'Para mandos intermedios que viven en la urgencia constante. Dejar de apagar fuegos y empezar a liderar con estrategia.',
   'empresa', 'Ambas',
   'Hola Mamen, querría más información sobre el curso "De Bombero a Líder".', 80);
