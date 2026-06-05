---
product: "Gestión Clientes — CX Dashboard"
stage: discovering
created: "2026-06-05"
---

# CX Dashboard — Reportería de Casos CRM

## Transformation Thesis
**De:** La Líder CX exporta datos crudos del CRM y construye reportes manualmente, sin visibilidad consolidada ni análisis ágil de los casos.

**A:** Un dashboard centralizado donde se carga la base CRM, se categorizan los casos y se visualizan métricas listas para reportar — en minutos, no horas.

## Target User
**Primario — Líder CX (Diego):** Consume el dashboard para analizar el estado de los casos y preparar reportes para su jefe y distintos stakeholders.

**Secundario — Jefatura y stakeholders:** Reciben los reportes generados; necesitan claridad, no raw data.

## Problem Statement
El CRM funciona bien para gestión de casos, pero **no tiene capacidad de reportería**. No hay dashboard, no hay categorización fácil, no hay métricas consolidadas. La Líder CX no puede reportar con agilidad ni confianza.

## Jobs To Be Done
1. **Cargar** la base de datos CRM (casos) de forma simple — CSV, Excel u otro export
2. **Categorizar** casos según criterios flexibles (tipo, estado, responsable, período, etc.)
3. **Visualizar** KPIs y métricas clave en un dashboard limpio
4. **Reportar** — exportar o presentar datos a distintas audiencias

## Product Power Score
- **ΔState**: 8/10 — De cero reportería a dashboard propio
- **Emotional Intensity**: 8/10 — Dolor concreto: no poder reportar bien a tu jefe
- **Problem Frequency**: 9/10 — Ocurre en cada ciclo de reporte (semanal/mensual)
- **Score**: ~576 — **High** — problema claro, usuario específico, scope acotado

## Current Landscape
- CRM existente: gestión de casos funciona bien
- Reportería: no existe — proceso manual o inexistente
- Workaround actual: ninguno estructurado

## Unique Advantage
- Usuario es también el product owner → feedback inmediato y validación continua
- Alcance acotado: no reemplaza el CRM, solo agrega la capa de análisis/reportería
- MVP ejecutable rápido: carga de archivo + visualización

## Open Questions
- ¿En qué formato exporta el CRM los datos? (CSV, Excel, API)
- ¿Cuáles son los campos clave del CRM? (estado, tipo, responsable, fecha, etc.)
- ¿Qué métricas son las más críticas para reportar al jefe?
- ¿Con qué frecuencia se reporta? ¿Hay un formato/template de reporte actual?
- ¿Acceso solo para Diego o también para otras personas del equipo?
