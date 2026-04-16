import express from "express";
import { MongoClient, ObjectId } from "mongodb";

const app = express();
const port = Number(process.env.PORT ?? 3000);
const mongoUrl =
  process.env.MONGO_URL ??
  "mongodb://appuser:apppass@mongo:27017/elearning?authSource=admin";
const dbName = process.env.MONGO_DB_NAME ?? "elearning";

const client = new MongoClient(mongoUrl);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const ensureUniqueSlug = async (collection: any, baseSlug: string) => {
  let slug = baseSlug;
  let suffix = 1;
  while (await collection.findOne({ slug })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
  return slug;
};

app.use(express.static("public"));
app.use(express.json());

app.get("/api/home", async (_req, res) => {
  const db = client.db(dbName);
  const cursos = db.collection("cursos");

  const items = await cursos
    .aggregate([
      { $unwind: "$videos" },
      { $match: { "videos.estaPublicado": true } },
      {
        $lookup: {
          from: "arbol_categorias",
          localField: "idCategoria",
          foreignField: "_id",
          as: "categoriaCurso",
        },
      },
      { $unwind: "$categoriaCurso" },
      {
        $addFields: {
          slugCategoriaPrincipal: {
            $ifNull: [
              { $arrayElemAt: ["$categoriaCurso.slugsAncestros", 0] },
              "$categoriaCurso.slug",
            ],
          },
        },
      },
      {
        $lookup: {
          from: "arbol_categorias",
          localField: "slugCategoriaPrincipal",
          foreignField: "slug",
          as: "categoriaPrincipal",
        },
      },
      {
        $addFields: {
          categoriaPrincipal: { $arrayElemAt: ["$categoriaPrincipal", 0] },
        },
      },
      {
        $project: {
          categoria: "$categoriaPrincipal.nombre",
          cursoSlug: "$slug",
          cursoTitulo: "$titulo",
          videoSlug: "$videos.slug",
          videoTitulo: "$videos.titulo",
          publicadoEn: "$videos.publicadoEn",
        },
      },
      { $sort: { categoria: 1, publicadoEn: -1 } },
      {
        $group: {
          _id: "$categoria",
          videos: {
            $push: {
              cursoSlug: "$cursoSlug",
              cursoTitulo: "$cursoTitulo",
              videoSlug: "$videoSlug",
              videoTitulo: "$videoTitulo",
              publicadoEn: "$publicadoEn",
            },
          },
        },
      },
      { $project: { _id: 0, categoria: "$_id", videos: { $slice: ["$videos", 5] } } },
      { $sort: { categoria: 1 } },
    ])
    .toArray();

  res.json(items);
});

app.get("/api/cursos", async (req, res) => {
  const db = client.db(dbName);
  const cursos = db.collection("cursos");
  const arbolCategorias = db.collection("arbol_categorias");

  const categoria = typeof req.query.categoria === "string" ? req.query.categoria : undefined;

  let filtro: Record<string, unknown> = {};
  if (categoria) {
    const cat = await arbolCategorias.findOne({ slug: categoria });
    if (!cat) {
      res.json([]);
      return;
    }
    const categoriasRelacionadas = await arbolCategorias
      .find({
        $or: [{ _id: cat._id }, { slugsAncestros: cat.slug }],
      })
      .project({ _id: 1 })
      .toArray();
    filtro = { idCategoria: { $in: categoriasRelacionadas.map((c) => c._id) } };
  }

  const items = await cursos
    .aggregate([
      { $match: filtro },
      { $sort: { publicadoEn: -1 } },
      {
        $lookup: {
          from: "arbol_categorias",
          localField: "idCategoria",
          foreignField: "_id",
          as: "categoria",
        },
      },
      { $unwind: "$categoria" },
      {
        $project: {
          _id: 0,
          slug: 1,
          titulo: 1,
          descripcionCorta: 1,
          publicadoEn: 1,
          esPublico: 1,
          categoria: "$categoria.nombre",
        },
      },
    ])
    .toArray();

  res.json(items);
});

app.get("/api/cursos/:slug", async (req, res) => {
  const db = client.db(dbName);
  const cursos = db.collection("cursos");
  const autores = db.collection("autores");

  const curso = await cursos.findOne({ slug: req.params.slug });
  if (!curso) {
    res.status(404).json({ message: "Curso no encontrado" });
    return;
  }

  const idsAutores = Array.from(
    new Set(
      [
        ...((curso.videos ?? []).map((v: any) => (v.idAutor ? v.idAutor.toString() : ""))),
        ...((curso.articulos ?? []).map((a: any) => (a.idAutor ? a.idAutor.toString() : ""))),
      ].filter(Boolean)
    )
  ).map((id) => new ObjectId(id));

  const listaAutores = await autores
    .find({ _id: { $in: idsAutores } }, { projection: { slug: 1, nombreMostrado: 1 } })
    .toArray();
  const mapaAutores = new Map(listaAutores.map((a) => [a._id.toString(), a]));

  const videos = (curso.videos ?? []).map((video: any) => ({
    ...video,
    autorNombre: mapaAutores.get(video.idAutor?.toString() ?? "")?.nombreMostrado ?? "Desconocido",
    autorSlug: mapaAutores.get(video.idAutor?.toString() ?? "")?.slug ?? null,
  }));

  const articulos = (curso.articulos ?? []).map((art: any) => ({
    ...art,
    autorNombre: mapaAutores.get(art.idAutor?.toString() ?? "")?.nombreMostrado ?? "Desconocido",
    autorSlug: mapaAutores.get(art.idAutor?.toString() ?? "")?.slug ?? null,
  }));

  res.json({
    slug: curso.slug,
    titulo: curso.titulo,
    descripcionCorta: curso.descripcionCorta,
    publicadoEn: curso.publicadoEn,
    esPublico: curso.esPublico,
    vistasTotalesCache: curso.vistasTotalesCache ?? 0,
    videos,
    articulos,
  });
});

app.get("/api/cursos/:slug/videos/:videoSlug", async (req, res) => {
  const db = client.db(dbName);
  const cursos = db.collection("cursos");
  const autores = db.collection("autores");

  const curso = await cursos.findOne({ slug: req.params.slug, "videos.slug": req.params.videoSlug });
  if (!curso) {
    res.status(404).json({ message: "Video no encontrado" });
    return;
  }

  const video = (curso.videos ?? []).find((v: any) => v.slug === req.params.videoSlug);
  if (!video) {
    res.status(404).json({ message: "Video no encontrado" });
    return;
  }

  const autor = video.idAutor
    ? await autores.findOne({ _id: video.idAutor }, { projection: { slug: 1, nombreMostrado: 1, bioCorta: 1 } })
    : null;

  res.json({
    curso: { slug: curso.slug, titulo: curso.titulo },
    video,
    autor,
  });
});

app.get("/api/autores", async (_req, res) => {
  const db = client.db(dbName);
  const autores = db.collection("autores");

  const items = await autores
    .find({}, { projection: { _id: 0, slug: 1, nombreMostrado: 1, bioCorta: 1 } })
    .sort({ nombreMostrado: 1 })
    .toArray();

  res.json(items);
});

app.get("/api/categorias", async (_req, res) => {
  const db = client.db(dbName);
  const categorias = db.collection("arbol_categorias");
  const items = await categorias
    .find({}, { projection: { _id: 0, slug: 1, nombre: 1, profundidad: 1 } })
    .sort({ profundidad: 1, nombre: 1 })
    .toArray();
  res.json(items);
});

app.get("/api/autores/:slug", async (req, res) => {
  const db = client.db(dbName);
  const autores = db.collection("autores");
  const cursos = db.collection("cursos");

  const autor = await autores.findOne({ slug: req.params.slug });
  if (!autor) {
    res.status(404).json({ message: "Autor no encontrado" });
    return;
  }

  const cursosParticipa = await cursos
    .find({
      $or: [
        { "videos.idAutor": autor._id },
        { "articulos.idAutor": autor._id },
      ],
    }, { projection: { _id: 0, slug: 1, titulo: 1, descripcionCorta: 1 } })
    .toArray();

  res.json({
    slug: autor.slug,
    nombreMostrado: autor.nombreMostrado,
    bioCorta: autor.bioCorta,
    enlacesSociales: autor.enlacesSociales ?? [],
    cursos: cursosParticipa,
  });
});

app.post("/api/autores", async (req, res) => {
  const db = client.db(dbName);
  const autores = db.collection("autores");
  const { nombreMostrado, bioCorta } = req.body ?? {};

  if (typeof nombreMostrado !== "string" || !nombreMostrado.trim()) {
    res.status(400).json({ message: "nombreMostrado es obligatorio" });
    return;
  }

  const baseSlug = slugify(nombreMostrado);
  const slug = await ensureUniqueSlug(autores, baseSlug);
  const now = new Date();

  await autores.insertOne({
    _id: new ObjectId(),
    slug,
    nombreMostrado: nombreMostrado.trim(),
    bioCorta: typeof bioCorta === "string" ? bioCorta.trim() : "",
    enlacesSociales: [],
    creadoEn: now,
    actualizadoEn: now,
  });

  res.status(201).json({ slug, message: "Autor creado" });
});

app.put("/api/autores/:slug", async (req, res) => {
  const db = client.db(dbName);
  const autores = db.collection("autores");
  const { nombreMostrado, bioCorta } = req.body ?? {};

  const autor = await autores.findOne({ slug: req.params.slug });
  if (!autor) {
    res.status(404).json({ message: "Autor no encontrado" });
    return;
  }

  const updateFields: Record<string, unknown> = { actualizadoEn: new Date() };
  if (typeof nombreMostrado === "string" && nombreMostrado.trim()) {
    updateFields.nombreMostrado = nombreMostrado.trim();
  }
  if (typeof bioCorta === "string") {
    updateFields.bioCorta = bioCorta.trim();
  }

  await autores.updateOne({ slug: req.params.slug }, { $set: updateFields });
  res.json({ message: "Autor actualizado" });
});

app.delete("/api/autores/:slug", async (req, res) => {
  const db = client.db(dbName);
  const autores = db.collection("autores");
  const cursos = db.collection("cursos");

  const autor = await autores.findOne({ slug: req.params.slug });
  if (!autor) {
    res.status(404).json({ message: "Autor no encontrado" });
    return;
  }

  const uso = await cursos.findOne({
    $or: [{ "videos.idAutor": autor._id }, { "articulos.idAutor": autor._id }],
  });
  if (uso) {
    res.status(409).json({ message: "No se puede borrar: autor referenciado en cursos" });
    return;
  }

  await autores.deleteOne({ _id: autor._id });
  res.json({ message: "Autor eliminado" });
});

app.post("/api/cursos", async (req, res) => {
  const db = client.db(dbName);
  const cursos = db.collection("cursos");
  const categorias = db.collection("arbol_categorias");
  const autores = db.collection("autores");
  const { titulo, descripcionCorta, categoriaSlug, autorSlug, esPublico } = req.body ?? {};

  if (
    typeof titulo !== "string" ||
    !titulo.trim() ||
    typeof descripcionCorta !== "string" ||
    !descripcionCorta.trim() ||
    typeof categoriaSlug !== "string" ||
    !categoriaSlug.trim() ||
    typeof autorSlug !== "string" ||
    !autorSlug.trim()
  ) {
    res.status(400).json({ message: "Faltan campos obligatorios del curso" });
    return;
  }

  const categoria = await categorias.findOne({ slug: categoriaSlug });
  if (!categoria) {
    res.status(400).json({ message: "categoriaSlug no valida" });
    return;
  }

  const autor = await autores.findOne({ slug: autorSlug });
  if (!autor) {
    res.status(400).json({ message: "autorSlug no valido" });
    return;
  }

  const baseSlug = slugify(titulo);
  const slug = await ensureUniqueSlug(cursos, baseSlug);
  const now = new Date();

  const videoInicial = {
    _id: new ObjectId(),
    orden: 1,
    slug: "introduccion",
    titulo: "Introduccion",
    resumen: "Video inicial autogenerado desde la demo",
    idTematica: null,
    idAutor: autor._id,
    idRecursoVideo: "s3://videos/demo/introduccion.mp4",
    idContenidoArticuloCms: `cms-auto-${slug}-intro`,
    duracionSeg: 300,
    nivelAcceso: "public",
    esPublico: true,
    estaPublicado: true,
    publicadoEn: now,
    vistasCache: 0,
  };

  await cursos.insertOne({
    _id: new ObjectId(),
    slug,
    titulo: titulo.trim(),
    descripcionCorta: descripcionCorta.trim(),
    idCategoria: categoria._id,
    idContenidoCursoCms: `cms-auto-${slug}`,
    esPublico: Boolean(esPublico),
    publicadoEn: now,
    vistasTotalesCache: 0,
    videos: [videoInicial],
    articulos: [],
    creadoEn: now,
    actualizadoEn: now,
  });

  res.status(201).json({ slug, message: "Curso creado" });
});

app.put("/api/cursos/:slug", async (req, res) => {
  const db = client.db(dbName);
  const cursos = db.collection("cursos");
  const categorias = db.collection("arbol_categorias");

  const curso = await cursos.findOne({ slug: req.params.slug });
  if (!curso) {
    res.status(404).json({ message: "Curso no encontrado" });
    return;
  }

  const { titulo, descripcionCorta, categoriaSlug, esPublico } = req.body ?? {};
  const updateFields: Record<string, unknown> = { actualizadoEn: new Date() };

  if (typeof titulo === "string" && titulo.trim()) {
    updateFields.titulo = titulo.trim();
  }
  if (typeof descripcionCorta === "string" && descripcionCorta.trim()) {
    updateFields.descripcionCorta = descripcionCorta.trim();
  }
  if (typeof esPublico === "boolean") {
    updateFields.esPublico = esPublico;
  }
  if (typeof categoriaSlug === "string" && categoriaSlug.trim()) {
    const categoria = await categorias.findOne({ slug: categoriaSlug.trim() });
    if (!categoria) {
      res.status(400).json({ message: "categoriaSlug no valida" });
      return;
    }
    updateFields.idCategoria = categoria._id;
  }

  await cursos.updateOne({ slug: req.params.slug }, { $set: updateFields });
  res.json({ message: "Curso actualizado" });
});

app.delete("/api/cursos/:slug", async (req, res) => {
  const db = client.db(dbName);
  const cursos = db.collection("cursos");
  const cursosAutores = db.collection("cursos_autores");
  const usuariosCursos = db.collection("usuarios_cursos");
  const vistasDiarias = db.collection("vistas_diarias_video");

  const curso = await cursos.findOne({ slug: req.params.slug });
  if (!curso) {
    res.status(404).json({ message: "Curso no encontrado" });
    return;
  }

  await cursos.deleteOne({ _id: curso._id });
  await cursosAutores.deleteMany({ idCurso: curso._id });
  await usuariosCursos.deleteMany({ idCurso: curso._id });
  await vistasDiarias.deleteMany({ idCurso: curso._id });

  res.json({ message: "Curso eliminado" });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

const start = async () => {
  await client.connect();
  app.listen(port, () => {
    console.log(`Demo opcional escuchando en http://localhost:${port}`);
  });
};

start().catch((error) => {
  console.error("Error iniciando demo:", error);
  process.exit(1);
});
