# Diagrama del modelo documental (parte básica)

Relaciones en formato clásico:
- `CATEGORIAS 1:M CURSOS`
- `TEMATICAS 1:M CURSOS.videos`
- `CURSOS 1:M CURSOS_AUTORES`
- `AUTORES 1:M CURSOS_AUTORES`
- `CURSOS` incluye `videos[]` embebido (subdocumentos, no colección aparte)

```mermaid
erDiagram
    CATEGORIAS ||--|{ CURSOS : "1:M clasifica"
    TEMATICAS ||--|{ CURSOS : "1:M clasifica videos"
    CURSOS ||--|{ CURSOS_AUTORES : "1:M vincula"
    AUTORES ||--|{ CURSOS_AUTORES : "1:M vincula"

    CATEGORIAS {
      _id objectId
      slug string
      nombre string
      creadoEn date
      actualizadoEn date
    }

    TEMATICAS {
      _id objectId
      slug string
      nombre string
      creadoEn date
      actualizadoEn date
    }

    AUTORES {
      _id objectId
      slug string
      nombreMostrado string
      bioCorta string
      urlAvatar string
      enlacesSociales string[]
      creadoEn date
      actualizadoEn date
    }

    CURSOS {
      _id objectId
      slug string
      titulo string
      descripcionCorta string
      nivel string
      idCategoria objectId
      idContenidoCursoCms string
      publicadoEn date
      creadoEn date
      actualizadoEn date
      videos object[]
        videos._id objectId
        videos.orden int
        videos.slug string
        videos.titulo string
        videos.resumen string
        videos.idTematica objectId
        videos.idAutor objectId
        videos.idRecursoVideo string
        videos.idContenidoArticuloCms string
        videos.publicadoEn date
        videos.duracionSeg int
        videos.publicado bool
      articulos object[]
        articulos._id objectId
        articulos.orden int
        articulos.slug string
        articulos.titulo string
        articulos.resumen string
        articulos.idAutor objectId
        articulos.idRecursoArticulo string
        articulos.idContenidoArticuloCms string
        articulos.publicadoEn date
        articulos.numeroPag int
        articulos.publicado bool
    }

    CURSOS_AUTORES {
      _id objectId
      idCurso objectId
      idAutor objectId
      rol string
      creadoEn date
    }
```

> Nota: con esta variante se evita la relación M:M directa y se resuelve con la colección intermedia `CURSOS_AUTORES`.

## Relaciones

- `CATEGORIAS._id -> CURSOS.idCategoria` (1:M)
- `TEMATICAS._id -> CURSOS.videos.idTematica` (1:M, hacia subdocumento embebido)
- `CURSOS._id -> CURSOS_AUTORES.idCurso` (1:M)
- `AUTORES._id -> CURSOS_AUTORES.idAutor` (1:M)
- `AUTORES._id -> CURSOS.videos.idAutor` (1:M, hacia subdocumento embebido)
- `AUTORES._id -> CURSOS.articulos.idAutor` (1:M, hacia subdocumento embebido)
