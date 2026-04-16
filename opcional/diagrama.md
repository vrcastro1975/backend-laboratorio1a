# Diagrama del modelo documental (parte opcional)

Relaciones en formato clásico:
- `ARBOL_CATEGORIAS 1:M CURSOS`
- `TEMATICAS 1:M CURSOS.videos`
- `CURSOS 1:M CURSOS_AUTORES`
- `AUTORES 1:M CURSOS_AUTORES`
- `USUARIOS 1:M SUSCRIPCIONES`
- `USUARIOS M:M CURSOS` mediante `USUARIOS_CURSOS`
- `CURSOS` incluye `videos[]` y `articulos[]` embebidos (subdocumentos, no colección aparte)
- `CURSOS 1:M VISTAS_DIARIAS_VIDEO`

```mermaid
erDiagram
    ARBOL_CATEGORIAS ||--|{ CURSOS : "1:M clasifica"
    TEMATICAS ||--|{ CURSOS : "1:M clasifica videos"
    CURSOS ||--|{ CURSOS_AUTORES : "1:M vincula"
    AUTORES ||--|{ CURSOS_AUTORES : "1:M vincula"
    USUARIOS ||--|{ SUSCRIPCIONES : "1:M tiene"
    USUARIOS ||--|{ USUARIOS_CURSOS : "1:M compra"
    CURSOS ||--|{ USUARIOS_CURSOS : "1:M vendido"
    CURSOS ||--|{ VISTAS_DIARIAS_VIDEO : "1:M agrega"

    ARBOL_CATEGORIAS {
      _id objectId NN
      slug string NN
      nombre string NN
      idCategoriaPadre objectId FK->ARBOL_CATEGORIAS._id
      slugsAncestros string[]
      profundidad int
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

    USUARIOS {
      _id objectId NN
      email string NN
      nombreMostrado string NN
      creadoEn date
    }

    SUSCRIPCIONES {
      _id objectId NN
      idUsuario objectId NN FK->USUARIOS._id
      plan string NN
      iniciaEn date NN
      terminaEn date NN
      estado string NN
    }

    USUARIOS_CURSOS {
      _id objectId NN
      idUsuario objectId NN FK->USUARIOS._id
      idCurso objectId NN FK->CURSOS._id
      compradoEn date NN
      importe decimal NN
      moneda string NN
    }

    CURSOS {
      _id objectId NN
      slug string NN
      titulo string NN
      idCategoria objectId NN FK->ARBOL_CATEGORIAS._id
      esPublico bool
      vistasTotalesCache int
      videos object[]
        videos._id objectId NN
        videos.slug string NN
        videos.idTematica objectId NN FK->TEMATICAS._id
        videos.idAutor objectId NN FK->AUTORES._id
        videos.nivelAcceso string NN
        videos.esPublico bool
        videos.vistasCache int
        videos.idRecursoVideo string NN
        videos.idContenidoArticuloCms string
      articulos object[]
        articulos._id objectId NN
        articulos.slug string NN
        articulos.idAutor objectId NN FK->AUTORES._id
        articulos.nivelAcceso string NN
        articulos.esPublico bool
        articulos.vistasCache int
        articulos.idRecursoArticulo string NN
        articulos.idContenidoArticuloCms string
        articulos.numeroPag int
    }

    CURSOS_AUTORES {
      _id objectId NN
      idCurso objectId NN FK->CURSOS._id
      idAutor objectId NN FK->AUTORES._id
      rol string
      creadoEn date
    }

    VISTAS_DIARIAS_VIDEO {
      _id objectId NN
      idCurso objectId NN FK->CURSOS._id
      idVideo objectId NN FK->CURSOS.videos._id
      dia date NN
      vistas int NN
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
- `USUARIOS._id -> USUARIOS_CURSOS.idUsuario` (1:M)
- `CURSOS._id -> USUARIOS_CURSOS.idCurso` (1:M)
- `CURSOS._id -> VISTAS_DIARIAS_VIDEO.idCurso` (1:M)
- `CURSOS.videos._id -> VISTAS_DIARIAS_VIDEO.idVideo` (1:M, referencia desde subdocumento embebido)
