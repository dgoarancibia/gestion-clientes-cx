# Backlog — Dashboard CX Indumotora
**Producto:** Web app React + backend Node.js · deploy en Railway/Render · código en GitHub  
**Datos:** Archivos CSV/Excel cargados por la usuaria (Fase 1) · Log de eventos desde Dynamics 365 (Fase 2 — futura)  
**Usuario principal:** Marcela — Líder CX Indumotora  
**Acceso:** Autenticación Google OAuth 2.0 (solo el Gmail autorizado puede ingresar)  
**Fecha:** Junio 2026

---

## Instrucciones para Claude Code

Eres un desarrollador senior construyendo un dashboard web para el área de Customer Experience de Indumotora, holding automotriz chileno con marcas Kia, Hyundai y marcas chinas. El dashboard lo usará solo Marcela (Líder CX), accediendo desde cualquier navegador con su cuenta Google autorizada. Los datos se cargan subiendo archivos Excel o CSV exportados desde Microsoft Dynamics 365.

**Stack completo:**

Frontend:
- React 18 + Vite
- Recharts para gráficos
- Tailwind CSS para estilos
- PapaParse para leer CSV
- SheetJS (xlsx) para leer Excel

Backend (necesario para autenticación segura):
- Node.js + Express
- Passport.js con estrategia Google OAuth 2.0
- express-session + connect-pg-simple (o connect-mongo si usas Mongo)
- dotenv para variables de entorno

Infraestructura:
- Repositorio GitHub (privado)
- Deploy backend: Railway o Render (free tier)
- Deploy frontend: Vercel o Netlify
- Variables de entorno gestionadas en el panel del servicio de deploy (nunca en el código)

**Principios de diseño:**
- Interfaz completamente en español
- Estética limpia y profesional con paleta de colores pasteles — no minimalismo frío
- Responsive: funciona en desktop y laptop

**Sistema de diseño visual (obligatorio — aplicar desde la primera pantalla):**

Paleta de colores:
```
Fondo general:       #F8F7F4   (blanco roto cálido — nunca blanco puro)
Fondo de cards:      #FFFFFF   con sombra muy sutil (box-shadow: 0 1px 3px rgba(0,0,0,0.06))
Texto principal:     #2C2C2A
Texto secundario:    #73726C
Bordes:              #E8E6E0   (0.5px)

Acento por sección:
  Reclamos:          #A8D5C2   (teal pastel)   · texto sobre acento: #085041
  IRV / ventas:      #B5D4F4   (azul polvo)    · texto sobre acento: #0C447C
  Configuración:     #CECBF6   (lavanda)       · texto sobre acento: #3C3489
  Dealers:           #FAC775   (ámbar pastel)  · texto sobre acento: #633806

Semáforos (pasteles — nunca colores saturados):
  Verde:    fondo #D4EDDA   texto #155724
  Amarillo: fondo #FFF3CD   texto #856404
  Rojo:     fondo #F8D7DA   texto #721C24
```

Componentes:
- Cards con border-radius: 12px, borde 0.5px solid #E8E6E0, sin sombra pesada
- Header fijo con fondo #FFFFFF, borde inferior 1px solid #E8E6E0, altura 56px
- Sidebar de navegación (si aplica): fondo #F3F2EE, ancho 220px
- Fuente: Inter (importar desde Google Fonts) — nunca mezclar familias
- Tamaño base: 14px · títulos de sección: 16px 500 · métricas grandes: 28px 500
- Iconos: Lucide React (outline, 18px)
- Tablas: cabecera fondo #F3F2EE, filas alternas #FAFAF8, sin bordes verticales
- Gráficos Recharts: usar colores de acento por sección · sin grid vertical · grid horizontal #E8E6E0 0.5px
- Badges de estado: pasteles del sistema de semáforos · border-radius: 20px · font-size: 12px
- Botones primarios: fondo #2C2C2A · texto blanco · hover #444441 · border-radius: 8px
- Botones secundarios: fondo transparente · borde 0.5px solid #2C2C2A · hover fondo #F3F2EE

