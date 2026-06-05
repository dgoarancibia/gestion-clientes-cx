import Papa from 'papaparse'
import * as XLSX from 'xlsx'

const COLUMNAS_CASOS = ['id_caso', 'fecha_ingreso', 'estado', 'marca', 'dealer', 'tipo_reclamo', 'ejecutiva', 'escalado']
const COLUMNAS_VENTAS = ['mes', 'marca', 'unidades_vendidas']

function normalizarKey(str) {
  return str.toLowerCase().trim()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '_')
}

function normalizarFila(fila) {
  const result = {}
  for (const [k, v] of Object.entries(fila)) {
    result[normalizarKey(k)] = typeof v === 'string' ? v.trim() : v
  }
  return result
}

function validarColumnas(filas, requeridas) {
  if (!filas.length) return { ok: false, faltantes: requeridas }
  const keys = Object.keys(filas[0])
  const faltantes = requeridas.filter(c => !keys.includes(c))
  return { ok: faltantes.length === 0, faltantes }
}

function parsearCSV(texto) {
  const result = Papa.parse(texto, { header: true, skipEmptyLines: true })
  return result.data.map(normalizarFila)
}

function parsearExcel(buffer) {
  const wb = XLSX.read(buffer, { type: 'array', cellDates: true })
  const ws = wb.Sheets[wb.SheetNames[0]]
  const data = XLSX.utils.sheet_to_json(ws, { defval: '' })
  return data.map(normalizarFila)
}

export async function parsearArchivoCasos(file) {
  const ext = file.name.split('.').pop().toLowerCase()
  let filas

  if (ext === 'csv') {
    const texto = await file.text()
    filas = parsearCSV(texto)
  } else {
    const buffer = await file.arrayBuffer()
    filas = parsearExcel(buffer)
  }

  const { ok, faltantes } = validarColumnas(filas, COLUMNAS_CASOS)
  if (!ok) throw new Error(`Columnas faltantes: ${faltantes.join(', ')}`)

  return filas.map(f => ({
    ...f,
    escalado: f.escalado === true || String(f.escalado).toLowerCase() === 'true' || f.escalado === '1',
    reabierto: f.reabierto === true || String(f.reabierto).toLowerCase() === 'true' || f.reabierto === '1',
  }))
}

export async function parsearArchivoVentas(file) {
  const ext = file.name.split('.').pop().toLowerCase()
  let filas

  if (ext === 'csv') {
    const texto = await file.text()
    filas = parsearCSV(texto)
  } else {
    const buffer = await file.arrayBuffer()
    filas = parsearExcel(buffer)
  }

  const { ok, faltantes } = validarColumnas(filas, COLUMNAS_VENTAS)
  if (!ok) throw new Error(`Columnas faltantes: ${faltantes.join(', ')}`)

  return filas.map(f => ({
    ...f,
    unidades_vendidas: Number(f.unidades_vendidas) || 0,
  }))
}

export function generarPlantillaCasos() {
  const headers = 'id_caso,fecha_ingreso,fecha_cierre,fecha_primera_respuesta,estado,marca,dealer,tipo_reclamo,ejecutiva,escalado,reabierto,contactos'
  const rows = [
    'C-001,2026-06-01,2026-06-03,,cerrado,Kia,Santiago Centro,postventa,Ana López,false,false,2',
    'C-002,2026-06-02,,, abierto,Hyundai,Las Condes,garantia,María Soto,true,false,1',
    'C-003,2026-06-03,2026-06-05,,cerrado,Kia,Providencia,venta,Ana López,false,true,3',
  ]
  return [headers, ...rows].join('\n')
}

export function generarPlantillaVentas() {
  const headers = 'mes,marca,unidades_vendidas'
  const rows = [
    '2026-06,Kia,85',
    '2026-06,Hyundai,62',
    '2026-06,Otras,28',
  ]
  return [headers, ...rows].join('\n')
}
