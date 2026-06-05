const ejecutivas = ['Ana López', 'María Soto', 'Carla Vega', 'Patricia Rojas']
const marcas = ['Kia', 'Hyundai', 'Otras']
const dealers = ['Santiago Centro', 'Las Condes', 'Providencia', 'Maipú', 'San Bernardo']
const tipos = ['postventa', 'garantia', 'venta', 'tecnico', 'admin']
const estados = ['cerrado', 'cerrado', 'cerrado', 'abierto']

function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}
function fmt(d) { return d.toISOString().split('T')[0] }

function generarCasos(cantidad, baseDate, idOffset = 0) {
  const casos = []
  for (let i = 1; i <= cantidad; i++) {
    const diasAtras = Math.floor(Math.random() * 30)
    const fechaIngreso = addDays(baseDate, -diasAtras)
    const estado = randomItem(estados)
    const diasResolucion = Math.floor(Math.random() * 12) + 1
    const fechaCierre = estado === 'cerrado' ? fmt(addDays(fechaIngreso, diasResolucion)) : null
    casos.push({
      id_caso: `C-${String(i + idOffset).padStart(3, '0')}`,
      fecha_ingreso: fmt(fechaIngreso),
      fecha_cierre: fechaCierre,
      fecha_primera_respuesta: fmt(addDays(fechaIngreso, Math.random() < 0.5 ? 0 : 1)),
      estado,
      marca: randomItem(marcas),
      dealer: randomItem(dealers),
      tipo_reclamo: randomItem(tipos),
      ejecutiva: randomItem(ejecutivas),
      escalado: Math.random() < 0.18,
      reabierto: estado === 'cerrado' && Math.random() < 0.08,
      contactos: Math.floor(Math.random() * 4) + 1,
    })
  }
  return casos
}

export function generarDatosDummy() {
  // Mes actual: junio 2026 — 120 casos
  const casosActual = generarCasos(120, new Date('2026-06-05'), 0)
  // Mes anterior: mayo 2026 — 98 casos (menos volumen, peor ART)
  const casosAnterior = generarCasos(98, new Date('2026-05-01'), 200)

  const ventas = [
    { mes: '2026-05', marca: 'Kia', unidades_vendidas: 78 },
    { mes: '2026-05', marca: 'Hyundai', unidades_vendidas: 54 },
    { mes: '2026-05', marca: 'Otras', unidades_vendidas: 22 },
    { mes: '2026-06', marca: 'Kia', unidades_vendidas: 85 },
    { mes: '2026-06', marca: 'Hyundai', unidades_vendidas: 61 },
    { mes: '2026-06', marca: 'Otras', unidades_vendidas: 31 },
  ]

  return { casos: casosActual, casosAnterior, ventas }
}
