## Proyecto Software V Página Web

> [!IMPORTANT]
> Este repositorio contiene el código base para nuestro proyecto. Si es tu primera vez trabajando con este repositorio, sigue los siguientes pasos para configurarlo.

## Instalación

Si es la primera vez que clonas este repositorio, asegúrate de instalar todas las dependencias. Puedes usar `npm` o `pnpm` para hacerlo.

### Con npm:
```bash
npm install
```

### Con pnpm:
```bash
pnpm install
```

## Sincronización con el repositorio principal

Si necesitas actualizar tu fork con los últimos cambios del repositorio principal, sigue estos pasos:

1. Añade el repositorio original como remoto:

   ```bash
   git remote add upstream https://github.com/Crei03/ProyectoDS5.git
   ```

2. Obtén los cambios del repositorio principal:

   ```bash
   git fetch upstream
   ```

3. Fusiona los cambios de la rama `dev`:

   ```bash
   git merge upstream/dev
   ```

## Subir cambios a tu fork

Para subir tus cambios a tu propio repositorio (fork), usa el siguiente comando:

```bash
git push origin [rama-a-la-que-quieren-pushear]
```
> [!CAUTION]
> Asegurate que tu PR no tenga conflictos al momento del merge

## Crear un Pull Request (PR)
1. Navega a tu fork en GitHub: Ve a tu repositorio en GitHub.
2. Crea un Pull Request:
   * Verás un botón que dice "Contribute" o "Compare & pull request". Haz clic en este botón.
   * Asegúrate de que la rama base sea dev del repositorio original (Crei03/ProyectoDS5) y que la rama de comparación sea la que contiene tus cambios en tu fork.

## Añade un título y descripción
* Proporciona un título claro y descriptivo para tu PR.
* En la descripción, explica los cambios que has hecho y por qué son necesarios.

<<<<<<< HEAD
## Revisa y envía el PR
* Asegúrate de revisar los cambios antes de enviarlo.
*Una vez que estés satisfecho, haz clic en "Create Pull Request".

> [!NOTE]
## Configuración de las APIs

Si vas a trabajar con las APIs, necesitarás un archivo `.env` que contenga las variables de entorno necesarias. Este archivo debe incluir la `URL` de la API y la `KEY` de autenticación.

Por favor, solicita estas credenciales antes de comenzar.
=======
Con estas instrucciones, los colaboradores podrán sincronizar su fork con el repositorio principal y subir sus cambios de manera efectiva.
