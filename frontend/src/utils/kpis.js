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
  const cerrados = casos.filter(c => c.estado === 'cerrado' && c.fecha_cierre)
  const abiertos = casos.filter(c => c.estado === 'abierto' || !c.fecha_cierre)
  const escalados = casos.filter(c => c.escalado)
  const reabiertos = casos.filter(c => c.reabierto)

  // ART — promedio días hábiles resolución
  const arts = cerrados
    .map(c => diasHabiles(c.fecha_ingreso, c.fecha_cierre))
    .filter(d => d >= 0)
  const art = arts.length ? arts.reduce((a, b) => a + b, 0) / arts.length : 0

  // FRT — promedio horas primera respuesta
  const frts = casos
    .filter(c => c.fecha_primera_respuesta)
    .map(c => {
      const diff = new Date(c.fecha_primera_respuesta) - new Date(c.fecha_ingreso)
      return diff / (1000 * 60 * 60)
    })
    .filter(h => h >= 0)
  const frt = frts.length ? frts.reduce((a, b) => a + b, 0) / frts.length : null

  // Tasa escalamiento
  const tasaEscalamiento = total ? (escalados.length / total) * 100 : 0

  // Tasa reapertura
  const tasaReapertura = cerrados.length ? (reabiertos.length / cerrados.length) * 100 : 0

  // Distribución por tipo
  const porTipo = {}
  for (const c of casos) {
    porTipo[c.tipo_reclamo] = (porTipo[c.tipo_reclamo] || 0) + 1
  }

  // Aging casos abiertos
  const hoy = new Date()
  const aging = { '0-2': 0, '3-5': 0, '6-10': 0, '+10': [] }
  for (const c of abiertos) {
    const dias = diasHabiles(c.fecha_ingreso, hoy)
    if (dias <= 2) aging['0-2']++
    else if (dias <= 5) aging['3-5']++
    else if (dias <= 10) aging['6-10']++
    else aging['+10'].push({ ...c, dias })
  }

  // Performance por ejecutiva
  const ejecutivaMap = {}
  for (const c of casos) {
    if (!ejecutivaMap[c.ejecutiva]) ejecutivaMap[c.ejecutiva] = { asignados: 0, cerrados: 0, arts: [] }
    ejecutivaMap[c.ejecutiva].asignados++
    if (c.estado === 'cerrado' && c.fecha_cierre) {
      ejecutivaMap[c.ejecutiva].cerrados++
      ejecutivaMap[c.ejecutiva].arts.push(diasHabiles(c.fecha_ingreso, c.fecha_cierre))
    }
  }
  const ejecutivas = Object.entries(ejecutivaMap).map(([nombre, d]) => ({
    nombre,
    asignados: d.asignados,
    cerrados: d.cerrados,
    art: d.arts.length ? d.arts.reduce((a, b) => a + b, 0) / d.arts.length : 0,
    pct: total ? (d.asignados / total) * 100 : 0,
  }))

  return {
    total,
    cerrados: cerrados.length,
    abiertos: abiertos.length,
    escalados: escalados.length,
    art: Math.round(art * 10) / 10,
    frt: frt !== null ? Math.round(frt * 10) / 10 : null,
    tasaEscalamiento: Math.round(tasaEscalamiento * 10) / 10,
    tasaReapertura: Math.round(tasaReapertura * 10) / 10,
    porTipo,
    aging,
    ejecutivas,
    artPromedio: Math.round(art * 10) / 10,
  }
}

export function semaforoART(dias) {
  if (dias <= 5) return { bg: '#D4EDDA', color: '#155724' }
  if (dias <= 8) return { bg: '#FFF3CD', color: '#856404' }
  return { bg: '#F8D7DA', color: '#721C24' }
}

export function semaforoFRT(horas) {
  if (horas <= 24) return { bg: '#D4EDDA', color: '#155724' }
  if (horas <= 48) return { bg: '#FFF3CD', color: '#856404' }
  return { bg: '#F8D7DA', color: '#721C24' }
}

export function semaforoEscalamiento(pct) {
  if (pct <= 15) return { bg: '#D4EDDA', color: '#155724' }
  if (pct <= 25) return { bg: '#FFF3CD', color: '#856404' }
  return { bg: '#F8D7DA', color: '#721C24' }
}
