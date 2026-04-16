# Despliegue y prueba (parte opcional)

Este documento explica como levantar, probar y parar la demo de la parte opcional.

## Requisitos

- Docker
- Docker Compose (plugin `docker compose`)

## Levantar el proyecto

Desde la carpeta `opcional`:

```bash
docker compose up -d --build
```

Esto levanta:

- `mongo`: base de datos MongoDB
- `demo`: aplicacion web Node.js + TypeScript

## Probar que todo esta levantado

```bash
docker compose ps
```

Deberias ver los dos servicios en estado `Up`.

## URLs de prueba

- Interfaz web: [http://localhost:3000](http://localhost:3000)
- Healthcheck: [http://localhost:3000/health](http://localhost:3000/health)

## Que puedes validar en la interfaz

- Home con ultimos 5 videos por categoria.
- Listado de cursos por area.
- Detalle de curso con videos/articulos y autor en video.

## Parar el proyecto

```bash
docker compose down
```

## Reinicializar datos de ejemplo (seed)

El script de inicializacion de Mongo solo se ejecuta al crear el volumen por primera vez.
Si quieres reconstruir desde cero (por ejemplo, tras cambios en `mongo-init/01-init.js`):

```bash
docker compose down -v
docker compose up -d --build
```

