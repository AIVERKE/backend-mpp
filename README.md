# 🚀 Backend MPP - NestJS

Este es el backend del sistema MPP, construido con [NestJS](https://github.com/nestjs/nest), [TypeORM](https://typeorm.io/) y [PostgreSQL](https://www.postgresql.org/).

## 📋 Requisitos Previos

- [Node.js](https://nodejs.org/) (v18 o superior recomendado)
- [PostgreSQL](https://www.postgresql.org/) corriendo localmente o en la nube
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)

## 🛠️ Guía de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd backend-mpp
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Copia el archivo `.env.example` a uno nuevo llamado `.env` y completa los datos de tu base de datos y JWT.
   ```bash
   cp .env.example .env
   ```

4. **Crear la base de datos**
   Asegúrate de crear una base de datos en PostgreSQL con el nombre que definiste en el archivo `.env` (por defecto `mpp_db`).

## 💾 Base de Datos y Migraciones

Este proyecto utiliza migraciones para mantener sincronizada la estructura de la base de datos.

- **Generar una migración**: Compara las entidades actuales con la DB y genera el SQL necesario en `src/migrations/`.
  ```bash
  npm run migration:generate -- src/migrations/NombreDeTuMigracion
  ```
- **Ejecutar migraciones**: Aplica todas las migraciones pendientes a la base de datos.
  ```bash
  npm run migration:run
  ```
- **Revertir migración**: Deshace la última migración ejecutada.
  ```bash
  npm run migration:revert
  ```
- **CLI de TypeORM**: Acceso directo a la interfaz de comandos de TypeORM.
  ```bash
  npm run typeorm -- [comando]
  ```

## 🚀 Ejecución del Proyecto

```bash
# Modo desarrollo con watch (recomendado)
$ npm run start:dev

# Modo producción
$ npm run start:prod

# Modo debug
$ npm run start:debug
```

## 📖 Documentación de la API (Swagger)

Una vez que el servidor esté corriendo, puedes acceder a la documentación interactiva de la API en:

🔗 **[http://localhost:3000/api](http://localhost:3000/api)**

Desde aquí podrás probar todos los endpoints disponibles, incluyendo los que requieren autenticación mediante JWT (usa el botón "Authorize" con tu token).

## 🧪 Pruebas (Testing)

```bash
# Unit tests
$ npm run test

# E2E tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov
```

---
Hecho con ❤️ para el sistema MPP.
