// Inicializacion de datos de ejemplo para el laboratorio 1A (opcional).
// Se ejecuta automaticamente en el primer arranque del contenedor.

const adminDb = db.getSiblingDB("admin");
adminDb.createUser({
  user: "appuser",
  pwd: "apppass",
  roles: [{ role: "readWrite", db: "elearning" }],
});

const elearning = db.getSiblingDB("elearning");

const now = new Date();

const categories = [
  {
    _id: ObjectId(),
    slug: "frontend",
    name: "Front End",
    parentId: null,
    ancestorSlugs: [],
    depth: 0,
  },
  {
    _id: ObjectId(),
    slug: "react",
    name: "React",
    parentId: null, // actualizamos tras conocer el id de frontend
    ancestorSlugs: ["frontend"],
    depth: 1,
  },
  {
    _id: ObjectId(),
    slug: "backend",
    name: "Backend",
    parentId: null,
    ancestorSlugs: [],
    depth: 0,
  },
  {
    _id: ObjectId(),
    slug: "nodejs",
    name: "Node.js",
    parentId: null, // actualizamos tras conocer el id de backend
    ancestorSlugs: ["backend"],
    depth: 1,
  },
  {
    _id: ObjectId(),
    slug: "devops",
    name: "DevOps",
    parentId: null,
    ancestorSlugs: [],
    depth: 0,
  },
];

categories[1].parentId = categories[0]._id;
categories[3].parentId = categories[2]._id;

elearning.categories.insertMany(categories);

const authors = [
  {
    _id: ObjectId(),
    slug: "daniel-sanchez",
    displayName: "Daniel Sanchez",
    shortBio:
      "Desarrollador especializado en Front End y Backend. Docente en contenidos de React y Node.js.",
    avatarUrl: "https://cdn.example.com/authors/daniel.png",
    socialLinks: ["https://github.com/danielsanchez", "https://x.com/daniel"],
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: ObjectId(),
    slug: "laura-martin",
    displayName: "Laura Martin",
    shortBio: "Ingeniera de software y autora de cursos de arquitectura backend.",
    avatarUrl: "https://cdn.example.com/authors/laura.png",
    socialLinks: ["https://github.com/lauramartin"],
    createdAt: now,
    updatedAt: now,
  },
];

elearning.authors.insertMany(authors);

