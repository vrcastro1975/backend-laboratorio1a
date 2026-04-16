// Inicializacion de datos de ejemplo (opcional) en espanol.
// Se ejecuta automaticamente en el primer arranque del contenedor.

const adminDb = db.getSiblingDB("admin");
adminDb.createUser({
  user: "appuser",
  pwd: "apppass",
  roles: [{ role: "readWrite", db: "elearning" }],
});

const elearning = db.getSiblingDB("elearning");
const now = new Date();

// Colecciones (sin tildes ni enyes): arbol_categorias, tematicas, autores,
// usuarios, suscripciones, usuarios_cursos, cursos, cursos_autores, vistas_diarias_video

const arbolCategorias = [
  { _id: ObjectId(), slug: "frontend", nombre: "Front End", idCategoriaPadre: null, slugsAncestros: [], profundidad: 0, creadoEn: now, actualizadoEn: now },
  { _id: ObjectId(), slug: "react", nombre: "React", idCategoriaPadre: null, slugsAncestros: ["frontend"], profundidad: 1, creadoEn: now, actualizadoEn: now },
  { _id: ObjectId(), slug: "backend", nombre: "Backend", idCategoriaPadre: null, slugsAncestros: [], profundidad: 0, creadoEn: now, actualizadoEn: now },
  { _id: ObjectId(), slug: "nodejs", nombre: "Node.js", idCategoriaPadre: null, slugsAncestros: ["backend"], profundidad: 1, creadoEn: now, actualizadoEn: now },
  { _id: ObjectId(), slug: "devops", nombre: "DevOps", idCategoriaPadre: null, slugsAncestros: [], profundidad: 0, creadoEn: now, actualizadoEn: now },
];

arbolCategorias[1].idCategoriaPadre = arbolCategorias[0]._id;
arbolCategorias[3].idCategoriaPadre = arbolCategorias[2]._id;

elearning.arbol_categorias.insertMany(arbolCategorias);

const tematicas = [
  { _id: ObjectId(), slug: "frontend", nombre: "Front End", creadoEn: now, actualizadoEn: now },
  { _id: ObjectId(), slug: "backend", nombre: "Back End", creadoEn: now, actualizadoEn: now },
  { _id: ObjectId(), slug: "devops", nombre: "DevOps", creadoEn: now, actualizadoEn: now },
];

elearning.tematicas.insertMany(tematicas);

const autores = [
  {
    _id: ObjectId(),
    slug: "daniel-sanchez",
    nombreMostrado: "Daniel Sanchez",
    bioCorta: "Desarrollador especializado en Front End y Backend. Docente en contenidos de React y Node.js.",
    urlAvatar: "https://cdn.example.com/autores/daniel.png",
    enlacesSociales: ["https://github.com/danielsanchez", "https://x.com/daniel"],
    creadoEn: now,
    actualizadoEn: now,
  },
  {
    _id: ObjectId(),
    slug: "laura-martin",
    nombreMostrado: "Laura Martin",
    bioCorta: "Ingeniera de software y autora de cursos de arquitectura backend.",
    urlAvatar: "https://cdn.example.com/autores/laura.png",
    enlacesSociales: ["https://github.com/lauramartin"],
    creadoEn: now,
    actualizadoEn: now,
  },
];

elearning.autores.insertMany(autores);