---

## ÉPICA 0 — Autenticación y seguridad

### HU-00 · Estructura del repositorio GitHub
**Como** Marcela  
**Quiero** que el proyecto esté organizado en un repositorio GitHub con estructura clara  
**Para** poder publicarlo, versionarlo y que Claude Code lo pueda mantener

**Criterios de aceptación:**
- Repositorio con estructura monorepo:
  ```
  /
  ├── frontend/          ← React + Vite
  ├── backend/           ← Node.js + Express
  ├── .github/
  │   └── workflows/     ← CI opcional (lint)
  ├── .gitignore         ← incluye .env, node_modules, dist
  └── README.md          ← instrucciones de setup y deploy
  ```
- El `.gitignore` excluye explícitamente todos los archivos `.env`
- El `README.md` explica: cómo clonar, configurar variables de entorno, correr en local y hacer deploy
- El repositorio puede ser privado en GitHub

---

### HU-01-AUTH · Login con Google
**Como** Marcela  
**Quiero** ingresar al dashboard usando mi cuenta Gmail  
**Para** no tener que recordar otra contraseña y garantizar que nadie más pueda acceder

**Criterios de aceptación:**
- Al entrar a la URL del dashboard, si no hay sesión activa, se muestra pantalla de login con botón "Ingresar con Google"
- El botón redirige al flujo OAuth 2.0 de Google (Google muestra el selector de cuenta)
- Tras autenticarse en Google, el backend verifica que el email sea exactamente el email autorizado (guardado en variable de entorno `ALLOWED_EMAIL`)
- Si el email NO coincide, se rechaza el acceso y se muestra mensaje: "Acceso no autorizado. Este dashboard es de uso privado."
- Si el email SÍ coincide, se crea sesión segura y se redirige al dashboard
- El nombre y foto de perfil de Google se muestran en el header del dashboard
- Botón "Cerrar sesión" en el header destruye la sesión y vuelve al login

**Notas técnicas:**
- Credenciales OAuth (Client ID + Client Secret) se obtienen desde Google Cloud Console → APIs & Services → Credentials
- Guardar en variables de entorno del backend: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `ALLOWED_EMAIL`, `SESSION_SECRET`
- Callback URL a registrar en Google Cloud Console: `https://TU-BACKEND.railway.app/auth/google/callback`
- En desarrollo local: `http://localhost:3001/auth/google/callback`
- Usar `express-session` con `httpOnly: true`, `secure: true` (en producción), `sameSite: 'lax'`
- La sesión expira en 8 horas (jornada laboral)

---

### HU-02-AUTH · Protección de rutas
**Como** sistema  
**Quiero** que todas las rutas del dashboard (frontend y API) requieran sesión activa  
**Para** que sea imposible acceder a datos sin haberse autenticado previamente

**Criterios de aceptación:**
- Middleware de autenticación en el backend rechaza con `401` cualquier request a `/api/*` sin sesión válida
- El frontend detecta el `401` y redirige automáticamente a la pantalla de login
- Si el usuario intenta acceder directamente a una URL del dashboard sin sesión, es redirigido al login
- Al expirar la sesión (8 horas), el próximo request redirige al login sin mostrar datos

**Notas técnicas:**
- Crear middleware `requireAuth` que verifique `req.isAuthenticated()` en todas las rutas `/api/*`
- En el frontend, crear un `AuthProvider` con React Context que exponga el estado de autenticación
- Crear componente `ProtectedRoute` que envuelva todas las rutas del dashboard

---

### HU-03-AUTH · Variables de entorno y configuración segura
**Como** Marcela (al hacer el deploy)  
**Quiero** una guía clara de qué variables de entorno debo configurar y dónde  
**Para** poder hacer el deploy yo misma sin cometer errores de seguridad

**Criterios de aceptación:**
- Archivo `.env.example` en la raíz de `/backend` con todas las variables requeridas (sin valores reales):
  ```
  GOOGLE_CLIENT_ID=
  GOOGLE_CLIENT_SECRET=
  ALLOWED_EMAIL=
  SESSION_SECRET=
  FRONTEND_URL=
  PORT=3001
  NODE_ENV=development
  ```
