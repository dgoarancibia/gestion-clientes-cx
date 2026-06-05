// Fases cerradas según el CRM real
const FASES_CERRADAS = ['Cerrado', 'Problema resuelto', 'Problema resuelto - Sin Encuesta', 'Termina Caso']
const FASES_ABIERTAS = ['En Curso', 'En Proceso', 'Es espera de respuesta Cliente', 'En espera de respuesta Responsable', 'Validación cierre', 'En espera de repuesto', 'Solución Entregada a Cliente', 'Sin Gestión']

export function esCerrado(caso) {
  return FASES_CERRADAS.includes(caso.estado)
}

export function esAbierto(caso) {
  return !esCerrado(caso)
}

function diasHabiles(desde, hasta) {
  let count = 0
  const d = new Date(desde)
  const h = new Date(hasta)
  while (d < h) {
    const dow = d.getDay()
    if (dow !== 0 && dow !== 6) count++
    d.setDate(d.getDate() + 1)
  }
  return count
}

export function calcularKPIs(casos) {
  const total = casos.length
  const cerrados = casos.filter(esCerrado)
  const abiertos = casos.filter(esAbierto)

  // ART — días hábiles entre ingreso y cierre (solo cerrados con fecha cierre)
  const arts = cerrados
    .filter(c => c.fecha_cierre && c.fecha_ingreso)
    .map(c => diasHabiles(c.fecha_ingreso, c.fecha_cierre))
    .filter(d => d >= 0 && d < 365)
  const art = arts.length ? arts.reduce((a, b) => a + b, 0) / arts.length : null

  // ART alternativo con antigüedad si no hay fecha cierre
  const antVals = cerrados
    .filter(c => c.antigüedad != null)
    .map(c => c.antigüedad)
  const artAnt = antVals.length ? antVals.reduce((a, b) => a + b, 0) / antVals.length : null

  const artFinal = art ?? artAnt

  // Tasa escalamiento
  const escalados = casos.filter(c => c.escalado)
  const tasaEscalamiento = total ? Math.round((escalados.length / total) * 100 * 10) / 10 : 0

  // Distribución por tipo de caso (Reclamo, Consulta, Garantía, etc.)
  const porTipo = {}
  for (const c of casos) {
    const t = c.tipo_caso || 'Sin tipo'
    porTipo[t] = (porTipo[t] || 0) + 1
  }

  // Distribución por área
  const porArea = {}
  for (const c of casos) {
    const a = c.area || 'Sin área'
    porArea[a] = (porArea[a] || 0) + 1
  }

  // Distribución por motivo (top 6)
  const porMotivo = {}
  for (const c of casos) {
    if (c.motivo) porMotivo[c.motivo] = (porMotivo[c.motivo] || 0) + 1
  }

  // Aging casos abiertos — usar antigüedad si disponible
  const hoy = new Date()
  const aging = { '0-2': 0, '3-5': 0, '6-10': 0, '+10': [] }
  for (const c of abiertos) {
    const dias = c.antigüedad ?? (c.fecha_ingreso ? diasHabiles(c.fecha_ingreso, hoy) : 0)
    if (dias <= 2) aging['0-2']++
    else if (dias <= 5) aging['3-5']++
    else if (dias <= 10) aging['6-10']++
    else aging['+10'].push({ ...c, dias })
  }

  // Performance por ejecutiva
  const ejecutivaMap = {}
  for (const c of casos) {
    const nombre = c.ejecutiva || 'Sin asignar'
    if (!ejecutivaMap[nombre]) ejecutivaMap[nombre] = { asignados: 0, cerrados: 0, arts: [] }
    ejecutivaMap[nombre].asignados++
    if (esCerrado(c) && c.fecha_cierre && c.fecha_ingreso) {
      const d = diasHabiles(c.fecha_ingreso, c.fecha_cierre)
      if (d >= 0 && d < 365) {
        ejecutivaMap[nombre].cerrados++
        ejecutivaMap[nombre].arts.push(d)
      }
    } else if (esCerrado(c) && c.antigüedad != null) {
      ejecutivaMap[nombre].cerrados++
      ejecutivaMap[nombre].arts.push(c.antigüedad)
    }
  }

  const ejecutivas = Object.entries(ejecutivaMap)
    .map(([nombre, d]) => ({
      nombre: nombre.split(' ').slice(0, 2).join(' '), // Nombre corto
      asignados: d.asignados,
      cerrados: d.cerrados,
      art: d.arts.length ? Math.round(d.arts.reduce((a, b) => a + b, 0) / d.arts.length * 10) / 10 : null,
      pct: total ? Math.round((d.asignados / total) * 100 * 10) / 10 : 0,
    }))
    .filter(e => e.asignados > 0)

  const artPromedio = artFinal ? Math.round(artFinal * 10) / 10 : null

  return {
    total,
    cerrados: cerrados.length,
    abiertos: abiertos.length,
    escalados: escalados.length,
    art: artPromedio,
    frt: null, // No disponible en el CRM actual
    tasaEscalamiento,
    tasaReapertura: null, // No disponible en el CRM actual
    porTipo,
    porArea,
    porMotivo,
    aging,
    ejecutivas,
    artPromedio,
  }
}

export function semaforoART(dias) {
  if (dias == null) return { bg: '#F0F0EE', color: '#9B9B96' }
  if (dias <= 5) return { bg: '#D4EDDA', color: '#155724' }
  if (dias <= 10) return { bg: '#FFF3CD', color: '#856404' }
  return { bg: '#F8D7DA', color: '#721C24' }
}

export function semaforoFRT(horas) {
  if (horas == null) return { bg: '#F0F0EE', color: '#9B9B96' }
  if (horas <= 24) return { bg: '#D4EDDA', color: '#155724' }
  if (horas <= 48) return { bg: '#FFF3CD', color: '#856404' }
  return { bg: '#F8D7DA', color: '#721C24' }
}

export function semaforoEscalamiento(pct) {
  if (pct <= 10) return { bg: '#D4EDDA', color: '#155724' }
  if (pct <= 20) return { bg: '#FFF3CD', color: '#856404' }
  return { bg: '#F8D7DA', color: '#721C24' }
}