const cursos = [
  {
    _id: ObjectId(),
    slug: "introduccion-react",
    titulo: "Introduccion a React",
    descripcionCorta: "Aprende React desde cero con enfoque practico y base en TypeScript.",
    idCategoria: arbolCategorias[1]._id, // React
    idContenidoCursoCms: "cms-curso-react-001",
    esPublico: true,
    publicadoEn: new Date("2026-01-15T10:00:00Z"),
    vistasTotalesCache: 2140,
    videos: [
      {
        _id: ObjectId(),
        orden: 1,
        slug: "base",
        titulo: "Base",
        resumen: "Conceptos previos para arrancar con React.",
        idTematica: tematicas[0]._id,
        idAutor: autores[0]._id,
        idRecursoVideo: "s3://videos/react/base.mp4",
        idContenidoArticuloCms: "cms-articulo-react-base",
        duracionSeg: 580,
        nivelAcceso: "public",
        esPublico: true,
        estaPublicado: true,
        publicadoEn: new Date("2026-01-16T10:00:00Z"),
        vistasCache: 980,
      },
      {
        _id: ObjectId(),
        orden: 2,
        slug: "props-y-tipado",
        titulo: "React + TypeScript: Props",
        resumen: "Tipado de props y patrones de componentes.",
        idTematica: tematicas[0]._id,
        idAutor: autores[0]._id,
        idRecursoVideo: "s3://videos/react/props.mp4",
        idContenidoArticuloCms: "cms-articulo-react-props",
        duracionSeg: 760,
        nivelAcceso: "subscribers",
        esPublico: false,
        estaPublicado: true,
        publicadoEn: new Date("2026-01-17T10:00:00Z"),
        vistasCache: 620,
      },
    ],
    articulos: [
      {
        _id: ObjectId(),
        orden: 1,
        slug: "guia-inicio-react",
        titulo: "Guia de inicio con React",
        resumen: "Material de apoyo en PDF.",
        idAutor: autores[0]._id,
        idRecursoArticulo: "s3://articulos/react/guia-inicio.pdf",
        idContenidoArticuloCms: "cms-articulo-react-guia",
        publicadoEn: new Date("2026-01-16T12:00:00Z"),
        numeroPag: 12,
        nivelAcceso: "public",
        esPublico: true,
        vistasCache: 240,
      },
    ],
    creadoEn: now,
    actualizadoEn: now,
  },
  {
    _id: ObjectId(),
    slug: "backend-nodejs-api",
    titulo: "Backend Node.js API",
    descripcionCorta: "Disena y construye APIs REST robustas con Node.js y buenas practicas.",
    idCategoria: arbolCategorias[3]._id, // Node.js
    idContenidoCursoCms: "cms-curso-node-001",
    esPublico: false,
    publicadoEn: new Date("2026-02-02T12:00:00Z"),
    vistasTotalesCache: 1250,
    videos: [
      {
        _id: ObjectId(),
        orden: 1,
        slug: "arquitectura-api",
        titulo: "Arquitectura de API",
        resumen: "Capas, contratos y estructura de proyecto.",
        idTematica: tematicas[1]._id,
        idAutor: autores[1]._id,
        idRecursoVideo: "s3://videos/node/api-architecture.mp4",
        idContenidoArticuloCms: "cms-articulo-node-arch",
        duracionSeg: 840,
        nivelAcceso: "public",
        esPublico: true,
        estaPublicado: true,
        publicadoEn: new Date("2026-02-03T12:00:00Z"),
        vistasCache: 760,
      },
      {
        _id: ObjectId(),
        orden: 2,
        slug: "autenticacion-jwt",
        titulo: "Autenticacion JWT",
        resumen: "Implementacion de login y autorizacion basada en JWT.",
        idTematica: tematicas[1]._id,
        idAutor: autores[1]._id,
        idRecursoVideo: "s3://videos/node/jwt.mp4",
        idContenidoArticuloCms: "cms-articulo-node-jwt",
        duracionSeg: 920,
        nivelAcceso: "purchased",
        esPublico: false,
        estaPublicado: true,
        publicadoEn: new Date("2026-02-05T12:00:00Z"),
        vistasCache: 490,
      },
    ],
    articulos: [
      {
        _id: ObjectId(),
        orden: 1,
        slug: "checklist-api",
        titulo: "Checklist de API",
        resumen: "Checklist de buenas practicas en PDF.",
        idAutor: autores[1]._id,
        idRecursoArticulo: "s3://articulos/node/checklist-api.pdf",
        idContenidoArticuloCms: "cms-articulo-node-checklist",
        publicadoEn: new Date("2026-02-03T15:00:00Z"),
        numeroPag: 8,
        nivelAcceso: "subscribers",
        esPublico: false,
        vistasCache: 110,
      },
    ],
    creadoEn: now,
    actualizadoEn: now,
  },
];

