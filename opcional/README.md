# Laboratorio 1A - Modelado documental (Parte opcional)

## Objetivo de la ampliacion
Cubrir los requisitos opcionales y de desafio:

- Jerarquia de areas (categorias en arbol).
- Contenido publico/privado por curso y por video.
- Usuarios con suscripcion y usuarios que compran cursos concretos.
- Contabilizar visualizaciones de video y de curso (sin tiempo real estricto).
- Ejemplo practico ejecutable con `docker compose up -d`.

## Diseno opcional

### 1) Jerarquia de categorias
Coleccion `categories` con estructura de arbol:
- `idCategoriaPadre`: referencia al nodo padre (`null` en raices).
- `slugsAncestros[]`: ruta precalculada para busquedas por rama.
- `profundidad`: nivel jerarquico.

Ventaja: permite filtros como "Backend" incluyendo "Backend > Node.js > Express".

### 2) Control de acceso

#### En `courses`
- `esPublico`: visibilidad global de curso.

#### En `courses.videos[]`
- `nivelAcceso`: `public` | `subscribers` | `purchased`
- `esPublico`: atajo derivado util para filtros simples.

Regla de lectura recomendada:
- Si `nivelAcceso=public`: siempre visible.
- Si `subscribers`: visible con suscripcion activa.
- Si `purchased`: visible si el usuario compro el curso (o tiene suscripcion, segun politica).

### 3) Usuarios y monetizacion

#### `users`
Datos basicos del usuario.

#### `cursosAutores`
Coleccion intermedia entre `courses` y `authors`.

#### `subscriptions`
Historico de suscripciones (`active`, `cancelled`, `expired`).

#### `comprasCursos`
Compras unitarias por curso.

### 4) Metricas de visualizacion

#### `vistasVideosDiarias`
Acumulado por dia (`idCurso`, `idVideo`, `dia`, `vistas`).

#### Cache en curso y video
- `courses.vistasTotalesCache`
- `courses.videos[].vistasCache`

Se actualizan por proceso por lotes o trabajo periodico, suficiente para el requisito "sin tiempo real".

## Indices recomendados (opcional)

### `categories`
- `{ slug: 1 }` unico
- `{ idCategoriaPadre: 1, slug: 1 }`
- `{ slugsAncestros: 1 }`

### `courses`
- `{ slug: 1 }` unico
- `{ idCategoria: 1, publicadoEn: -1 }`
- `{ esPublico: 1, publicadoEn: -1 }`
- `{ "videos.slug": 1 }`
- `{ "videos.nivelAcceso": 1 }`

### `cursosAutores`
- `{ idCurso: 1, idAutor: 1 }` unico
- `{ idAutor: 1, idCurso: 1 }`

### `users`
- `{ email: 1 }` unico

### `subscriptions`
- `{ idUsuario: 1, estado: 1, terminaEn: -1 }`

### `comprasCursos`
- `{ idUsuario: 1, idCurso: 1 }` unico
- `{ idCurso: 1, compradoEn: -1 }`

### `vistasVideosDiarias`
- `{ idCurso: 1, idVideo: 1, dia: 1 }` unico
- `{ dia: -1 }`

## Ejemplo practico con Docker

Esta carpeta incluye:
- `docker-compose.yml`
- `mongo-init/01-init.js`

Levanta un MongoDB con datos de ejemplo y los indices creados automaticamente en el arranque.

### Arranque
```bash
docker compose up -d
```

### Comprobacion rapida
```bash
docker compose exec mongo mongosh -u appuser -p apppass --authenticationDatabase admin elearning --eval "db.courses.find({}, {titulo:1, title:1, slug:1, idCategoria:1, categoryId:1}).pretty()"
```

### Parada
```bash
docker compose down
```

## Evidencias sugeridas para la entrega
- Captura de `docker compose ps`.
- Captura de una consulta que devuelva curso + videos.
- Captura de una consulta de control de acceso por usuario.
- Enlace a esta carpeta en tu repositorio del laboratorio.
