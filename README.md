# 👁️ OcuTrack - Contador de Lentes de Contacto (Android / Samsung Galaxy S23 FE)

Aplicación moderna para Android y la web diseñada específicamente para llevar el registro diario del uso de lentes de contacto, calcular los días de vida restante de cada par y recibir notificaciones para cambiarlos a tiempo en tu **Samsung Galaxy S23 FE**.

---

## 📦 Repositorio de GitHub

Repositorio: **[https://github.com/panda01real/contactlenses](https://github.com/panda01real/contactlenses)**

### Cómo subir los archivos a tu repositorio (2 Métodos sencillos):

#### Método 1: Arrastrar y soltar desde el navegador (Sin usar consola)
1. Descarga el archivo **`contactlenses.zip`** desde la aplicación y descomprímelo en tu computadora.
2. Abre tu repositorio: [github.com/panda01real/contactlenses](https://github.com/panda01real/contactlenses).
3. Haz clic en el enlace **"uploading an existing file"** (o en el botón *Add file > Upload files*).
4. Arrastra y suelta todos los archivos y carpetas descomprimidos (`src`, `public`, `android`, `.github`, `package.json`, etc.).
5. Haz clic abajo en el botón verde **"Commit changes"**.

#### Método 2: Con comandos de Git en tu computadora
En una terminal dentro de la carpeta del proyecto:
```bash
git init
git remote add origin https://github.com/panda01real/contactlenses.git
git branch -M main
git add .
git commit -m "Subir app lentes de contacto"
git push -u origin main
```

---

## 📱 Cómo obtener el archivo `.apk` para tu Samsung S23 FE

### 1. Compilación Automática en GitHub Actions (¡Recomendada!)
El repositorio incluye el flujo automatizado en `.github/workflows/build-apk.yml`.
1. Una vez que los archivos estén en tu GitHub, ve a la pestaña **Actions** en [github.com/panda01real/contactlenses/actions](https://github.com/panda01real/contactlenses/actions).
2. Verás el flujo **"Build Android APK"** ejecutándose en los servidores de GitHub.
3. Al terminar (~2 minutos), entra a la ejecución y en la sección **Artifacts** descarga el archivo:
   👉 **`OcuTrack-Android-APK`** (dentro vendrá el archivo `app-debug.apk`).
4. Pásalo a tu Samsung S23 FE e instálalo directamente.

### 2. Generar APK en la nube con PWABuilder (En 30 segundos, sin instalar nada)
1. Entra a [PWABuilder.com](https://www.pwabuilder.com).
2. Pega la URL de tu aplicación publicada:
   `https://ais-pre-ijhmaa6wstn2q5pjq6uuxi-482098825277.us-east1.run.app`
3. Haz clic en **"Start"** y luego en **"Package for Android"**.
4. ¡Descarga tu archivo `.apk` empaquetado para Android!

### 3. Instalación Directa en tu Samsung S23 FE (Sin descargar APK)
1. Abre el enlace en **Google Chrome** o **Samsung Internet** en tu S23 FE:
   `https://ais-pre-ijhmaa6wstn2q5pjq6uuxi-482098825277.us-east1.run.app`
2. Toca el botón **"Instalar en Android"** en la barra superior o en el menú del navegador (⋮) > **"Instalar aplicación"** / **"Añadir a pantalla de inicio"**.
3. Se integrará con su propio ícono en el cajón de aplicaciones de Samsung One UI, funciona sin conexión y cuenta con notificaciones y vibración háptica.