elearning.cursos.insertMany(cursos);

// Coleccion puente curso-autor (metadatos de participacion)
elearning.cursos_autores.insertMany([
  { _id: ObjectId(), idCurso: cursos[0]._id, idAutor: autores[0]._id, rol: "autor", creadoEn: now },
  { _id: ObjectId(), idCurso: cursos[1]._id, idAutor: autores[1]._id, rol: "autor", creadoEn: now },
]);

const usuarios = [
  { _id: ObjectId(), email: "alumno1@example.com", nombreMostrado: "Alumno Uno", creadoEn: now },
  { _id: ObjectId(), email: "alumno2@example.com", nombreMostrado: "Alumno Dos", creadoEn: now },
];

elearning.usuarios.insertMany(usuarios);

elearning.suscripciones.insertMany([
  {
    _id: ObjectId(),
    idUsuario: usuarios[0]._id,
    plan: "monthly",
    iniciaEn: new Date("2026-03-01T00:00:00Z"),
    terminaEn: new Date("2026-03-31T23:59:59Z"),
    estado: "active",
  },
]);

elearning.usuarios_cursos.insertMany([
  {
    _id: ObjectId(),
    idUsuario: usuarios[1]._id,
    idCurso: cursos[1]._id,
    compradoEn: new Date("2026-03-05T14:00:00Z"),
    importe: NumberDecimal("49.00"),
    moneda: "EUR",
  },
]);

elearning.vistas_diarias_video.insertMany([
  { _id: ObjectId(), idCurso: cursos[0]._id, idVideo: cursos[0].videos[0]._id, dia: new Date("2026-03-08T00:00:00Z"), vistas: 120 },
  { _id: ObjectId(), idCurso: cursos[1]._id, idVideo: cursos[1].videos[1]._id, dia: new Date("2026-03-08T00:00:00Z"), vistas: 75 },
]);

// Indices (alineados con el modelo en espanol)
elearning.arbol_categorias.createIndex({ slug: 1 }, { unique: true });
elearning.arbol_categorias.createIndex({ idCategoriaPadre: 1, slug: 1 });
elearning.arbol_categorias.createIndex({ slugsAncestros: 1 });

elearning.tematicas.createIndex({ slug: 1 }, { unique: true });
elearning.autores.createIndex({ slug: 1 }, { unique: true });

elearning.cursos.createIndex({ slug: 1 }, { unique: true });
elearning.cursos.createIndex({ publicadoEn: -1 });
elearning.cursos.createIndex({ idCategoria: 1, publicadoEn: -1 });
elearning.cursos.createIndex({ esPublico: 1, publicadoEn: -1 });
elearning.cursos.createIndex({ "videos.slug": 1 });
elearning.cursos.createIndex({ "videos.idTematica": 1, publicadoEn: -1 });
elearning.cursos.createIndex({ "videos.nivelAcceso": 1 });
elearning.cursos.createIndex({ "articulos.slug": 1 });
elearning.cursos.createIndex({ "articulos.nivelAcceso": 1 });

elearning.cursos_autores.createIndex({ idCurso: 1, idAutor: 1 }, { unique: true });
elearning.cursos_autores.createIndex({ idAutor: 1, idCurso: 1 });

elearning.usuarios.createIndex({ email: 1 }, { unique: true });
elearning.suscripciones.createIndex({ idUsuario: 1, estado: 1, terminaEn: -1 });

elearning.usuarios_cursos.createIndex({ idUsuario: 1, idCurso: 1 }, { unique: true });
elearning.usuarios_cursos.createIndex({ idCurso: 1, compradoEn: -1 });

elearning.vistas_diarias_video.createIndex({ idCurso: 1, idVideo: 1, dia: 1 }, { unique: true });
elearning.vistas_diarias_video.createIndex({ dia: -1 });

print("Inicializacion completada para base de datos elearning (espanol)");
