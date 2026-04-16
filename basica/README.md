# Laboratorio 1A - Modelado documental (Parte básica)

## Por qué se ha realizado este modelado
Este modelado se ha diseñado para priorizar los escenarios de lectura que el enunciado marca como más frecuentes:

- Listados de cursos (últimos cursos y cursos por área).
- Vista de detalle de curso con su temario.
- Vista de lección con información de autor.

Además, se han tenido en cuenta las restricciones funcionales del problema:

- Un curso contiene vídeos y artículos.
- Un vídeo pertenece a un curso (no se comparte entre cursos en esta versión).
- Los recursos pesados (vídeo y contenido de artículo) viven fuera de MongoDB (S3/CMS), por lo que en base de datos solo se guardan identificadores.
- Los vídeos deben poder clasificarse por temáticas.

Con este enfoque se minimizan consultas complejas para la navegación principal y se mantiene un modelo fácil de evolucionar.

## Patrones aplicados y razonamiento

### 1) Agregado principal (`CURSOS`) con embebido
Patrón aplicado: **agregado documental con embebido**.

Razón:
- El usuario consume curso + temario como una unidad funcional.
- El volumen por curso es acotado, por lo que `videos[]` y `articulos[]` embebidos son viables.
- Se reduce la necesidad de joins en lecturas frecuentes.

### 2) Referencias a entidades compartidas
Patrón aplicado: **referencias por id** a colecciones de catálogo y entidades reutilizables.

Razón:
- `AUTORES`, `CATEGORIAS` y `TEMATICAS` tienen ciclo de vida propio y se reutilizan en múltiples cursos.
- Evita duplicación excesiva de datos de autor o catálogos.
- Facilita mantenimiento y consistencia de información compartida.

### 3) Relación muchos a muchos con colección intermedia
Patrón aplicado: **colección puente** (`CURSOS_AUTORES`).

Razón:
- Permite modelar la relación curso-autor sin una relación M:M directa en herramienta.
- Facilita representar roles y metadatos de participación.
- Hace explícita la vinculación en consultas y diagrama.

### 4) Referencias a recursos externos (S3/CMS)
Patrón aplicado: **referencia a recursos externos** (guardar ids, no contenido).

Razón:
- MongoDB no almacena binarios pesados ni contenido editorial completo en este caso.
- Se cumple literalmente el enunciado (guardar solo identificadores a recursos externos).
- Mejora coste y rendimiento al desacoplar almacenamiento de contenido.

### 5) Optimización de lectura mediante índices
Patrón aplicado: **índices orientados a patrones de consulta**.

Razón:
- Se han propuesto índices alineados con consultas reales (orden por publicación, filtro por categoría, filtro por temática y búsquedas por slug).
- Reduce latencia en las rutas más usadas de la aplicación.

## Conclusión
El modelo prioriza rendimiento de lectura, simplicidad operativa y alineación con el enunciado.
La decisión central es tratar el curso como agregado documental y combinar embebido (temario) con referencias (catálogos, autores y recursos externos).
