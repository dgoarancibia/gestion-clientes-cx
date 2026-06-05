---
product: "CX Dashboard — Gestión Clientes"
created: "2026-06-05"
---

# ICP — Ideal Customer Profile

## Usuario primario
**Marcela — Líder CX, Indumotora**

| Campo | Detalle |
|-------|---------|
| Rol | Líder de Customer Experience, holding automotriz (Kia, Hyundai, marcas chinas) |
| Acceso | Solo ella — autenticación Google OAuth con email autorizado |
| Volumen de datos | ~200 casos/mes |
| Fuente de datos | Export CSV/Excel desde Microsoft Dynamics 365 |
| Frecuencia de uso | Semanal (reuniones con jefatura) + ad hoc para análisis |
| Dispositivo | Desktop / laptop, cualquier navegador |
| Idioma | Español |

## Contexto del problema
- El CRM (Dynamics 365) funciona bien para gestión, **no tiene reportería**
- Hoy no existe proceso de reporte estructurado
- Necesita reportar a jefatura directa en reuniones semanales — alto nivel: estado general, tendencias, focos de problema
- No carga datos de clientes por protección de datos — trabaja con métricas agregadas

## Qué necesita hacer (Jobs To Be Done)
1. Cargar base de casos exportada del CRM (CSV/Excel)
2. Ver KPIs de volumen, tiempos y calidad de resolución
3. Analizar IRV (reclamos sobre ventas) por marca
4. Identificar casos críticos (aging, escalados)
5. Ver performance del equipo (ejecutivas) sin ranking negativo
6. Exportar resumen para incluir en reportes a dirección
7. Ajustar umbrales de semáforos sin tocar código

## Criterios de éxito para Marcela
- Puede preparar el reporte semanal en minutos, no horas
- Los gráficos son claros y presentables directamente a su jefe
- No necesita soporte técnico para usarlo

## A quién NO sirve este producto
- Otros equipos de Indumotora (ventas, post-venta, dealers) — scope es solo CX
- Jefatura directa — recibe reportes, no usa la app
- Usuarios sin acceso autorizado — por diseño (OAuth restringido)

## Receptores de reportes (stakeholders secundarios)
- Jefatura directa de Marcela — reuniones semanales, vista de alto nivel
- Otros stakeholders según contexto — mismo tipo de reporte

---

## Validación del ICP
- ✅ Usuario único y específico (Marcela)
- ✅ Problema concreto con dolor cuantificable
- ✅ Fuente de datos definida (Dynamics 365 → CSV/Excel)
- ✅ Estructura de campos del CRM definida en backlog
- ✅ Métricas clave identificadas (KPIs reclamos, IRV, aging, ejecutivas)
- ✅ Stack técnico y sistema de diseño especificados