- El `.env` real nunca se sube a GitHub (verificado en `.gitignore`)
- El `README.md` incluye una sección "Configuración de variables de entorno" con instrucciones paso a paso para Railway/Render
- La app falla explícitamente al arrancar si falta alguna variable de entorno obligatoria (con mensaje claro en consola)

---

## ÉPICA 1 — Carga y normalización de datos

### HU-01 · Carga de archivo de casos (reclamos)
**Como** Marcela  
**Quiero** subir un archivo Excel o CSV exportado desde Dynamics 365 con los casos del período  
**Para** que el dashboard lea y procese automáticamente los datos sin configuración manual

**Criterios de aceptación:**
- Acepta `.xlsx`, `.xls` y `.csv`
- Muestra vista previa de las primeras 5 filas tras la carga
- Valida que existan las columnas mínimas requeridas: `id_caso`, `fecha_ingreso`, `fecha_cierre`, `estado`, `marca`, `dealer`, `tipo_reclamo`, `ejecutiva`, `escalado`
- Si falta alguna columna requerida, muestra mensaje de error claro indicando qué columna falta
- Si la carga es exitosa, muestra badge verde con el número de filas cargadas

**Notas técnicas:**
- Usar SheetJS para Excel, PapaParse para CSV
- Normalizar nombres de columnas (trim, lowercase, sin tildes) para tolerar variaciones del export
- Guardar los datos en estado global (React Context o Zustand)
- El archivo se procesa 100% en el frontend (no se envía al servidor)

---

### HU-02 · Carga de archivo de ventas
**Como** Marcela  
**Quiero** subir un archivo separado con las unidades vendidas por marca y período  
**Para** calcular el Índice de Reclamos sobre Ventas (IRV) por marca

**Criterios de aceptación:**
- Acepta `.xlsx`, `.xls` y `.csv`
- Columnas mínimas: `mes`, `marca`, `unidades_vendidas`
- Valida columnas requeridas con mensaje de error si faltan
- Al cargar ambos archivos (casos + ventas), se habilita automáticamente la sección IRV del dashboard

**Notas técnicas:**
- El archivo de ventas es independiente del de casos
- Si no se carga el archivo de ventas, la sección IRV muestra un mensaje invitando a cargarlo, pero el resto del dashboard funciona igual

---

### HU-03 · Selector de período
**Como** Marcela  
**Quiero** filtrar todos los datos por mes/año o rango de fechas personalizado  
**Para** analizar períodos específicos sin necesidad de recargar archivos

**Criterios de aceptación:**
- Selector de mes+año (dropdown) que filtra todos los módulos simultáneamente
- Opción de rango personalizado: fecha desde / fecha hasta
- El filtro activo se muestra siempre visible en el header del dashboard
- Al cambiar el período, todos los KPIs y gráficos se recalculan automáticamente

---

### HU-04 · Filtro global por marca
**Como** Marcela  
**Quiero** filtrar todo el dashboard por marca (Kia / Hyundai / Otras / Todas)  
**Para** analizar cada marca de forma independiente

**Criterios de aceptación:**
- Selector de marca visible en el header junto al filtro de período
- Las opciones se generan dinámicamente desde los datos cargados (no hardcodeadas)
- Al seleccionar "Todas" se muestran datos consolidados
- El filtro de marca se combina con el filtro de período

---

## ÉPICA 2 — Módulo Reclamos

### HU-05 · KPIs de volumen y flujo
**Como** Marcela  
**Quiero** ver en tarjetas de resumen los KPIs de volumen del período filtrado  
**Para** tener una lectura rápida del estado operativo del equipo

**Criterios de aceptación:**
- Mostrar 4 tarjetas métricas:
  1. **Casos ingresados** — total del período
  2. **Casos cerrados** — total del período
  3. **Backlog activo** — casos abiertos al corte (sin fecha_cierre)
  4. **Tasa de reapertura** — % (requiere campo `reabierto` = true/false en el CSV)
