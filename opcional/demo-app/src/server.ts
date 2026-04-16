import express from "express";
import { MongoClient, ObjectId } from "mongodb";

const app = express();
const port = Number(process.env.PORT ?? 3000);
const mongoUrl = process.env.MONGO_URL ?? "mongodb://appuser:apppass@mongo:27017/elearning?authSource=admin";
const dbName = process.env.MONGO_DB_NAME ?? "elearning";

const client = new MongoClient(mongoUrl);

app.use(express.static("public"));

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
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $project: {
          categoria: "$category.nombre",
          courseSlug: "$slug",
          courseTitle: "$titulo",
          videoSlug: "$videos.slug",
          videoTitle: "$videos.titulo",
          publicadoEn: "$videos.publicadoEn",
        },
      },
      { $sort: { categoria: 1, publicadoEn: -1 } },
      {
        $group: {
          _id: "$categoria",
          videos: {
            $push: {
              courseSlug: "$courseSlug",
              courseTitle: "$courseTitle",
              videoSlug: "$videoSlug",
              videoTitle: "$videoTitle",
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

app.get("/api/courses", async (req, res) => {
  const db = client.db(dbName);
  const cursos = db.collection("cursos");
  const arbolCategorias = db.collection("arbol_categorias");

  const categorySlug = typeof req.query.category === "string" ? req.query.category : undefined;

  let categoryFilter = {};
  if (categorySlug) {
    const category = await arbolCategorias.findOne({ slug: categorySlug });
    if (!category) {
      res.json([]);
      return;
    }
    categoryFilter = { idCategoria: category._id };
  }

  const items = await cursos
    .aggregate([
      { $match: categoryFilter },
      { $sort: { publicadoEn: -1 } },
      {
        $lookup: {
          from: "arbol_categorias",
          localField: "idCategoria",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $project: {
          _id: 0,
          slug: 1,
          titulo: 1,
          descripcionCorta: 1,
          publicadoEn: 1,
          categoria: "$category.nombre",
        },
      },
    ])
    .toArray();

  res.json(items);
});

app.get("/api/courses/:slug", async (req, res) => {
  const db = client.db(dbName);
  const cursos = db.collection("cursos");
  const autores = db.collection("autores");

  const course = await cursos.findOne({ slug: req.params.slug });
  if (!course) {
    res.status(404).json({ message: "Curso no encontrado" });
    return;
  }

  const authorIds = Array.from(
    new Set(
      [
        ...((course.videos ?? []).map((v: any) => (v.idAutor ? v.idAutor.toString() : ""))),
        ...((course.articulos ?? []).map((a: any) => (a.idAutor ? a.idAutor.toString() : ""))),
      ].filter(Boolean)
    )
  ).map((id) => new ObjectId(id));

  const authorList = await autores
    .find({ _id: { $in: authorIds } }, { projection: { nombreMostrado: 1, bioCorta: 1 } })
    .toArray();
  const authorMap = new Map(authorList.map((a) => [a._id.toString(), a]));

  const mappedVideos = (course.videos ?? []).map((video: any) => ({
    ...video,
    autor: authorMap.get(video.idAutor?.toString() ?? "")?.nombreMostrado ?? "Desconocido",
  }));

  res.json({
    slug: course.slug,
    titulo: course.titulo,
    descripcionCorta: course.descripcionCorta,
    publicadoEn: course.publicadoEn,
    videos: mappedVideos,
    articulos: course.articulos ?? [],
  });
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
