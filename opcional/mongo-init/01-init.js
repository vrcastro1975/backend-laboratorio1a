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

const arbolCategorias = [
  { _id: ObjectId(), slug: "frontend", nombre: "Front End", idCategoriaPadre: null, slugsAncestros: [], profundidad: 0, creadoEn: now, actualizadoEn: now },
  { _id: ObjectId(), slug: "react", nombre: "React", idCategoriaPadre: null, slugsAncestros: ["frontend"], profundidad: 1, creadoEn: now, actualizadoEn: now },
  { _id: ObjectId(), slug: "angular", nombre: "Angular", idCategoriaPadre: null, slugsAncestros: ["frontend"], profundidad: 1, creadoEn: now, actualizadoEn: now },
  { _id: ObjectId(), slug: "backend", nombre: "Backend", idCategoriaPadre: null, slugsAncestros: [], profundidad: 0, creadoEn: now, actualizadoEn: now },
  { _id: ObjectId(), slug: "nodejs", nombre: "Node.js", idCategoriaPadre: null, slugsAncestros: ["backend"], profundidad: 1, creadoEn: now, actualizadoEn: now },
  { _id: ObjectId(), slug: "devops", nombre: "DevOps", idCategoriaPadre: null, slugsAncestros: [], profundidad: 0, creadoEn: now, actualizadoEn: now },
  { _id: ObjectId(), slug: "docker", nombre: "Docker", idCategoriaPadre: null, slugsAncestros: ["devops"], profundidad: 1, creadoEn: now, actualizadoEn: now },
  { _id: ObjectId(), slug: "otros", nombre: "Otros", idCategoriaPadre: null, slugsAncestros: [], profundidad: 0, creadoEn: now, actualizadoEn: now },
  { _id: ObjectId(), slug: "ia", nombre: "IA", idCategoriaPadre: null, slugsAncestros: ["otros"], profundidad: 1, creadoEn: now, actualizadoEn: now },
];

const bySlug = Object.fromEntries(arbolCategorias.map((c) => [c.slug, c]));
bySlug.react.idCategoriaPadre = bySlug.frontend._id;
bySlug.angular.idCategoriaPadre = bySlug.frontend._id;
bySlug.nodejs.idCategoriaPadre = bySlug.backend._id;
bySlug.docker.idCategoriaPadre = bySlug.devops._id;
bySlug.ia.idCategoriaPadre = bySlug.otros._id;

elearning.arbol_categorias.insertMany(arbolCategorias);

const tematicas = [
  { _id: ObjectId(), slug: "frontend", nombre: "Front End", creadoEn: now, actualizadoEn: now },
  { _id: ObjectId(), slug: "backend", nombre: "Back End", creadoEn: now, actualizadoEn: now },
  { _id: ObjectId(), slug: "devops", nombre: "DevOps", creadoEn: now, actualizadoEn: now },
  { _id: ObjectId(), slug: "otros", nombre: "Otros", creadoEn: now, actualizadoEn: now },
];
const tematica = Object.fromEntries(tematicas.map((t) => [t.slug, t]));
elearning.tematicas.insertMany(tematicas);

const autores = [
  {
    _id: ObjectId(),
    slug: "daniel-sanchez",
    nombreMostrado: "Daniel Sanchez",
    bioCorta: "Especialista Front End y contenido React.",
    urlAvatar: "https://cdn.example.com/autores/daniel.png",
    enlacesSociales: ["https://github.com/danielsanchez"],
    creadoEn: now,
    actualizadoEn: now,
  },
  {
    _id: ObjectId(),
    slug: "laura-martin",
    nombreMostrado: "Laura Martin",
    bioCorta: "Ingeniera de software y autora de cursos backend.",
    urlAvatar: "https://cdn.example.com/autores/laura.png",
    enlacesSociales: ["https://github.com/lauramartin"],
    creadoEn: now,
    actualizadoEn: now,
  },
  {
    _id: ObjectId(),
    slug: "carlos-ruiz",
    nombreMostrado: "Carlos Ruiz",
    bioCorta: "DevOps Engineer y docente de contenedores e infraestructura.",
    urlAvatar: "https://cdn.example.com/autores/carlos.png",
    enlacesSociales: ["https://github.com/carlosruiz"],
    creadoEn: now,
    actualizadoEn: now,
  },
];
const autor = Object.fromEntries(autores.map((a) => [a.slug, a]));
elearning.autores.insertMany(autores);