- Cada tarjeta muestra: valor actual + variación vs. período anterior (flecha + %)
- Si no hay período anterior para comparar, omitir la variación sin error

**Fórmulas:**
- Tasa reapertura = (casos con `reabierto = true` / total casos cerrados) × 100

---

### HU-06 · KPIs de tiempos de gestión
**Como** Marcela  
**Quiero** ver los tiempos promedio de resolución y primera respuesta  
**Para** controlar que el equipo está dentro de los SLA definidos

**Criterios de aceptación:**
- Tarjeta **ART**: promedio de días hábiles entre `fecha_ingreso` y `fecha_cierre`, solo para casos cerrados
- Tarjeta **FRT**: promedio de horas entre `fecha_ingreso` y `fecha_primera_respuesta` (si existe la columna)
- Si `fecha_primera_respuesta` no existe en el CSV, la tarjeta FRT muestra "Sin datos" sin romper el dashboard
- Semáforo ART: ≤ 5 días = verde, 5–8 = amarillo, > 8 = rojo
- Semáforo FRT: ≤ 24 hrs = verde, 24–48 = amarillo, > 48 = rojo
- El cálculo de días hábiles excluye sábados y domingos

---

### HU-07 · KPIs de calidad de resolución
**Como** Marcela  
**Quiero** ver la tasa de escalamiento y la distribución por tipo de reclamo  
**Para** identificar focos de problema y evaluar la capacidad de resolución del equipo

**Criterios de aceptación:**
- Tarjeta **Tasa de escalamiento**: (casos con `escalado = true` / total casos) × 100
- Semáforo: ≤ 15% = verde, 15–25% = amarillo, > 25% = rojo
- Gráfico de dona: distribución de casos por `tipo_reclamo` (venta / postventa / garantía / técnico / admin / otro)
- El gráfico muestra porcentaje y cantidad absoluta en tooltip al pasar el cursor

---

### HU-08 · Aging de casos abiertos
**Como** Marcela  
**Quiero** ver cuántos casos abiertos llevan cuántos días sin cierre  
**Para** identificar casos críticos que requieren intervención inmediata

**Criterios de aceptación:**
- Gráfico de barras horizontales con 4 rangos: 0–2 días / 3–5 días / 6–10 días / +10 días
- Solo incluye casos con `estado = abierto` (sin `fecha_cierre`)
- Rango "+10 días" siempre se colorea en rojo
- Debajo del gráfico, tabla con los casos de +10 días: `id_caso`, `fecha_ingreso`, `tipo_reclamo`, `ejecutiva`, `dealer`
- La tabla es ordenable por fecha_ingreso

---

### HU-09 · Performance por ejecutiva
**Como** Marcela  
**Quiero** ver cuántos casos gestionó cada ejecutiva en el período  
**Para** verificar que la carga está distribuida equitativamente

**Criterios de aceptación:**
- Tabla con una fila por ejecutiva: nombre, casos asignados, casos cerrados, ART individual, % del total de casos
- Barra de progreso visual que muestra el volumen relativo de cada ejecutiva vs. el promedio del equipo
- ART individual se colorea: verde si está bajo el promedio del equipo, amarillo si está 0–20% sobre el promedio, rojo si supera 20%
- Nota visible bajo la tabla: "El ART individual puede variar según complejidad de casos asignados"
- NO mostrar tasa de escalamiento individual (evitar ranking negativo)

---

## ÉPICA 3 — Índice de Reclamos sobre Ventas (IRV)

### HU-10 · IRV por marca (mensual)
**Como** Marcela  
**Quiero** ver el ratio de reclamos sobre unidades vendidas, separado por marca  
**Para** detectar si un alza de reclamos se debe a mayor volumen de ventas o a un problema real

**Criterios de aceptación:**
- Requiere ambos archivos cargados (HU-01 y HU-02)
- Tarjeta por marca con: reclamos del período, unidades vendidas, IRV = (reclamos / unidades_vendidas) × 100
- Semáforo (configurable): ≤ 2% = verde, 2–5% = amarillo, > 5% = rojo
- Si no hay ventas para una marca en el período: "Sin datos de ventas" (nunca dividir por cero)