const courses = [
  {
    _id: ObjectId(),
    slug: "introduccion-react",
    title: "Introduccion a React",
    shortDescription:
      "Aprende React desde cero con enfoque practico y base en TypeScript.",
    level: "beginner",
    categoryId: categories[1]._id,
    authorIds: [authors[0]._id],
    courseContentCmsId: "cms-course-react-001",
    isPublic: true,
    publishedAt: new Date("2026-01-15T10:00:00Z"),
    totalViewsCached: 2140,
    videos: [
      {
        _id: ObjectId(),
        order: 1,
        slug: "base",
        title: "Base",
        summary: "Conceptos previos para arrancar con React.",
        authorId: authors[0]._id,
        videoAssetId: "s3://videos/react/base.mp4",
        articleContentCmsId: "cms-article-react-base",
        durationSec: 580,
        accessLevel: "public",
        isPublic: true,
        isPublished: true,
        publishedAt: new Date("2026-01-16T10:00:00Z"),
        viewsCached: 980,
      },
      {
        _id: ObjectId(),
        order: 2,
        slug: "props-y-tipado",
        title: "React + TypeScript: Props",
        summary: "Tipado de props y patrones de componentes.",
        authorId: authors[0]._id,
        videoAssetId: "s3://videos/react/props.mp4",
        articleContentCmsId: "cms-article-react-props",
        durationSec: 760,
        accessLevel: "subscribers",
        isPublic: false,
        isPublished: true,
        publishedAt: new Date("2026-01-17T10:00:00Z"),
        viewsCached: 620,
      },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: ObjectId(),
    slug: "backend-nodejs-api",
    title: "Backend Node.js API",
    shortDescription:
      "Disena y construye APIs REST robustas con Node.js y buenas practicas.",
    level: "intermediate",
    categoryId: categories[3]._id,
    authorIds: [authors[1]._id],
    courseContentCmsId: "cms-course-node-001",
    isPublic: false,
    publishedAt: new Date("2026-02-02T12:00:00Z"),
    totalViewsCached: 1250,
    videos: [
      {
        _id: ObjectId(),
        order: 1,
        slug: "arquitectura-api",
        title: "Arquitectura de API",
        summary: "Capas, contratos y estructura de proyecto.",
        authorId: authors[1]._id,
        videoAssetId: "s3://videos/node/api-architecture.mp4",
        articleContentCmsId: "cms-article-node-arch",
        durationSec: 840,
        accessLevel: "public",
        isPublic: true,
        isPublished: true,
        publishedAt: new Date("2026-02-03T12:00:00Z"),
        viewsCached: 760,
      },
      {
        _id: ObjectId(),
        order: 2,
        slug: "autenticacion-jwt",
        title: "Autenticacion JWT",
        summary: "Implementacion de login y autorizacion basada en JWT.",
        authorId: authors[1]._id,
        videoAssetId: "s3://videos/node/jwt.mp4",
        articleContentCmsId: "cms-article-node-jwt",
        durationSec: 920,
        accessLevel: "purchased",
        isPublic: false,
        isPublished: true,
        publishedAt: new Date("2026-02-05T12:00:00Z"),
        viewsCached: 490,
      },
    ],
    createdAt: now,
    updatedAt: now,
  },
];

elearning.courses.insertMany(courses);

const users = [
  {
    _id: ObjectId(),
    email: "alumno1@example.com",
    displayName: "Alumno Uno",
    createdAt: now,
  },
  {
    _id: ObjectId(),
    email: "alumno2@example.com",
    displayName: "Alumno Dos",
    createdAt: now,
  },
];

elearning.users.insertMany(users);

elearning.subscriptions.insertMany([
  {
    _id: ObjectId(),
    userId: users[0]._id,
    plan: "monthly",
    startsAt: new Date("2026-03-01T00:00:00Z"),
    endsAt: new Date("2026-03-31T23:59:59Z"),
    status: "active",
  },
]);

elearning.coursePurchases.insertMany([
  {
    _id: ObjectId(),
    userId: users[1]._id,
    courseId: courses[1]._id,
    purchasedAt: new Date("2026-03-05T14:00:00Z"),
    amount: 49,
    currency: "EUR",
  },
]);

elearning.videoViewsDaily.insertMany([
  {
    _id: ObjectId(),
    courseId: courses[0]._id,
    videoId: courses[0].videos[0]._id,
    day: new Date("2026-03-08T00:00:00Z"),
    views: 120,
  },
  {
    _id: ObjectId(),
    courseId: courses[1]._id,
    videoId: courses[1].videos[1]._id,
    day: new Date("2026-03-08T00:00:00Z"),
    views: 75,
  },
]);

// Indices de la parte obligatoria + opcional
elearning.categories.createIndex({ slug: 1 }, { unique: true });
elearning.categories.createIndex({ parentId: 1, slug: 1 });
elearning.categories.createIndex({ ancestorSlugs: 1 });

elearning.authors.createIndex({ slug: 1 }, { unique: true });

elearning.courses.createIndex({ slug: 1 }, { unique: true });
elearning.courses.createIndex({ publishedAt: -1 });
elearning.courses.createIndex({ categoryId: 1, publishedAt: -1 });
elearning.courses.createIndex({ isPublic: 1, publishedAt: -1 });
elearning.courses.createIndex({ "videos.slug": 1 });
elearning.courses.createIndex({ "videos.accessLevel": 1 });

elearning.users.createIndex({ email: 1 }, { unique: true });

elearning.subscriptions.createIndex({ userId: 1, status: 1, endsAt: -1 });
elearning.coursePurchases.createIndex({ userId: 1, courseId: 1 }, { unique: true });
elearning.coursePurchases.createIndex({ courseId: 1, purchasedAt: -1 });

elearning.videoViewsDaily.createIndex(
  { courseId: 1, videoId: 1, day: 1 },
  { unique: true }
);
elearning.videoViewsDaily.createIndex({ day: -1 });

print("Inicializacion completada para base de datos elearning");