function video({ slug, titulo, resumen, idTematica, idAutor, idRecursoVideo, cms, duracionSeg, nivelAcceso, esPublico, publicadoEn, vistasCache }) {
  return {
    _id: ObjectId(),
    orden: 0,
    slug,
    titulo,
    resumen,
    idTematica,
    idAutor,
    idRecursoVideo,
    idContenidoArticuloCms: cms,
    duracionSeg,
    nivelAcceso,
    esPublico,
    estaPublicado: true,
    publicadoEn,
    vistasCache,
  };
}

function articulo({ slug, titulo, resumen, idAutor, idRecursoArticulo, cms, publicadoEn, numeroPag, nivelAcceso, esPublico, vistasCache }) {
  return {
    _id: ObjectId(),
    orden: 0,
    slug,
    titulo,
    resumen,
    idAutor,
    idRecursoArticulo,
    idContenidoArticuloCms: cms,
    publicadoEn,
    numeroPag,
    nivelAcceso,
    esPublico,
    vistasCache,
  };
}

const cursos = [
  {
    _id: ObjectId(),
    slug: "introduccion-react",
    titulo: "Introduccion a React",
    descripcionCorta: "Aprende React desde cero con enfoque practico.",
    idCategoria: bySlug.react._id,
    idContenidoCursoCms: "cms-curso-react-001",
    esPublico: true,
    publicadoEn: new Date("2026-01-15T10:00:00Z"),
    vistasTotalesCache: 2140,
    videos: [
      video({ slug: "base", titulo: "Base", resumen: "Conceptos previos", idTematica: tematica.frontend._id, idAutor: autor["daniel-sanchez"]._id, idRecursoVideo: "s3://videos/react/base.mp4", cms: "cms-art-react-base", duracionSeg: 580, nivelAcceso: "public", esPublico: true, publicadoEn: new Date("2026-01-16T10:00:00Z"), vistasCache: 980 }),
      video({ slug: "props-y-tipado", titulo: "Props y tipado", resumen: "Tipado de props", idTematica: tematica.frontend._id, idAutor: autor["daniel-sanchez"]._id, idRecursoVideo: "s3://videos/react/props.mp4", cms: "cms-art-react-props", duracionSeg: 760, nivelAcceso: "subscribers", esPublico: false, publicadoEn: new Date("2026-01-17T10:00:00Z"), vistasCache: 620 }),
    ],
    articulos: [
      articulo({ slug: "guia-inicio-react", titulo: "Guia de inicio", resumen: "Material de apoyo", idAutor: autor["daniel-sanchez"]._id, idRecursoArticulo: "s3://articulos/react/guia.pdf", cms: "cms-art-react-guia", publicadoEn: new Date("2026-01-16T12:00:00Z"), numeroPag: 12, nivelAcceso: "public", esPublico: true, vistasCache: 240 }),
    ],
    creadoEn: now,
    actualizadoEn: now,
  },
  {
    _id: ObjectId(),
    slug: "react-testing-avanzado",
    titulo: "React Testing Avanzado",
    descripcionCorta: "Testing en componentes React con enfoque profesional.",
    idCategoria: bySlug.react._id,
    idContenidoCursoCms: "cms-curso-react-testing-001",
    esPublico: false,
    publicadoEn: new Date("2026-02-10T09:00:00Z"),
    vistasTotalesCache: 920,
    videos: [
      video({ slug: "estrategia-testing", titulo: "Estrategia de testing", resumen: "Que testear y como", idTematica: tematica.frontend._id, idAutor: autor["daniel-sanchez"]._id, idRecursoVideo: "s3://videos/react/testing-estrategia.mp4", cms: "cms-art-react-testing-1", duracionSeg: 640, nivelAcceso: "public", esPublico: true, publicadoEn: new Date("2026-02-11T10:00:00Z"), vistasCache: 350 }),
      video({ slug: "testing-integracion", titulo: "Testing de integracion", resumen: "Casos practicos", idTematica: tematica.frontend._id, idAutor: autor["daniel-sanchez"]._id, idRecursoVideo: "s3://videos/react/testing-integracion.mp4", cms: "cms-art-react-testing-2", duracionSeg: 820, nivelAcceso: "subscribers", esPublico: false, publicadoEn: new Date("2026-02-12T10:00:00Z"), vistasCache: 190 }),
    ],
    articulos: [],
    creadoEn: now,
    actualizadoEn: now,
  },
  {
    _id: ObjectId(),
    slug: "backend-nodejs-api",
    titulo: "Backend Node.js API",
    descripcionCorta: "Disena y construye APIs REST robustas con Node.js.",
    idCategoria: bySlug.nodejs._id,
    idContenidoCursoCms: "cms-curso-node-001",
    esPublico: false,
    publicadoEn: new Date("2026-02-02T12:00:00Z"),
    vistasTotalesCache: 1250,
    videos: [
      video({ slug: "arquitectura-api", titulo: "Arquitectura de API", resumen: "Capas y contratos", idTematica: tematica.backend._id, idAutor: autor["laura-martin"]._id, idRecursoVideo: "s3://videos/node/arquitectura.mp4", cms: "cms-art-node-arch", duracionSeg: 840, nivelAcceso: "public", esPublico: true, publicadoEn: new Date("2026-02-03T12:00:00Z"), vistasCache: 760 }),
      video({ slug: "autenticacion-jwt", titulo: "Autenticacion JWT", resumen: "Login y autorizacion", idTematica: tematica.backend._id, idAutor: autor["laura-martin"]._id, idRecursoVideo: "s3://videos/node/jwt.mp4", cms: "cms-art-node-jwt", duracionSeg: 920, nivelAcceso: "purchased", esPublico: false, publicadoEn: new Date("2026-02-05T12:00:00Z"), vistasCache: 490 }),
    ],
    articulos: [
      articulo({ slug: "checklist-api", titulo: "Checklist de API", resumen: "Buenas practicas", idAutor: autor["laura-martin"]._id, idRecursoArticulo: "s3://articulos/node/checklist.pdf", cms: "cms-art-node-checklist", publicadoEn: new Date("2026-02-03T15:00:00Z"), numeroPag: 8, nivelAcceso: "subscribers", esPublico: false, vistasCache: 110 }),
    ],
    creadoEn: now,
    actualizadoEn: now,
  },
  {
    _id: ObjectId(),
    slug: "mongodb-fundamentos",
    titulo: "MongoDB Fundamentos",
    descripcionCorta: "Modelado y operaciones esenciales en MongoDB.",
    idCategoria: bySlug.backend._id,
    idContenidoCursoCms: "cms-curso-mongo-001",
    esPublico: true,
    publicadoEn: new Date("2026-03-01T09:00:00Z"),
    vistasTotalesCache: 780,
    videos: [
      video({ slug: "modelado-documental", titulo: "Modelado documental", resumen: "Embebido vs referencia", idTematica: tematica.backend._id, idAutor: autor["laura-martin"]._id, idRecursoVideo: "s3://videos/mongo/modelado.mp4", cms: "cms-art-mongo-modelado", duracionSeg: 700, nivelAcceso: "public", esPublico: true, publicadoEn: new Date("2026-03-02T10:00:00Z"), vistasCache: 280 }),
      video({ slug: "agregaciones", titulo: "Agregaciones", resumen: "Pipelines practicos", idTematica: tematica.backend._id, idAutor: autor["laura-martin"]._id, idRecursoVideo: "s3://videos/mongo/agregaciones.mp4", cms: "cms-art-mongo-agreg", duracionSeg: 880, nivelAcceso: "subscribers", esPublico: false, publicadoEn: new Date("2026-03-03T10:00:00Z"), vistasCache: 210 }),
    ],
    articulos: [],
    creadoEn: now,
    actualizadoEn: now,
  },
  {
    _id: ObjectId(),
    slug: "devops-docker-esencial",
    titulo: "DevOps Docker Esencial",
    descripcionCorta: "Contenedores, imagenes y despliegue inicial con Docker.",
    idCategoria: bySlug.docker._id,
    idContenidoCursoCms: "cms-curso-docker-001",
    esPublico: true,
    publicadoEn: new Date("2026-03-12T09:00:00Z"),
    vistasTotalesCache: 1320,
    videos: [
      video({ slug: "docker-intro", titulo: "Introduccion a Docker", resumen: "Conceptos base", idTematica: tematica.devops._id, idAutor: autor["carlos-ruiz"]._id, idRecursoVideo: "s3://videos/devops/docker-intro.mp4", cms: "cms-art-docker-intro", duracionSeg: 610, nivelAcceso: "public", esPublico: true, publicadoEn: new Date("2026-03-13T09:30:00Z"), vistasCache: 640 }),
      video({ slug: "docker-compose", titulo: "Docker Compose", resumen: "Orquestacion local", idTematica: tematica.devops._id, idAutor: autor["carlos-ruiz"]._id, idRecursoVideo: "s3://videos/devops/docker-compose.mp4", cms: "cms-art-docker-compose", duracionSeg: 730, nivelAcceso: "subscribers", esPublico: false, publicadoEn: new Date("2026-03-14T09:30:00Z"), vistasCache: 420 }),
    ],
    articulos: [],
    creadoEn: now,
    actualizadoEn: now,
  },
  {
    _id: ObjectId(),
    slug: "ia-para-devs-intro",
    titulo: "IA para Devs Intro",
    descripcionCorta: "Introduccion practica a IA aplicada a desarrollo.",
    idCategoria: bySlug.ia._id,
    idContenidoCursoCms: "cms-curso-ia-001",
    esPublico: true,
    publicadoEn: new Date("2026-03-20T08:00:00Z"),
    vistasTotalesCache: 540,
    videos: [
      video({ slug: "ia-panorama", titulo: "Panorama IA", resumen: "Casos de uso", idTematica: tematica.otros._id, idAutor: autor["carlos-ruiz"]._id, idRecursoVideo: "s3://videos/ia/panorama.mp4", cms: "cms-art-ia-panorama", duracionSeg: 520, nivelAcceso: "public", esPublico: true, publicadoEn: new Date("2026-03-21T08:30:00Z"), vistasCache: 210 }),
      video({ slug: "prompting-basico", titulo: "Prompting basico", resumen: "Buenas practicas", idTematica: tematica.otros._id, idAutor: autor["carlos-ruiz"]._id, idRecursoVideo: "s3://videos/ia/prompting.mp4", cms: "cms-art-ia-prompting", duracionSeg: 680, nivelAcceso: "purchased", esPublico: false, publicadoEn: new Date("2026-03-22T08:30:00Z"), vistasCache: 160 }),
    ],
    articulos: [],
    creadoEn: now,
    actualizadoEn: now,
  },
];