---

### HU-11 · Evolución del IRV en el tiempo
**Como** Marcela  
**Quiero** ver cómo evoluciona el IRV mes a mes para cada marca  
**Para** identificar tendencias y anticipar problemas antes de que escalen

**Criterios de aceptación:**
- Gráfico de líneas con una serie por marca
- Tooltip: mes, marca, IRV, reclamos, ventas
- Si hay menos de 2 meses de datos: mensaje explicativo, sin gráfico vacío

---

### HU-12 · IRV desglosado por tipo de reclamo
**Como** Marcela  
**Quiero** ver el IRV separado por tipo de reclamo para cada marca  
**Para** distinguir si el problema viene del proceso de venta o de la calidad del vehículo

**Criterios de aceptación:**
- Tabla heatmap: filas = marcas, columnas = tipos de reclamo, celdas = IRV
- Celda (—) si no hay reclamos de ese tipo para esa marca
- Coloración por intensidad relativa al máximo del período

---

## ÉPICA 4 — Exportación y utilidad operativa

### HU-13 · Exportar resumen a CSV
**Como** Marcela  
**Quiero** exportar los KPIs calculados del período a un CSV  
**Para** incluirlos en reportes a dirección

**Criterios de aceptación:**
- Botón "Exportar resumen CSV" en el header
- Incluye: período, marca activa, todos los KPIs con valor y unidad
- Nombre del archivo: `resumen_cx_2026-06.csv`
- Funciona completamente en el frontend (sin request al servidor)

---

### HU-14 · Pantalla de bienvenida y guía de carga
**Como** Marcela  
**Quiero** ver instrucciones claras al entrar por primera vez  
**Para** poder usar el dashboard sin soporte técnico

**Criterios de aceptación:**
- Si no hay datos cargados: pantalla con descripción de archivos, columnas requeridas y botones de carga
- Botones para descargar plantillas CSV de ejemplo
- Una vez cargado el archivo de casos, la pantalla de bienvenida desaparece

---

### HU-15 · Generador de plantillas CSV
**Como** Marcela  
**Quiero** descargar plantillas CSV con columnas correctas y datos de ejemplo  
**Para** saber cómo formatear los exports de Dynamics 365

**Criterios de aceptación:**
- "Descargar plantilla de casos" → `plantilla_casos.csv` (encabezados + 3 filas de ejemplo)
- "Descargar plantilla de ventas" → `plantilla_ventas.csv` (encabezados + 3 filas de ejemplo)
- Datos de ejemplo con marcas y dealers realistas (Kia, Hyundai, dealer Santiago Centro, etc.)

**Columnas plantilla_casos.csv:**
`id_caso, fecha_ingreso, fecha_cierre, fecha_primera_respuesta, estado, marca, dealer, tipo_reclamo, ejecutiva, escalado, reabierto, contactos`

**Columnas plantilla_ventas.csv:**
`mes, marca, unidades_vendidas`

---

## ÉPICA 5 — Configuración y umbrales

### HU-16 · Panel de configuración de semáforos
**Como** Marcela  
**Quiero** ajustar los umbrales de semáforos de cada KPI  
**Para** adaptar las alertas a las metas reales de Indumotora sin tocar código

**Criterios de aceptación:**
- Pantalla de configuración desde ícono de ajustes en el header
- KPIs con semáforo editables: ART, FRT, Tasa escalamiento, IRV
- Valores se guardan en `localStorage` y persisten entre sesiones
- Botón "Restaurar valores por defecto"
- Cambios se reflejan inmediatamente en todos los semáforos

---

## ÉPICA 6 — Deploy y puesta en producción

### HU-17 · Deploy del backend en Railway
**Como** Marcela  
**Quiero** publicar el backend en Railway con las variables de entorno configuradas  
**Para** que la autenticación Google funcione desde internet

