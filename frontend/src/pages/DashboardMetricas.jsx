import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useData } from '../context/DataContext'
import { calcularKPIs, semaforoART, semaforoFRT, semaforoEscalamiento } from '../utils/kpis'
import KPICard from '../components/KPICard'

const COLORES_TIPO = ['#A8D5C2', '#B5D4F4', '#CECBF6', '#FAC775', '#F4C5C5', '#C5E4F4']

export default function DashboardMetricas() {
  const { casosFiltrados } = useData()
  const kpis = calcularKPIs(casosFiltrados)

  const tipoPieData = Object.entries(kpis.porTipo).map(([name, value]) => ({ name, value }))

  const agingData = [
    { rango: '0–2 días', cantidad: kpis.aging['0-2'], fill: '#D4EDDA' },
    { rango: '3–5 días', cantidad: kpis.aging['3-5'], fill: '#FFF3CD' },
    { rango: '6–10 días', cantidad: kpis.aging['6-10'], fill: '#FAC775' },
    { rango: '+10 días', cantidad: kpis.aging['+10'].length, fill: '#F8D7DA' },
  ]

  return (
    <div className="px-6 py-6" style={{ maxWidth: '100%' }}>

      {/* KPIs principales — fila única */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
        <KPICard titulo="Casos ingresados" valor={kpis.total} subtitulo="En el período"
          tooltip="Total de casos recibidos en el período seleccionado, independiente de su estado." />
        <KPICard titulo="Casos cerrados" valor={kpis.cerrados} subtitulo={`${kpis.total ? Math.round(kpis.cerrados / kpis.total * 100) : 0}% del total`}
          tooltip="Casos que tienen fecha de cierre dentro del período. Indica la capacidad de resolución del equipo." />
        <KPICard titulo="Backlog activo" valor={kpis.abiertos} subtitulo="Sin fecha de cierre"
          tooltip="Casos aún abiertos — sin fecha de cierre registrada. Un backlog alto puede indicar cuellos de botella." />
        <KPICard titulo="Reapertura" valor={`${kpis.tasaReapertura}%`} subtitulo="Sobre cerrados"
          tooltip="Porcentaje de casos que fueron cerrados y luego reabiertos. Una tasa alta indica resoluciones incompletas." />
        <KPICard
          titulo="ART"
          valor={kpis.art}
          unidad="días háb."
          semaforo={{ ...semaforoART(kpis.art), label: kpis.art <= 5 ? 'En SLA' : kpis.art <= 8 ? 'En riesgo' : 'Fuera SLA' }}
          tooltip="Average Resolution Time: promedio de días hábiles entre el ingreso y el cierre de un caso. Meta: ≤ 5 días."
        />
        <KPICard
          titulo="FRT"
          valor={kpis.frt !== null ? kpis.frt : '—'}
          unidad={kpis.frt !== null ? 'hrs' : ''}
          semaforo={kpis.frt !== null ? { ...semaforoFRT(kpis.frt), label: kpis.frt <= 24 ? 'En SLA' : kpis.frt <= 48 ? 'En riesgo' : 'Fuera SLA' } : null}
          subtitulo={kpis.frt === null ? 'Sin datos' : null}
          tooltip="First Response Time: tiempo promedio en horas desde que ingresa un caso hasta la primera respuesta al cliente. Meta: ≤ 24 hrs."
        />
      </div>

      {/* Sección: Calidad + Distribución por tipo */}
      <SectionTitle color="#A8D5C2">Calidad de resolución</SectionTitle>
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ background: '#FFFFFF', borderRadius: 12, border: '0.5px solid #E8E6E0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', padding: '20px 24px' }}>
          <p style={{ fontSize: 12, color: '#73726C', marginBottom: 8 }}>Tasa de escalamiento</p>
          <div className="flex items-end gap-2 mb-2">
            <span style={{ fontSize: 28, fontWeight: 500, color: '#2C2C2A', lineHeight: 1 }}>{kpis.tasaEscalamiento}%</span>
            <span style={{ fontSize: 13, color: '#73726C', marginBottom: 2 }}>{kpis.escalados} casos</span>
          </div>
          <span style={{
            display: 'inline-block', fontSize: 12, fontWeight: 500,
            ...semaforoEscalamiento(kpis.tasaEscalamiento),
            borderRadius: 20, padding: '2px 10px',
          }}>
            {kpis.tasaEscalamiento <= 15 ? 'Normal' : kpis.tasaEscalamiento <= 25 ? 'Elevado' : 'Crítico'}
          </span>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 12, border: '0.5px solid #E8E6E0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', padding: '20px 24px' }}>
          <p style={{ fontSize: 12, color: '#73726C', marginBottom: 12 }}>Distribución por tipo de reclamo</p>
          {tipoPieData.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={tipoPieData} cx={65} cy={65} innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={2}>
                    {tipoPieData.map((_, i) => <Cell key={i} fill={COLORES_TIPO[i % COLORES_TIPO.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [`${v} casos`, n]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-1.5">
                {tipoPieData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: COLORES_TIPO[i % COLORES_TIPO.length], flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#2C2C2A' }}>{d.name}</span>
                    <span style={{ fontSize: 12, color: '#73726C' }}>({d.value})</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p style={{ fontSize: 13, color: '#73726C' }}>Sin datos</p>
          )}
        </div>
      </div>

      {/* Sección: Aging */}
      <SectionTitle color="#FAC775">Aging de casos abiertos</SectionTitle>
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ background: '#FFFFFF', borderRadius: 12, border: '0.5px solid #E8E6E0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', padding: '20px 24px' }}>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={agingData} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid horizontal={false} stroke="#E8E6E0" strokeWidth={0.5} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#73726C' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="rango" tick={{ fontSize: 12, fill: '#2C2C2A' }} axisLine={false} tickLine={false} width={70} />
              <Tooltip formatter={(v) => [`${v} casos`]} />
              <Bar dataKey="cantidad" radius={[0, 4, 4, 0]}>
                {agingData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {kpis.aging['+10'].length > 0 ? (
          <div style={{ background: '#FFFFFF', borderRadius: 12, border: '0.5px solid #E8E6E0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', padding: '20px 24px', overflowY: 'auto', maxHeight: 240 }}>
            <p style={{ fontSize: 12, color: '#73726C', marginBottom: 10 }}>Casos críticos (+10 días)</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#F3F2EE' }}>
                  {['ID', 'Ingreso', 'Tipo', 'Ejecutiva', 'Días'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '4px 8px', fontWeight: 500, color: '#2C2C2A' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {kpis.aging['+10'].sort((a, b) => a.dias - b.dias).map((c, i) => (
                  <tr key={c.id_caso} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#FAFAF8' }}>
                    <td style={{ padding: '4px 8px', color: '#2C2C2A' }}>{c.id_caso}</td>
                    <td style={{ padding: '4px 8px', color: '#73726C' }}>{c.fecha_ingreso}</td>
                    <td style={{ padding: '4px 8px', color: '#73726C' }}>{c.tipo_reclamo}</td>
                    <td style={{ padding: '4px 8px', color: '#73726C' }}>{c.ejecutiva}</td>
                    <td style={{ padding: '4px 8px' }}>
                      <span style={{ background: '#F8D7DA', color: '#721C24', borderRadius: 20, padding: '1px 8px', fontWeight: 500 }}>{c.dias}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ background: '#FFFFFF', borderRadius: 12, border: '0.5px solid #E8E6E0', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 13, color: '#73726C' }}>Sin casos críticos en el período</span>
          </div>
        )}
      </div>

      {/* Sección: Ejecutivas */}
      <SectionTitle color="#CECBF6">Performance del equipo</SectionTitle>
      <div style={{ background: '#FFFFFF', borderRadius: 12, border: '0.5px solid #E8E6E0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', padding: '20px 24px', marginBottom: 32 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#F3F2EE' }}>
              {['Ejecutiva', 'Asignados', 'Cerrados', 'ART individual', '% del total', 'Distribución'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 500, color: '#2C2C2A', fontSize: 12 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {kpis.ejecutivas.sort((a, b) => b.asignados - a.asignados).map((e, i) => {
              const sem = semaforoART(e.art)
              const vsProm = kpis.artPromedio > 0 ? ((e.art - kpis.artPromedio) / kpis.artPromedio) * 100 : 0
              const artSem = vsProm > 20 ? { bg: '#F8D7DA', color: '#721C24' } : vsProm > 0 ? { bg: '#FFF3CD', color: '#856404' } : { bg: '#D4EDDA', color: '#155724' }
              return (
                <tr key={e.nombre} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#FAFAF8' }}>
                  <td style={{ padding: '8px 12px', color: '#2C2C2A', fontWeight: 500 }}>{e.nombre}</td>
                  <td style={{ padding: '8px 12px', color: '#2C2C2A' }}>{e.asignados}</td>
                  <td style={{ padding: '8px 12px', color: '#73726C' }}>{e.cerrados}</td>
                  <td style={{ padding: '8px 12px' }}>
                    <span style={{ background: artSem.bg, color: artSem.color, borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 500 }}>
                      {e.art.toFixed(1)} días
                    </span>
                  </td>
                  <td style={{ padding: '8px 12px', color: '#73726C' }}>{e.pct.toFixed(1)}%</td>
                  <td style={{ padding: '8px 12px', minWidth: 120 }}>
                    <div style={{ background: '#F3F2EE', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                      <div style={{ width: `${e.pct}%`, background: '#CECBF6', height: '100%', borderRadius: 4 }} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p style={{ fontSize: 11, color: '#73726C', marginTop: 10 }}>
          El ART individual puede variar según la complejidad de los casos asignados.
        </p>
      </div>
    </div>
  )
}

function SectionTitle({ children, color }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
      <h2 style={{ fontSize: 13, fontWeight: 500, color: '#73726C', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{children}</h2>
    </div>
  )
}
