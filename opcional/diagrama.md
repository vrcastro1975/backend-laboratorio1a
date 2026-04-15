# Diagrama del modelo documental (parte opcional)

Relaciones en formato clasico:
- `ARBOL_CATEGORIAS 1:M CURSOS`
- `CURSOS 1:M CURSOS_AUTORES`
- `AUTORES 1:M CURSOS_AUTORES`
- `USUARIOS 1:M SUSCRIPCIONES`
- `USUARIOS M:M CURSOS` mediante `COMPRAS_DE_CURSO`
- `CURSOS` incluye `videos[]` embebido (subdocumentos, no coleccion aparte)
- `CURSOS 1:M VISTAS_DIARIAS_VIDEO`

```mermaid
erDiagram
    ARBOL_CATEGORIAS ||--|{ CURSOS : "1:M clasifica"
    CURSOS ||--|{ CURSOS_AUTORES : "1:M vincula"
    AUTORES ||--|{ CURSOS_AUTORES : "1:M vincula"
    USUARIOS ||--|{ SUSCRIPCIONES : "1:M tiene"
    USUARIOS ||--|{ COMPRAS_DE_CURSO : "1:M compra"
    CURSOS ||--|{ COMPRAS_DE_CURSO : "1:M vendido"
    CURSOS ||--|{ VISTAS_DIARIAS_VIDEO : "1:M agrega"

    ARBOL_CATEGORIAS {
      _id objectId
      slug string
      nombre string
      idCategoriaPadre objectId
      slugsAncestros string[]
      profundidad int
    }

    USUARIOS {
      _id objectId
      email string
      nombreMostrado string
      creadoEn date
    }

    SUSCRIPCIONES {
      _id objectId
      idUsuario objectId
      plan string
      iniciaEn date
      terminaEn date
      estado string
    }

    COMPRAS_DE_CURSO {
      _id objectId
      idUsuario objectId
      idCurso objectId
      compradoEn date
      importe number
      moneda string
    }

    CURSOS {
      _id objectId
      slug string
      titulo string
      idCategoria objectId
      esPublico bool
      vistasTotalesCache int
      videos object[]
        videos._id objectId
        videos.slug string
        videos.idAutor objectId
        videos.nivelAcceso string
        videos.esPublico bool
        videos.vistasCache int
        videos.idRecursoVideo string
        videos.idContenidoArticuloCms string
    }

    CURSOS_AUTORES {
      _id objectId
      idCurso objectId
      idAutor objectId
      rol string
      creadoEn date
    }

    VISTAS_DIARIAS_VIDEO {
      _id objectId
      idCurso objectId
      idVideo objectId
      dia date
      vistas int
    }
```

> `ARBOL_CATEGORIAS` permite jerarquias (`Front End > React > Testing`).
> En `VISTAS_DIARIAS_VIDEO`, `idVideo` referencia el `_id` del elemento de `videos[]` embebido en `CURSOS`.
> Nota: se usan simbolos de cardinalidad; aqui tambien esta expresado en texto clasico (`1:M`, `M:M`).