**Criterios de aceptación:**
- El backend corre correctamente en Railway con `NODE_ENV=production`
- Todas las variables de entorno están configuradas en el panel de Railway (no en el código)
- La URL de producción del backend está registrada como Callback URL en Google Cloud Console
- El endpoint `GET /auth/google` redirige correctamente al flujo de Google
- El endpoint `GET /auth/google/callback` procesa el retorno de Google y crea la sesión
- El endpoint `GET /api/me` retorna los datos del usuario autenticado (para que el frontend verifique la sesión)
- El endpoint `POST /auth/logout` destruye la sesión

**Variables de entorno requeridas en Railway:**
```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ALLOWED_EMAIL=marcela@su-email.com
SESSION_SECRET=cadena-aleatoria-larga-minimo-32-chars
FRONTEND_URL=https://TU-APP.vercel.app
PORT=3001
NODE_ENV=production
```

---

### HU-18 · Deploy del frontend en Vercel
**Como** Marcela  
**Quiero** publicar el frontend en Vercel conectado al repositorio GitHub  
**Para** acceder al dashboard desde cualquier navegador con mi URL personal

**Criterios de aceptación:**
- El frontend se deploya automáticamente desde la rama `main` del repositorio GitHub
- Variable de entorno en Vercel: `VITE_BACKEND_URL=https://TU-BACKEND.railway.app`
- El frontend llama al backend con `credentials: 'include'` en todos los fetch para enviar la cookie de sesión
- El backend tiene CORS configurado para aceptar solo el origen del frontend de Vercel
- Al entrar a la URL de Vercel sin sesión, redirige al login de Google correctamente

**Configuración CORS en el backend:**
```javascript
cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
})
```

---

### HU-19 · Guía de setup completo en README
**Como** Marcela (o quien retome el proyecto)  
**Quiero** un README detallado con todos los pasos desde cero  
**Para** poder replicar el setup o recuperar el proyecto si algo falla

**Criterios de aceptación:**
El `README.md` en la raíz del repositorio debe incluir estas secciones:

1. **Descripción del proyecto** — qué hace, para quién
2. **Arquitectura** — diagrama simple (frontend → backend → Google OAuth)
3. **Setup local** — paso a paso:
   - Clonar el repo
   - Instalar dependencias (`npm install` en `/frontend` y `/backend`)
   - Crear `.env` en `/backend` copiando `.env.example`
   - Obtener credenciales en Google Cloud Console (con capturas o links)
   - Correr en local: `npm run dev` en ambas carpetas
4. **Deploy en producción**:
   - Crear proyecto en Railway y conectar repo
   - Configurar variables de entorno en Railway
   - Crear proyecto en Vercel y conectar repo
   - Configurar variable de entorno en Vercel
   - Actualizar Callback URL en Google Cloud Console con URL de Railway
5. **Cómo usar el dashboard** — instrucciones para cargar archivos y navegar
6. **Solución de problemas frecuentes**:
   - "Error 403 al hacer login" → verificar ALLOWED_EMAIL
   - "CORS error" → verificar FRONTEND_URL en Railway
   - "Sesión expira inmediatamente" → verificar SESSION_SECRET y configuración de cookies

---

## Orden de desarrollo sugerido para Claude Code

| Prioridad | HU | Descripción | Épica |
|---|---|---|---|
| 1 | HU-00 | Estructura del repositorio | Infra |
| 2 | HU-01-AUTH | Login con Google | Auth |
| 3 | HU-02-AUTH | Protección de rutas | Auth |
| 4 | HU-03-AUTH | Variables de entorno | Auth |
| 5 | HU-14 | Pantalla de bienvenida | Setup |
| 6 | HU-15 | Plantillas CSV | Setup |
| 7 | HU-01 | Carga archivo casos | Datos |
| 8 | HU-02 | Carga archivo ventas | Datos |
| 9 | HU-03 | Selector de período | Datos |
| 10 | HU-04 | Filtro por marca | Datos |
| 11 | HU-05 | KPIs volumen | Reclamos |
| 12 | HU-06 | KPIs tiempos | Reclamos |
| 13 | HU-07 | KPIs calidad | Reclamos |
| 14 | HU-08 | Aging de casos | Reclamos |
| 15 | HU-09 | Performance ejecutivas | Reclamos |
| 16 | HU-10 | IRV por marca | IRV |
| 17 | HU-11 | Evolución IRV | IRV |
| 18 | HU-12 | IRV por tipo | IRV |
| 19 | HU-13 | Exportar CSV | Utilidad |
| 20 | HU-16 | Config semáforos | Config |
| 21 | HU-17 | Deploy backend Railway | Deploy |
| 22 | HU-18 | Deploy frontend Vercel | Deploy |
| 23 | HU-19 | README completo | Deploy |

