const ejecutivas = [
  'Marcela Ayestas Estrada', 'Pamela Quezada Cerda',
  'Gisela Pentenero Rojas', 'Karina Rodriguez Cofre',
  'Dayana Jofre Ardiles',
]
const marcas = ['KIA', 'HYUNDAI', 'Otras']
const dealers = ['Rosselot - Santiago', 'Salfa - Las Condes', 'Kaufmann - Providencia', 'Rosselot - Talca', 'Salfa - Maipú']
const tipos = ['Reclamo', 'Consulta', 'Garantía', 'Felicitaciones', 'Sugerencia']
const areas = ['Servicio Técnico', 'Ventas', 'Gestión Clientes', 'Repuestos y accesorios', 'Contact center']
const motivos = ['Fallas o anomalías', 'Proceso Venta', 'Mantención', 'Condiciones del Negocio', 'Proceso Servicio', 'Garantía']
const origenes = ['Sitio Web', 'Teléfono', 'Correo electrónico', 'Presencial']
const fasesAbiertas = ['En Curso', 'En espera de respuesta Responsable', 'Validación cierre', 'En Proceso', 'Solución Entregada a Cliente', 'Sin Gestión']
const fasesCerradas = ['Cerrado', 'Problema resuelto', 'Problema resuelto - Sin Encuesta']

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function addDays(date, days) { const d = new Date(date); d.setDate(d.getDate() + days); return d }
function fmt(d) { return d.toISOString().split('T')[0] }

function generarCasos(cantidad, baseDate, idOffset = 0) {
  const casos = []
  for (let i = 1; i <= cantidad; i++) {
    const diasAtras = Math.floor(Math.random() * 30)
    const fechaIngreso = addDays(baseDate, -diasAtras)
    const cerrado = Math.random() > 0.35
    const estado = cerrado ? rand(fasesCerradas) : rand(fasesAbiertas)
    const antiguedad = Math.floor(Math.random() * 20) + 1
    const fechaCierre = cerrado ? fmt(addDays(fechaIngreso, antiguedad)) : null

    casos.push({
      id_caso: `T-${String(i + idOffset).padStart(5, '0')}`,
      fecha_ingreso: fmt(fechaIngreso),
      fecha_cierre: fechaCierre,
      estado,
      tipo_caso: rand(tipos),
      area: rand(areas),
      marca: rand(marcas),
      dealer: rand(dealers),
      ejecutiva: rand(ejecutivas),
      motivo: rand(motivos),
      sub_motivo: '',
      origen: rand(origenes),
      antigüedad: antiguedad,
      primera_respuesta_enviada: Math.random() > 0.3,
      estado_sla: Math.random() > 0.5 ? 'Cumplido' : 'En curso',
      escalado: Math.random() < 0.12,
      estado_caso: cerrado ? 'Problema resuelto' : 'Sin Gestión',
    })
  }
  return casos
}

export function generarDatosDummy() {
  const casos = generarCasos(120, new Date('2026-06-05'), 0)
  const casosAnterior = generarCasos(98, new Date('2026-05-01'), 200)
  return { casos, casosAnterior, ventas: [] }
}
