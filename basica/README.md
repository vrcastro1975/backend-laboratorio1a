# Laboratorio 1A - Modelado documental (Parte basica)

## Objetivo
Disenar un modelo documental para un portal de e-learning orientado a programacion, optimizado para lectura en:

- Inicio con listados por categoria.
- Pagina de curso (curso + temario de videos).
- Pagina de leccion (video + autor).
- Pagina de autor (consulta menos frecuente).

## Colecciones

### `categories`
Catalogo de areas (Front End, Backend, DevOps, Otros).

Campos principales:
- `_id`
- `slug` (unico)
- `nombre`
- `creadoEn`, `actualizadoEn`

### `authors`
Informacion del autor y su biografia (poco trafico comparado con curso/leccion).

Campos principales:
- `_id`
- `slug` (unico)
- `nombreMostrado`
- `bioCorta`
- `urlAvatar`
- `enlacesSociales[]`
- `creadoEn`, `actualizadoEn`

### `courses`
Documento agregado principal. Incluye metadatos del curso y videos embebidos.

Campos principales:
- `_id`
- `slug` (unico)
- `titulo`
- `descripcionCorta`
- `level`
- `idCategoria` (ref -> `categories._id`)
- `idContenidoCursoCms` (GUID/ID en CMS)
- `publicadoEn`
- `videos[]` (subdocumentos embebidos)
- `creadoEn`, `actualizadoEn`

### `cursosAutores`
Coleccion intermedia para resolver la relacion entre cursos y autores sin M:M directa.

Campos principales:
- `_id`
- `idCurso` (ref -> `courses._id`)
- `idAutor` (ref -> `authors._id`)
- `rol`
- `creadoEn`

Subdocumento `videos[]`:
- `_id`
- `orden`
- `slug`
- `titulo`
- `resumen`
- `idAutor` (ref -> `authors._id`)
- `idRecursoVideo` (GUID/URL en S3 o CDN)
- `idContenidoArticuloCms` (ID de contenido en CMS)
- `publicadoEn`
- `duracionSeg`
- `estaPublicado`

## Patron de modelado y justificacion

### Embebido en `courses.videos[]`
Se aplica embebido para video/leccion porque:
- Un video no se comparte entre cursos (segun enunciado).
- La lectura "curso con sus videos" es muy frecuente.
- El maximo de videos por curso es bajo (1..20), encaja perfectamente en un documento.

### Referencias a `authors`, `categories` y `cursosAutores`
Se referencian entidades compartidas y con ciclo de vida propio:
- `authors` se usa en varios cursos y paginas de autor.
- `categories` se reutiliza para filtros y listados.
- `cursosAutores` actua como tabla intermedia para vincular curso y autor.

### Recursos externos (S3/CMS)
Se guardan IDs de recursos (`idRecursoVideo`, `idContenidoArticuloCms`, `idContenidoCursoCms`) y no el contenido binario o texto largo, cumpliendo el enunciado.

## Consultas objetivo (parte basica)

1. **Ultimos cursos publicados**
- Coleccion: `courses`
- Filtro: `publicadoEn <= now`
- Orden: `publicadoEn DESC`
- Limite: N

2. **Cursos por area**
- Coleccion: `courses`
- Filtro: `idCategoria = ...`
- Orden recomendado: `publicadoEn DESC`

3. **Curso con sus videos**
- Coleccion: `courses`
- Filtro: `slug = ...` (o `_id`)
- Proyeccion: campos del curso + `videos[]`

4. **Mostrar autor en una leccion**
- Obtener curso por `slug`.
- Localizar video por `videos.slug` (o `videos._id`).
- Resolver `videos.idAutor` contra `authors`.

## Indices recomendados

### `courses`
- `{ slug: 1 }` unico
- `{ publicadoEn: -1 }`
- `{ idCategoria: 1, publicadoEn: -1 }`
- `{ "videos.slug": 1 }` (multikey para busqueda por leccion)

### `authors`
- `{ slug: 1 }` unico

### `categories`
- `{ slug: 1 }` unico

## Compensaciones asumidas
- Duplicamos poco dato en `videos[]` para acelerar lectura en pagina de curso.
- El detalle completo de autor se mantiene normalizado en `authors` para no propagar cambios de biografia o avatar.
- Si en el futuro un video se compartiera entre cursos, se podria extraer `videos` a una coleccion independiente.

## Entregable incluido
- Diagrama: `diagrama.md`
- Justificacion de modelado: este `README.md`
