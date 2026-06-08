import Papa from 'papaparse'
import * as XLSX from 'xlsx'

// Columnas requeridas del export real de Dynamics 365
const COLUMNAS_REQUERIDAS = ['Número de caso', 'Fecha de creación', 'Marca', 'Fase del caso', 'Tipo de caso']

function excelDateToStr(n) {
  if (!n || typeof n !== 'number') return null
  const d = new Date(Math.round((n - 25569) * 86400 * 1000))
  return d.toISOString().split('T')[0]
}

function normalizarFila(row) {
  return {
    id_caso: row['Número de caso'] || row['Número Caso'] || '',
    fecha_ingreso: excelDateToStr(row['Fecha de creación']) || row['Fecha de creación'] || '',
    fecha_cierre: excelDateToStr(row['Fecha Cierre']) || null,
    estado: row['Fase del caso'] || '',
    tipo_caso: row['Tipo de caso'] || '',
    area: row['Área responsable'] || '',
    marca: row['Marca'] || '',
    dealer: row['Concesionario'] || row['Dealer'] || '',
    ejecutiva: row['Ejecutivo Centro Cliente'] || '',
    motivo: row['Motivo'] || '',
    sub_motivo: row['Sub-Motivo'] || '',
    origen: row['Origen'] || '',
    antigüedad: parseInt(row['Antigüedad del caso']) || null,
    primera_respuesta_enviada: row['Primera respuesta enviada'] === 'Sí' || row['Primera respuesta enviada'] === 'Si' || false,
    estado_sla: row['Estado de SLA de la primera respuesta'] || '',
    escalado: row['Se ha remitido a una instancia superior'] === 'Sí',
    estado_caso: row['Estado del Caso'] || '',
  }
}

export async function parsearArchivoCasos(file) {
  const ext = file.name.split('.').pop().toLowerCase()
  let rows

  if (ext === 'csv') {
    const texto = await file.text()
    const result = Papa.parse(texto, { header: true, skipEmptyLines: true })
    rows = result.data
  } else {
    const buffer = await file.arrayBuffer()
    const wb = XLSX.read(buffer, { type: 'array', cellDates: false })
    const ws = wb.Sheets[wb.SheetNames[0]]
    rows = XLSX.utils.sheet_to_json(ws, { defval: null })
  }

  // Validar columnas mínimas
  if (!rows.length) throw new Error('El archivo está vacío')
  const keys = Object.keys(rows[0])
  const faltantes = COLUMNAS_REQUERIDAS.filter(c => !keys.includes(c))
  if (faltantes.length) throw new Error(`Columnas faltantes: ${faltantes.join(', ')}`)

  return rows.map(normalizarFila).filter(r => r.id_caso && r.fecha_ingreso && r.tipo_caso !== 'Felicitaciones')
}

export async function parsearArchivoVentas(file) {
  const ext = file.name.split('.').pop().toLowerCase()
  let rows

  if (ext === 'csv') {
    const texto = await file.text()
    rows = Papa.parse(texto, { header: true, skipEmptyLines: true }).data
  } else {
    const buffer = await file.arrayBuffer()
    const wb = XLSX.read(buffer, { type: 'array' })
    rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' })
  }

  return rows.map(r => ({
    mes: r['mes'] || r['Mes'] || '',
    marca: r['marca'] || r['Marca'] || '',
    unidades_vendidas: Number(r['unidades_vendidas'] || r['Unidades vendidas'] || 0),
  })).filter(r => r.mes && r.marca)
}

// Detecta campos clave que vienen vacíos/incompletos en la carga real,
// para avisarle al equipo qué debería estar completando en el CRM.
export function detectarAdvertencias(casos) {
  const total = casos.length
  if (!total) return []

  const pct = (n) => Math.round((n / total) * 100)
  const avisos = []

  const sinEjecutiva = casos.filter(c => !c.ejecutiva).length
  if (sinEjecutiva > 0) {
    avisos.push(`${sinEjecutiva} casos (${pct(sinEjecutiva)}%) sin "Ejecutivo Centro Cliente" asignado — afecta la tabla de Performance del equipo.`)
  }

  const sinMotivo = casos.filter(c => !c.motivo).length
  if (sinMotivo > 0) {
    avisos.push(`${sinMotivo} casos (${pct(sinMotivo)}%) sin "Motivo" registrado — afecta la distribución por motivo.`)
  }

  const sinArea = casos.filter(c => !c.area).length
  if (sinArea > 0) {
    avisos.push(`${sinArea} casos (${pct(sinArea)}%) sin "Área responsable" — afecta el cálculo de "Área más activa".`)
  }

  const cerrados = casos.filter(c => c.estado_caso === 'Problema resuelto' || c.fecha_cierre)
  const cerradosSinFechaCierre = casos.filter(c => !c.fecha_cierre && (c.estado === 'Cerrado' || c.estado === 'Problema resuelto' || c.estado === 'Problema resuelto - Sin Encuesta' || c.estado === 'Termina Caso'))
  if (cerradosSinFechaCierre.length > 0) {
    avisos.push(`${cerradosSinFechaCierre.length} casos cerrados sin "Fecha Cierre" — el ART se calcula con "Antigüedad del caso" como respaldo, pero registrar la fecha de cierre da un dato más preciso.`)
  }

  const sinAntiguedad = casos.filter(c => c.antigüedad == null).length
  if (sinAntiguedad > 0) {
    avisos.push(`${sinAntiguedad} casos (${pct(sinAntiguedad)}%) sin "Antigüedad del caso" — sin este dato no se puede calcular el ART ni el aging.`)
  }

  return avisos
}

export function generarPlantillaCasos() {
  const h = 'Número de caso,Fecha de creación,Marca,Fase del caso,Tipo de caso,Área responsable,Concesionario,Ejecutivo Centro Cliente,Motivo,Sub-Motivo,Origen,Antigüedad del caso,Primera respuesta enviada,Estado de SLA de la primera respuesta,Se ha remitido a una instancia superior,Estado del Caso,Fecha Cierre'
  const rows = [
    'T-00001,2026-06-01,KIA,En Curso,Reclamo,Servicio Técnico,Rosselot - Santiago,Marcela Ayestas Estrada,Fallas o anomalías,,Sitio Web,5,No,En curso,No,Sin Gestión,',
    'T-00002,2026-06-02,HYUNDAI,Cerrado,Consulta,Ventas,Salfa - Las Condes,Pamela Quezada Cerda,Proceso Venta,,Teléfono,2,Sí,Cumplido,No,Problema resuelto,2026-06-04',
  ]
  return [h, ...rows].join('\n')
}

export function generarPlantillaVentas() {
  return 'mes,marca,unidades_vendidas\n2026-06,KIA,85\n2026-06,HYUNDAI,61\n2026-06,Otras,31'
}
