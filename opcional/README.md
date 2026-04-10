# Laboratorio 1A - Modelado documental (Parte opcional)

## Objetivo de la ampliación
Cubrir los requisitos opcionales y desafío:

- Jerarquía de áreas (categorías en árbol).
- Contenido público/privado por curso y por vídeo.
- Usuarios con suscripción y usuarios que compran cursos concretos.
- Contabilizar visualizaciones de vídeo y de curso (no tiempo real estricto).
- Ejemplo práctico ejecutable con `docker compose up -d`.

## Diseño opcional

### 1) Jerarquía de categorías
Colección `categories` con estructura árbol:
- `parentId`: referencia al nodo padre (null en raíces).
- `ancestorSlugs[]`: ruta precalculada para búsquedas por rama.
- `depth`: nivel jerárquico.

Ventaja: permite filtros como "Backend" incluyendo "Backend > Node.js > Express".

### 2) Control de acceso

#### En `courses`
- `isPublic`: visibilidad global de curso.

#### En `courses.videos[]`
- `accessLevel`: `public` | `subscribers` | `purchased`
- `isPublic`: atajo derivado útil para filtros simples.

Regla de lectura recomendada:
- Si `accessLevel=public`: siempre visible.
- Si `subscribers`: visible con suscripción activa.
- Si `purchased`: visible si el usuario compró el curso (o tiene suscripción, según política).

### 3) Usuarios y monetización

#### `users`
Datos básicos del usuario.

#### `subscriptions`
Histórico de suscripciones (`active`, `cancelled`, `expired`).

#### `coursePurchases`
Compras unitarias por curso.

### 4) Métricas de visualización

#### `videoViewsDaily`
Acumulado por día (`courseId`, `videoId`, `day`, `views`).

#### Cachés en curso y vídeo
- `courses.totalViewsCached`
- `courses.videos[].viewsCached`

Se actualizan por proceso batch o job periódico, suficiente para el requisito "no real-time".

## Índices recomendados (opcional)

### `categories`
- `{ slug: 1 }` unique
- `{ parentId: 1, slug: 1 }`
- `{ ancestorSlugs: 1 }`

### `courses`
- `{ slug: 1 }` unique
- `{ categoryId: 1, publishedAt: -1 }`
- `{ isPublic: 1, publishedAt: -1 }`
- `{ "videos.slug": 1 }`
- `{ "videos.accessLevel": 1 }`

### `users`
- `{ email: 1 }` unique

### `subscriptions`
- `{ userId: 1, status: 1, endsAt: -1 }`

### `coursePurchases`
- `{ userId: 1, courseId: 1 }` unique
- `{ courseId: 1, purchasedAt: -1 }`

### `videoViewsDaily`
- `{ courseId: 1, videoId: 1, day: 1 }` unique
- `{ day: -1 }`

## Ejemplo práctico con Docker

Esta carpeta incluye:
- `docker-compose.yml`
- `mongo-init/01-init.js`

Levanta un MongoDB con datos de ejemplo y los índices creados automáticamente en el arranque.

### Arranque
```bash
docker compose up -d
```

### Comprobación rápida
```bash
docker compose exec mongo mongosh -u appuser -p apppass --authenticationDatabase admin elearning --eval "db.courses.find({}, {title:1, slug:1, categoryId:1}).pretty()"
```

### Parada
```bash
docker compose down
```

## Evidencias sugeridas para la entrega
- Captura de `docker compose ps`.
- Captura de una consulta que devuelva curso + vídeos.
- Captura de una consulta de control de acceso por usuario.
- Enlace a esta carpeta en tu repositorio del laboratorio.
