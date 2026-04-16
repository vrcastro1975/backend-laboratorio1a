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
      _id objectId NN
      slug string NN
      nombre string NN
      creadoEn date
      actualizadoEn date
    }

    TEMATICAS {
      _id objectId NN
      slug string NN
      nombre string NN
      creadoEn date
      actualizadoEn date
    }

    AUTORES {
      _id objectId NN
      slug string NN
      nombreMostrado string NN
      bioCorta string NN
      urlAvatar string
      enlacesSociales string[]
      creadoEn date
      actualizadoEn date
    }

    CURSOS {
      _id objectId NN
      slug string NN
      titulo string NN
      descripcionCorta string NN
      nivel string
      idCategoria objectId NN FK->CATEGORIAS._id
      idContenidoCursoCms string NN
      publicadoEn date NN
      creadoEn date
      actualizadoEn date
      videos object[]
        videos._id objectId NN
        videos.orden int NN
        videos.slug string NN
        videos.titulo string NN
        videos.resumen string
        videos.idTematica objectId NN FK->TEMATICAS._id
        videos.idAutor objectId NN FK->AUTORES._id
        videos.idRecursoVideo string NN
        videos.idContenidoArticuloCms string
        videos.publicadoEn date NN
        videos.duracionSeg int
        videos.publicado bool
      articulos object[]
        articulos._id objectId NN
        articulos.orden int NN
        articulos.slug string NN
        articulos.titulo string NN
        articulos.resumen string
        articulos.idAutor objectId NN FK->AUTORES._id
        articulos.idRecursoArticulo string NN
        articulos.idContenidoArticuloCms string
        articulos.publicadoEn date NN
        articulos.numeroPag int
        articulos.publicado bool
    }

    CURSOS_AUTORES {
      _id objectId NN
      idCurso objectId NN FK->CURSOS._id
      idAutor objectId NN FK->AUTORES._id
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
