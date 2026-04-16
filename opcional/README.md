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

### 2) Control de acceso por elemento de contenido
Patrón aplicado: **metadatos de acceso en documentos embebidos**.

Razón:
- `videos[]` y `articulos[]` incorporan metadatos de acceso (`nivelAcceso`, `esPublico`).
- Permite cursos mixtos (parte pública y parte privada).
- Evita separar todo el temario en otra colección solo para resolver permisos.

### 3) Monetización con modelos complementarios
Patrón aplicado: **separación de responsabilidades de negocio** (`SUSCRIPCIONES` y `COMPRAS_DE_CURSO`).

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

## Conclusión
La parte opcional mantiene la estrategia documental del modelo base y añade capacidades de producto (jerarquía, permisos, monetización y analítica) sin sacrificar legibilidad ni rendimiento de lectura.
Es una evolución incremental y defendible técnicamente para un portal e-learning real.
