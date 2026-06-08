import { useState } from 'react'
import { CheckCircle, AlertCircle, Upload, AlertTriangle, History, Download } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { LogOut } from 'lucide-react'
import { parsearArchivoCasos, parsearArchivoVentas, generarPlantillaCasos, generarPlantillaVentas, detectarAdvertencias } from '../utils/fileParser'
import { useNav } from '../context/NavContext'
import Sidebar, { SIDEBAR_WIDTH, SIDEBAR_WIDTH_COLLAPSED } from '../components/Sidebar'

export default function CargasPage() {
  const { setCasos, setVentas, logCargas, logCargando, ultimaCarga } = useData()
  const { user, logout } = useAuth()
  const { collapsed } = useNav()
  const sidebarWidth = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH
  const [statusCasos, setStatusCasos] = useState(null)
  const [statusVentas, setStatusVentas] = useState(null)
  const [errorCasos, setErrorCasos] = useState(null)
  const [errorVentas, setErrorVentas] = useState(null)
  const [countCasos, setCountCasos] = useState(0)
  const [countVentas, setCountVentas] = useState(0)
  const [advertencias, setAdvertencias] = useState([])

  const handleCasos = async (file) => {
    setErrorCasos(null); setStatusCasos('loading')
    try {
      const data = await parsearArchivoCasos(file)
      setCasos(data, file.name); setCountCasos(data.length); setStatusCasos('ok')
      setAdvertencias(detectarAdvertencias(data))
    } catch (e) { setStatusCasos(null); setErrorCasos(e.message) }
  }

  const handleVentas = async (file) => {
    setErrorVentas(null); setStatusVentas('loading')
    try {
      const data = await parsearArchivoVentas(file)
      setVentas(data, file.name); setCountVentas(data.length); setStatusVentas('ok')
    } catch (e) { setStatusVentas(null); setErrorVentas(e.message) }
  }

  const descargar = (contenido, nombre) => {
    const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = nombre; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F5F3' }}>
      <Sidebar />
      <div style={{ marginLeft: sidebarWidth, flex: 1, display: 'flex', flexDirection: 'column', transition: 'margin-left 0.15s ease' }}>
        <header style={{
          height: 56, background: '#1C1C1A', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 24px', borderBottom: '1px solid #2E2E2B',
        }}>
          <div>
            <h1 style={{ fontSize: 15, fontWeight: 600, color: '#FFFFFF', lineHeight: 1.2 }}>Cargas</h1>
            <p style={{ fontSize: 11, color: '#6B6B67', lineHeight: 1.2 }}>Carga de datos y registro de actividad del equipo</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {user?.photo
              ? <img src={user.photo} alt="" style={{ width: 26, height: 26, borderRadius: '50%', border: '1.5px solid #3A3A36' }} />
              : <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#3A3A36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#A8D5C2' }}>{user?.name?.[0]}</div>
            }
            <span style={{ fontSize: 12, color: '#9B9B96' }}>{user?.name?.split(' ')[0]}</span>
            <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6B6B67', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: 6 }}>
              <LogOut size={13} />
            </button>
          </div>
        </header>

        <main style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 920 }}>

          {ultimaCarga && (
            <div style={{ background: '#F0FAF6', border: '1px solid #D6EFE5', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <CheckCircle size={16} color="#085041" />
              <p style={{ fontSize: 12, color: '#085041' }}>
                Lo último que tengo cargado: <strong>{ultimaCarga.detalle || 'archivo de casos'}</strong> — {ultimaCarga.cantidad} filas, por {ultimaCarga.email?.split('@')[0]} el {new Date(ultimaCarga.fecha).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' })}
              </p>
            </div>
          )}

          <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #EBEBEB', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#1C1C1A' }}>Cargar datos</p>
              <p style={{ fontSize: 11, color: '#9B9B96', marginTop: 1 }}>CSV o Excel exportado desde Dynamics 365</p>
            </div>

            <DropZone
              label="Archivo de casos (reclamos)"
              desc="Columnas requeridas: id_caso, fecha_ingreso, estado, marca, dealer, tipo_reclamo, ejecutiva, escalado"
              onFile={handleCasos}
              status={statusCasos}
              count={countCasos}
              error={errorCasos}
            />
            <DropZone
              label="Archivo de ventas (opcional)"
              desc="Habilita el módulo IRV — columnas: mes, marca, unidades_vendidas"
              onFile={handleVentas}
              status={statusVentas}
              count={countVentas}
              error={errorVentas}
              optional
            />

            {advertencias.length > 0 && (
              <div style={{ background: '#FFF8E8', border: '1px solid #F5E3B3', borderRadius: 10, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertTriangle size={14} color="#856404" />
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#856404' }}>Datos incompletos detectados</p>
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {advertencias.map((a, i) => (
                    <li key={i} style={{ fontSize: 11, color: '#6B5A2E', lineHeight: 1.4 }}>{a}</li>
                  ))}
                </ul>
                <p style={{ fontSize: 10, color: '#9B8A5C' }}>Pídele a quien carga los casos en el CRM que complete estos campos para que el reporte sea más preciso.</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
              <button onClick={() => descargar(generarPlantillaCasos(), 'plantilla_casos.csv')}
                style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6B6B67', background: '#F7F7F5', border: '1px solid #EBEBEB', borderRadius: 7, padding: '5px 10px', cursor: 'pointer' }}>
                <Download size={11} /> Plantilla casos
              </button>
              <button onClick={() => descargar(generarPlantillaVentas(), 'plantilla_ventas.csv')}
                style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6B6B67', background: '#F7F7F5', border: '1px solid #EBEBEB', borderRadius: 7, padding: '5px 10px', cursor: 'pointer' }}>
                <Download size={11} /> Plantilla ventas
              </button>
            </div>
            <p style={{ fontSize: 10, color: '#B0B0AA' }}>Los archivos se procesan localmente — ningún dato se envía a internet.</p>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #EBEBEB', padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <History size={15} color="#1C1C1A" />
              <p style={{ fontSize: 14, fontWeight: 600, color: '#1C1C1A' }}>Historial de cargas {logCargas.length > 0 && `(${logCargas.length})`}</p>
            </div>
            <div style={{ border: '1px solid #EBEBEB', borderRadius: 8, overflow: 'hidden' }}>
              {logCargando
                ? <p style={{ fontSize: 12, color: '#B0B0AA', padding: '14px 16px' }}>Cargando historial...</p>
                : logCargas.length === 0
                ? <p style={{ fontSize: 12, color: '#B0B0AA', padding: '14px 16px' }}>Sin cargas registradas todavía.</p>
                : logCargas.map((l, i) => (
                  <div key={l.id || i} style={{ padding: '10px 16px', borderBottom: i < logCargas.length - 1 ? '1px solid #F5F5F3' : 'none', display: 'flex', justifyContent: 'space-between', gap: 10, background: i % 2 === 0 ? '#FFFFFF' : '#FAFAF9' }}>
                    <div>
                      <p style={{ fontSize: 12, color: '#1C1C1A', fontWeight: 500 }}>
                        {l.tipo === 'casos' ? 'Casos' : l.tipo === 'casos_anterior' ? 'Casos (periodo anterior)' : 'Ventas'}
                        {l.detalle ? ` — ${l.detalle}` : ''}
                      </p>
                      <p style={{ fontSize: 11, color: '#9B9B96' }}>
                        {new Date(l.fecha).toLocaleString('es-CL')} · {l.email?.split('@')[0] || 'usuario'}
                      </p>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#6B6B67', background: '#F5F5F3', borderRadius: 20, padding: '2px 9px', height: 'fit-content' }}>{l.cantidad} filas</span>
                  </div>
                ))
              }
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function DropZone({ label, desc, onFile, status, count, error, optional }) {
  const [drag, setDrag] = useState(false)

  const handle = (file) => {
    if (!file) return
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['csv', 'xlsx', 'xls'].includes(ext)) return
    onFile(file)
  }

  return (
    <div
      onClick={() => document.getElementById(`upload-page-${label}`)?.click()}
      onDragOver={e => { e.preventDefault(); setDrag(true) }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]) }}
      style={{
        border: `1.5px dashed ${drag ? '#A8D5C2' : status === 'ok' ? '#A8D5C2' : error ? '#F8D7DA' : '#E0E0DC'}`,
        borderRadius: 10, padding: '14px 16px', cursor: 'pointer',
        background: drag ? '#F0FAF6' : status === 'ok' ? '#F5FBF8' : '#FAFAF9',
        transition: 'all 0.15s',
      }}
    >
      <input id={`upload-page-${label}`} type="file" accept=".csv,.xlsx,.xls" style={{ display: 'none' }}
        onChange={e => handle(e.target.files[0])} />
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ marginTop: 1 }}>
          {status === 'ok'
            ? <CheckCircle size={16} color="#085041" />
            : error ? <AlertCircle size={16} color="#721C24" />
            : <Upload size={16} color="#9B9B96" />
          }
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: '#1C1C1A' }}>{label}</p>
            {optional && <span style={{ fontSize: 10, color: '#9B9B96', background: '#F0F0EE', borderRadius: 4, padding: '1px 6px' }}>Opcional</span>}
            {status === 'ok' && <span style={{ fontSize: 10, fontWeight: 600, color: '#085041', background: '#D4EDDA', borderRadius: 20, padding: '1px 8px' }}>{count} filas</span>}
          </div>
          {error
            ? <p style={{ fontSize: 11, color: '#721C24', marginTop: 2 }}>{error}</p>
            : <p style={{ fontSize: 11, color: '#9B9B96', marginTop: 2 }}>{desc}</p>
          }
        </div>
      </div>
    </div>
  )
}