---

## Prompt de inicio para Claude Code

Pega esto textualmente al abrir Claude Code en una carpeta vacía:

```
Construye una web app para el área de Customer Experience de Indumotora, holding automotriz chileno.

Lee el archivo backlog_dashboard_cx.md adjunto. Contiene 23 historias activas en 7 épicas
más una Épica 7 marcada como FASE FUTURA (no construir ahora, solo considerar en la arquitectura).

EMPIEZA por la Épica 0 (autenticación) completa: HU-00, HU-01-AUTH, HU-02-AUTH y HU-03-AUTH.

Stack obligatorio:
- Frontend: React 18 + Vite + Tailwind CSS + Recharts + PapaParse + SheetJS + Lucide React
- Backend: Node.js + Express + Passport.js (Google OAuth) + express-session
- Repositorio: monorepo con carpetas /frontend y /backend

SISTEMA DE DISEÑO — aplicar desde la primera pantalla sin excepción:
- Fondo general: #F8F7F4 (nunca blanco puro)
- Cards: #FFFFFF, border-radius 12px, borde 0.5px solid #E8E6E0
- Fuente: Inter (Google Fonts)
- Semáforos en pasteles: verde #D4EDDA, amarillo #FFF3CD, rojo #F8D7DA
- Acentos por sección: reclamos #A8D5C2, IRV #B5D4F4, dealers #FAC775
- Ver sección "Sistema de diseño visual" en el backlog para todos los tokens

ARQUITECTURA FUTURA — leer la Nota de arquitectura en Épica 7 antes de diseñar
el DataContext. El modelo de datos debe soportar log de eventos opcionales sin refactorizar.

Al terminar la Épica 0 y verificar que el login con Google funciona en local,
avísame para continuar con la Épica 1 (carga de datos).
```

---


---

## ÉPICA 7 — SLA Tracking avanzado desde log de eventos ⚠️ FASE FUTURA

> **Estado:** No construir ahora. Diseñar la arquitectura actual (épicas 0–6) de forma que
> agregar estas historias en el futuro NO requiera refactorizar el modelo de datos ni los
> componentes existentes. Ver "Nota de arquitectura" al final de esta sección.

### Contexto
Dynamics 365 puede exportar un historial de cambios de estado por caso (log de actividades).
Cuando Marcela tenga claridad sobre el formato exacto de ese export, estas historias se activan.
El log permite calcular KPIs de tiempo intermedios que hoy no son posibles con el CSV de casos.

---

### HU-20 · Carga del log de eventos (futura)
**Como** Marcela  
**Quiero** subir un archivo con el historial de cambios de estado de cada caso  
**Para** que el dashboard calcule KPIs de tiempo intermedios con datos reales

**Criterios de aceptación:**
- Archivo opcional — si no se carga, el dashboard funciona igual con las épicas 1–6
- Columnas esperadas: `id_caso, estado_anterior, estado_nuevo, fecha_hora, ejecutiva, observacion`
- Al detectar el archivo, se activa automáticamente el módulo de SLA Tracking (HU-21)
- El sistema hace join entre el log y el archivo de casos usando `id_caso` como llave
- Si un `id_caso` del log no existe en el archivo de casos, se ignora sin error

**Nota:** el formato exacto del export de Dynamics 365 se definirá cuando Marcela
tenga acceso a la configuración del CRM. La columna `id_caso` debe coincidir exactamente
con la del archivo de casos principal.

