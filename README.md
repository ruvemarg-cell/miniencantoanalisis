# MiniEncanto Análisis - Plataforma de Inteligencia Comercial para Argentina

Plataforma analítica moderna de tendencias, volumen de venta, estacionalidad, cotizaciones en vivo y calculadora de rentabilidad para el comercio electrónico en **Argentina**. Inspirada en la identidad visual de [MiniEncanto](https://miniencanto.com.ar/).

---

## 🚀 Despliegue en Vercel / GitHub

El proyecto está 100% preparado para desplegarse en **Vercel** o subirse a **GitHub** con una huella ultra-liviana:
- **Total de archivos del repositorio:** Solo **43 archivos** (bien por debajo del límite de 1.000).
- La carpeta `node_modules` y `.next` están excluidas automáticamente por [`.gitignore`](.gitignore).

### Pasos para Desplegar en Vercel:

1. **Subir el código a GitHub:**
   Crea un repositorio en GitHub y sube los archivos del proyecto (excluyendo `node_modules`).

2. **Importar el proyecto en Vercel:**
   - Entra en [vercel.com](https://vercel.com) e inicia sesión.
   - Haz clic en **"Add New Project"** y selecciona tu repositorio de GitHub.
   - Vercel detectará automáticamente que es un proyecto **Next.js**.

3. **Configurar las Variables de Entorno en Vercel:**
   En la sección **"Environment Variables"** del panel de Vercel, agrega:
   - `MELI_APP_ID`: Tu App ID de Mercado Libre (`5217043277171837`)
   - `MELI_CLIENT_SECRET`: Tu Client Secret de Mercado Libre (`HdZqKi2Rml4DNPlYDxRMDUIpyfOhkf0l`)
   - `AUTOMATION_TIMEZONE`: `America/Argentina/Buenos_Aires`

4. **Deploy:**
   Haz clic en **"Deploy"**. Vercel compilará la aplicación en aproximadamente 45 segundos y te otorgará tu URL pública de producción (ej. `https://tu-proyecto.vercel.app`).

---

## 🛠️ Ejecución Local

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Ejecutar servidor de desarrollo:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en el navegador.

3. Compilar para producción local:
   ```bash
   npm run build
   npm run start
   ```

---

## 📊 Módulos Incluidos

1. **Inicio (`/`):** Métricas clave del Top 10, podio de ventas y cuenta regresiva al próximo evento comercial.
2. **Productos (`/productos`):** Catálogo de los 30 productos líderes en Argentina, control de activación/descarte con atenuación en grises, ordenamientos, filtros y comparador multitienda.
3. **Categorías (`/categorias`):** Curvas de estacionalidad anual (Ene-Dic) y concentración por rango de precio.
4. **Fechas Importantes (`/fechas-importantes`):** Calendario comercial con contadores en tiempo real y recomendaciones respaldadas.
5. **Estadísticas (`/estadisticas`):** Rankings por volumen, ventas anuales y comparativa interanual (YoY).
6. **Calculadora con Comparador (`/calculadora`):** Fórmulas completas de Calculadora Ecom (comisiones ML, envíos, IIBB, publicidad y rentabilidad neta) vinculada a los 30 productos.
7. **Info (`/info`):** Dólar oficial, blue y tarjeta en vivo (DolarApi) e inflación IPC oficial (INDEC).
8. **Archivo Mensual (`/archivo-mensual`):** Histórico inmutable de meses cerrados con sus dos gráficas reglamentarias.