cursos.forEach((c) => {
  c.videos.forEach((v, i) => {
    v.orden = i + 1;
  });
  c.articulos.forEach((a, i) => {
    a.orden = i + 1;
  });
});

elearning.cursos.insertMany(cursos);

elearning.cursos_autores.insertMany([
  ...cursos.map((c) => {
    const autoresCurso = Array.from(new Set(c.videos.map((v) => v.idAutor.toString()).concat(c.articulos.map((a) => a.idAutor.toString()))));
    return autoresCurso.map((idAutorStr) => ({
      _id: ObjectId(),
      idCurso: c._id,
      idAutor: new ObjectId(idAutorStr),
      rol: "autor",
      creadoEn: now,
    }));
  }).flat(),
]);

const usuarios = [
  { _id: ObjectId(), email: "alumno1@example.com", nombreMostrado: "Alumno Uno", creadoEn: now },
  { _id: ObjectId(), email: "alumno2@example.com", nombreMostrado: "Alumno Dos", creadoEn: now },
  { _id: ObjectId(), email: "alumno3@example.com", nombreMostrado: "Alumno Tres", creadoEn: now },
];

elearning.usuarios.insertMany(usuarios);

elearning.suscripciones.insertMany([
  { _id: ObjectId(), idUsuario: usuarios[0]._id, plan: "monthly", iniciaEn: new Date("2026-03-01T00:00:00Z"), terminaEn: new Date("2026-03-31T23:59:59Z"), estado: "active" },
  { _id: ObjectId(), idUsuario: usuarios[2]._id, plan: "yearly", iniciaEn: new Date("2026-01-01T00:00:00Z"), terminaEn: new Date("2026-12-31T23:59:59Z"), estado: "active" },
]);

elearning.usuarios_cursos.insertMany([
  { _id: ObjectId(), idUsuario: usuarios[1]._id, idCurso: cursos[2]._id, compradoEn: new Date("2026-03-05T14:00:00Z"), importe: NumberDecimal("49.00"), moneda: "EUR" },
  { _id: ObjectId(), idUsuario: usuarios[1]._id, idCurso: cursos[4]._id, compradoEn: new Date("2026-03-10T14:00:00Z"), importe: NumberDecimal("39.00"), moneda: "EUR" },
]);

elearning.vistas_diarias_video.insertMany(
  cursos.flatMap((c) =>
    c.videos.slice(0, 2).map((v, idx) => ({
      _id: ObjectId(),
      idCurso: c._id,
      idVideo: v._id,
      dia: new Date("2026-03-08T00:00:00Z"),
      vistas: 50 + idx * 30,
    }))
  )
);

// Indices

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
