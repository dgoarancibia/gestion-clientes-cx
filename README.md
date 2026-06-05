# Dashboard CX — Indumotora

Web app de reportería para el área de Customer Experience. Permite cargar exports de Dynamics 365 y visualizar KPIs de casos, tiempos de resolución e índice de reclamos sobre ventas.

## Arquitectura

```
Browser → Frontend (React/Vite) → Backend (Express) → Google OAuth
```

## Setup local

### 1. Clonar e instalar

```bash
git clone <repo-url>
cd gestion-clientes

cd frontend && npm install
cd ../backend && npm install
```

### 2. Configurar variables de entorno

```bash
cp backend/.env.example backend/.env
```

Editar `backend/.env` con tus credenciales (ver sección de Google Cloud Console abajo).

### 3. Obtener credenciales Google OAuth

1. Ir a [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Crear proyecto (si no existe)
3. Crear credencial OAuth 2.0 → Aplicación web
4. Agregar URI de redirección autorizado: `http://localhost:3001/auth/google/callback`
5. Copiar Client ID y Client Secret al `.env`

### 4. Correr en local

```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

Abrir http://localhost:5173

## Deploy en producción

### Backend → Railway

1. Crear proyecto en Railway, conectar repositorio (carpeta `/backend`)
2. Configurar variables de entorno en Railway (igual que `.env.example`)
3. Agregar la URL de Railway como Callback URL en Google Cloud Console
4. Actualizar `BACKEND_URL` en variables de Railway

### Frontend → Vercel

1. Crear proyecto en Vercel, conectar repositorio (carpeta `/frontend`)
2. Agregar variable: `VITE_BACKEND_URL=https://tu-backend.railway.app`
3. El deploy se activa automáticamente desde rama `main`

## Solución de problemas

- **Error 403 al login**: verificar que `ALLOWED_EMAIL` tenga el Gmail correcto
- **CORS error**: verificar que `FRONTEND_URL` en Railway apunte al dominio de Vercel
- **Sesión expira inmediatamente**: verificar `SESSION_SECRET` y configuración de cookies
