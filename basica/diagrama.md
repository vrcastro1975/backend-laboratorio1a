# Diagrama del modelo documental (parte basica)

Relaciones en formato clasico:
- `CATEGORIAS 1:M CURSOS`
- `CURSOS 1:M CURSOS_AUTORES`
- `AUTORES 1:M CURSOS_AUTORES`
- `CURSOS` incluye `videos[]` embebido (subdocumentos, no coleccion aparte)

```mermaid
erDiagram
    CATEGORIAS ||--|{ CURSOS : "1:M clasifica"
    CURSOS ||--|{ CURSOS_AUTORES : "1:M vincula"
    AUTORES ||--|{ CURSOS_AUTORES : "1:M vincula"

    CATEGORIAS {
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
        videos.idAutor objectId
        videos.idRecursoVideo string
        videos.idContenidoArticuloCms string
        videos.publicadoEn date
        videos.duracionSeg int
        videos.publicado bool
    }

    CURSOS_AUTORES {
      _id objectId
      idCurso objectId
      idAutor objectId
      rol string
      creadoEn date
    }
```

> Nota: con esta variante se evita la relacion M:M directa y se resuelve con la coleccion intermedia `CURSOS_AUTORES`.
