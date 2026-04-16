# Laboratorio 1A - Modelado documental (Parte opcional)

## Por qué se ha realizado este modelado
La ampliación opcional extiende el modelo básico para cubrir escenarios de negocio más avanzados sin perder el foco en lectura:

- Jerarquía de áreas.
- Contenido público/privado.
- Usuarios con suscripción y compra puntual de cursos.
- Métricas de visualización no estrictamente en tiempo real.

El objetivo es mantener una base coherente con la parte básica y añadir capacidades reales de monetización, control de acceso y analítica.

## Patrones aplicados y razonamiento

### 1) Jerarquía de categorías
Patrón aplicado: **patrón de árbol** con autorreferencia.

Razón:
- Permite representar árboles como `Front End > React > Testing`.
- Escala mejor que una lista plana cuando crecen subáreas.
- Facilita navegación por ramas y expansión futura del catálogo.

#### ¿Qué significa la autorrelación?
En `ARBOL_CATEGORIAS` existe el campo `idCategoriaPadre`, que apunta al `_id` de **otro documento de la misma colección**.

Esto permite representar un árbol:
- Las categorías **raíz** tienen `idCategoriaPadre = null`.
- Las **subcategorías** apuntan a su padre.

La relación que aparece en el diagrama:
`ARBOL_CATEGORIAS._id -> ARBOL_CATEGORIAS.idCategoriaPadre (1:M)`
significa: **una** categoría puede tener **muchas** subcategorías.

Ejemplo (simplificado):

```js
// Raíz
{ _id: ObjectId("A"), slug: "frontend", nombre: "Front End", idCategoriaPadre: null }

// Hijas de "frontend"
{ _id: ObjectId("B"), slug: "react", nombre: "React", idCategoriaPadre: ObjectId("A") }
{ _id: ObjectId("C"), slug: "angular", nombre: "Angular", idCategoriaPadre: ObjectId("A") }

// Nieta de "react"
{ _id: ObjectId("D"), slug: "testing", nombre: "Testing", idCategoriaPadre: ObjectId("B") }
```

Con esa estructura puedes navegar:
- hacia arriba (padre) usando `idCategoriaPadre`
- hacia abajo (hijos) buscando por `idCategoriaPadre = <_id del padre>`

### 2) Control de acceso por elemento de contenido
Patrón aplicado: **metadatos de acceso en documentos embebidos**.

Razón:
- `videos[]` y `articulos[]` incorporan metadatos de acceso (`nivelAcceso`, `esPublico`).
- Permite cursos mixtos (parte pública y parte privada).
- Evita separar todo el temario en otra colección solo para resolver permisos.

### 3) Monetización con modelos complementarios
Patrón aplicado: **separación de responsabilidades de negocio** (`SUSCRIPCIONES` y `USUARIOS_CURSOS`).

Razón:
- Se cubren dos vías de acceso: suscripción global y compra puntual.
- Mantiene trazabilidad histórica de derechos de acceso.
- Facilita reglas de negocio claras sobre qué contenido puede ver cada usuario.

### 4) Analítica agregada no real-time
Patrón aplicado: **preagregación con contadores en caché**.

Razón:
- `vistasVideosDiarias` modela histórico agregable por día.
- Contadores caché en curso/vídeo/artículo reducen coste de consulta en front.
- Cumple el requisito de no exigir cálculo en tiempo real exacto.

### 5) Colección intermedia para curso-autor
Patrón aplicado: **colección puente** (`CURSOS_AUTORES`).

Razón:
- Representa la relación de participación sin M:M directa.
- Permite metadatos de participación (`rol`, fechas).
- Es fácil de mapear en herramientas de modelado y en consultas.

### 6) Reutilización del criterio documental de la parte básica
Patrón aplicado: **agregado `CURSOS` como centro del dominio de lectura**.

Razón:
- Conserva el buen rendimiento en la página de curso.
- Mantiene continuidad con la solución base y reduce complejidad innecesaria.
- Separa correctamente contenido embebido de catálogos y transacciones.

## Demo ejecutable con TypeScript (Mongo + UI)

Además del modelado, esta carpeta incluye una demo mínima para visualizar datos reales seed:

- Servicio `mongo`: base de datos con inicialización automática.
- Servicio `demo`: app Node.js + TypeScript + Express con interfaz web.

### Arranque
```bash
docker compose up -d --build
```

> Importante: el script de inicialización (`mongo-init/01-init.js`) solo se ejecuta la primera vez que se crea el volumen de Mongo.
> Si cambias el seed o el modelo y quieres reinicializar los datos, ejecuta:

```bash
docker compose down -v
docker compose up -d --build
```

### URLs
- Interfaz web: [http://localhost:3000](http://localhost:3000)
- Healthcheck demo: [http://localhost:3000/health](http://localhost:3000/health)

### Qué muestra la interfaz
- Últimos 5 vídeos publicados por categoría (home).
- Cursos por área.
- Detalle de curso con vídeos/artículos y autor en vídeo.

### Parada
```bash
docker compose down
```

## Conclusión
La parte opcional mantiene la estrategia documental del modelo base y añade capacidades de producto (jerarquía, permisos, monetización y analítica) sin sacrificar legibilidad ni rendimiento de lectura.
La demo en TypeScript permite evidenciar de forma práctica el modelo y las consultas principales del enunciado.
