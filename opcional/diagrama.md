# Diagrama del modelo documental (parte opcional)

Relaciones en formato clásico:
- `ARBOL_CATEGORIAS 1:M CURSOS`
- `TEMATICAS 1:M CURSOS.videos`
- `CURSOS 1:M CURSOS_AUTORES`
- `AUTORES 1:M CURSOS_AUTORES`
- `USUARIOS 1:M SUSCRIPCIONES`
- `USUARIOS M:M CURSOS` mediante `COMPRAS_DE_CURSO`
- `CURSOS` incluye `videos[]` y `articulos[]` embebidos (subdocumentos, no colección aparte)
- `CURSOS 1:M VISTAS_DIARIAS_VIDEO`

```mermaid
erDiagram
    ARBOL_CATEGORIAS ||--|{ CURSOS : "1:M clasifica"
    TEMATICAS ||--|{ CURSOS : "1:M clasifica videos"
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

    TEMATICAS {
      _id objectId
      slug string
      nombre string
      creadoEn date
      actualizadoEn date
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
        videos.idTematica objectId
        videos.idAutor objectId
        videos.nivelAcceso string
        videos.esPublico bool
        videos.vistasCache int
        videos.idRecursoVideo string
        videos.idContenidoArticuloCms string
      articulos object[]
        articulos._id objectId
        articulos.slug string
        articulos.idAutor objectId
        articulos.nivelAcceso string
        articulos.esPublico bool
        articulos.vistasCache int
        articulos.idRecursoArticulo string
        articulos.idContenidoArticuloCms string
        articulos.numeroPag int
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

> `ARBOL_CATEGORIAS` permite jerarquías (`Front End > React > Testing`).
> En `VISTAS_DIARIAS_VIDEO`, `idVideo` referencia el `_id` del elemento de `videos[]` embebido en `CURSOS`.
> Nota: se usan símbolos de cardinalidad; aquí también está expresado en texto clásico (`1:M`, `M:M`).

## Relaciones

- `ARBOL_CATEGORIAS._id -> CURSOS.idCategoria` (1:M)
- `TEMATICAS._id -> CURSOS.videos.idTematica` (1:M, hacia subdocumento embebido)
- `CURSOS._id -> CURSOS_AUTORES.idCurso` (1:M)
- `AUTORES._id -> CURSOS_AUTORES.idAutor` (1:M)
- `AUTORES._id -> CURSOS.videos.idAutor` (1:M, hacia subdocumento embebido)
- `AUTORES._id -> CURSOS.articulos.idAutor` (1:M, hacia subdocumento embebido)
- `ARBOL_CATEGORIAS._id -> ARBOL_CATEGORIAS.idCategoriaPadre` (1:M, autorrelación)
- `USUARIOS._id -> SUSCRIPCIONES.idUsuario` (1:M)
- `USUARIOS._id -> COMPRAS_DE_CURSO.idUsuario` (1:M)
- `CURSOS._id -> COMPRAS_DE_CURSO.idCurso` (1:M)
- `CURSOS._id -> VISTAS_DIARIAS_VIDEO.idCurso` (1:M)
- `CURSOS.videos._id -> VISTAS_DIARIAS_VIDEO.idVideo` (1:M, referencia desde subdocumento embebido)
