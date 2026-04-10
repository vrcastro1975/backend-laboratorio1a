# Laboratorio 1A - Modelado documental (Parte obligatoria)

## Objetivo
Diseñar un modelo documental para un portal de e-learning orientado a programación, optimizado para lectura en:

- Home con listados por categoría.
- Página de curso (curso + temario de vídeos).
- Página de lección (vídeo + autor).
- Página de autor (consulta menos frecuente).

## Colecciones

### `categories`
Catálogo de áreas (Front End, Backend, Devops, Otros).

Campos principales:
- `_id`
- `slug` (único)
- `name`
- `createdAt`, `updatedAt`

### `authors`
Información del autor y su biografía (poco tráfico comparado con curso/lección).

Campos principales:
- `_id`
- `slug` (único)
- `displayName`
- `shortBio`
- `avatarUrl`
- `socialLinks[]`
- `createdAt`, `updatedAt`

### `courses`
Documento agregado principal. Incluye metadatos del curso y vídeos embebidos.

Campos principales:
- `_id`
- `slug` (único)
- `title`
- `shortDescription`
- `level`
- `categoryId` (ref -> `categories._id`)
- `authorIds[]` (refs -> `authors._id`)
- `courseContentCmsId` (GUID/ID en CMS)
- `publishedAt`
- `videos[]` (subdocumentos embebidos)
- `createdAt`, `updatedAt`

Subdocumento `videos[]`:
- `_id`
- `order`
- `slug`
- `title`
- `summary`
- `authorId` (ref -> `authors._id`)
- `videoAssetId` (GUID/URL en S3 o CDN)
- `articleContentCmsId` (ID de contenido en CMS)
- `publishedAt`
- `durationSec`
- `isPublished`

## Patrón de modelado y justificación

### Embebido en `courses.videos[]`
Se aplica embebido para vídeo/lección porque:
- Un vídeo no se comparte entre cursos (según enunciado).
- La lectura "curso con sus vídeos" es muy frecuente.
- El máximo de vídeos por curso es bajo (1..20), encaja perfectamente en un documento.

### Referencias a `authors` y `categories`
Se referencian entidades compartidas y con ciclo de vida propio:
- `authors` se usa en varios cursos y páginas de autor.
- `categories` se reutiliza para filtros/listados.

### Recursos externos (S3/CMS)
Se guardan IDs de recursos (`videoAssetId`, `articleContentCmsId`, `courseContentCmsId`) y no el contenido binario/texto largo, cumpliendo el enunciado.

## Consultas objetivo (parte obligatoria)

1. **Últimos cursos publicados**
- Colección: `courses`
- Filtro: `publishedAt <= now`
- Orden: `publishedAt DESC`
- Límite: N

2. **Cursos por área**
- Colección: `courses`
- Filtro: `categoryId = ...`
- Orden recomendado: `publishedAt DESC`

3. **Curso con sus vídeos**
- Colección: `courses`
- Filtro: `slug = ...` (o `_id`)
- Proyección: campos del curso + `videos[]`

4. **Mostrar autor en una lección**
- Obtener curso por `slug`.
- Localizar vídeo por `videos.slug` (o `videos._id`).
- Resolver `videos.authorId` contra `authors`.

## Índices recomendados

### `courses`
- `{ slug: 1 }` unique
- `{ publishedAt: -1 }`
- `{ categoryId: 1, publishedAt: -1 }`
- `{ "videos.slug": 1 }` (multikey para lookup por lección)

### `authors`
- `{ slug: 1 }` unique

### `categories`
- `{ slug: 1 }` unique

## Trade-offs asumidos
- Duplicamos poco dato en `videos[]` para acelerar lectura en página de curso.
- El detalle completo de autor se mantiene normalizado en `authors` para no propagar cambios de biografía/avatar.
- Si en el futuro un vídeo se compartiera entre cursos, se podría extraer `videos` a colección independiente.

## Entregable incluido
- Diagrama: `diagrama-mermaid.md`
- Justificación de modelado: este `README.md`