---

### HU-21 · Módulo SLA Tracking (futura)
**Como** Marcela  
**Quiero** ver KPIs calculados desde el log de cambios de estado  
**Para** medir tiempos intermedios del ciclo de vida de cada caso con precisión real

**KPIs que se habilitan con el log:**

| KPI | Cálculo desde el log | Meta sugerida |
|---|---|---|
| FRT real | fecha_hora (estado: ingreso → primer_contacto) | ≤ 24 hrs hábiles |
| Tiempo de derivación | fecha_hora (en_gestion → derivado) | ≤ 48 hrs hábiles |
| Tiempo de respuesta dealer | fecha_hora (derivado → respuesta_recibida) | ≤ 48 hrs hábiles |
| Tiempo de resolución efectivo | fecha_hora (en_gestion → resuelto) | ≤ 3 días hábiles |
| Casos reabiertos | eventos con estado_anterior = cerrado | tendencia a la baja |

**Criterios de aceptación:**
- Nuevas tarjetas métricas con los KPIs de la tabla (semáforos configurables)
- Todos los semáforos usan la misma lógica pastel del sistema de diseño
- Si falta algún estado en el log de un caso, ese KPI se omite para ese caso sin error

---

### HU-22 · Vista de detalle de caso con línea de tiempo (futura)
**Como** Marcela  
**Quiero** hacer clic en cualquier caso y ver su historial completo de cambios  
**Para** entender exactamente qué pasó en cada caso escalado o problemático

**Criterios de aceptación:**
- Panel lateral (drawer) que se abre al hacer clic en un `id_caso` en cualquier tabla
- Muestra línea de tiempo vertical con cada evento: estado, fecha/hora, ejecutiva, observación
- Resalta visualmente los hitos que superaron el SLA (en rojo pastel)
- Botón para cerrar el panel y volver a la vista principal sin perder filtros

---

### HU-23 · Exportar log de cambios filtrado (futura)
**Como** Marcela  
**Quiero** exportar el log de eventos del período filtrado a CSV  
**Para** adjuntarlo en reportes a dirección o en escalamientos a fábrica

**Criterios de aceptación:**
- Botón "Exportar log CSV" visible solo cuando hay log cargado
- El CSV exportado respeta los filtros activos de período y marca
- Nombre: `log_cx_eventos_2026-06.csv`

---

### Nota de arquitectura para Claude Code

Al construir las épicas 0–6, tener en cuenta estas decisiones de diseño para no bloquear la Fase 2:

1. **Modelo de datos interno**: usar una estructura de tipo `Map<id_caso, CasoData>` donde
   `CasoData` tenga un campo opcional `eventos: EventoLog[]`. Cuando no hay log, el array
   está vacío. Cuando se carga el log, se popula sin tocar el resto de la estructura.

2. **Cálculo de FRT en Fase 1**: mientras no haya log, calcular FRT desde `fecha_primera_respuesta`
   del CSV de casos (si existe). Cuando haya log, el mismo componente usará `eventos` en su lugar.
   Usar una función utilitaria `calcularFRT(caso)` que internamente decide qué fuente usar.

3. **Componente de tarjeta de caso**: diseñarlo con una prop opcional `onVerDetalle` que
   en Fase 1 está deshabilitada y en Fase 2 abre el drawer de línea de tiempo (HU-22).

4. **Contexto de datos**: el DataContext global debe exponer `logCargado: boolean` para que
   los componentes puedan mostrar/ocultar módulos de Fase 2 sin lógica duplicada.

## Checklist antes de hacer deploy

Antes de publicar, verificar:

- [ ] `.env` no está en el repositorio GitHub
- [ ] `ALLOWED_EMAIL` tiene el Gmail correcto de Marcela
- [ ] `SESSION_SECRET` es una cadena aleatoria de al menos 32 caracteres
- [ ] La Callback URL en Google Cloud Console apunta a Railway (no a localhost)
- [ ] CORS en el backend apunta solo al dominio de Vercel
- [ ] Probé el login completo en producción antes de considerar el deploy terminado

