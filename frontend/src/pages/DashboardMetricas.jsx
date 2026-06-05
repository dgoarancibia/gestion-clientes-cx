import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useData } from '../context/DataContext'
import { calcularKPIs, semaforoART, semaforoFRT, semaforoEscalamiento } from '../utils/kpis'
import { useState } from 'react'
import { TrendingUp, TrendingDown, Minus, HelpCircle } from 'lucide-react'

const COLORES = ['#A8D5C2', '#B5D4F4', '#CECBF6', '#FAC775', '#F4C5C5', '#C5E4F4']

export default function DashboardMetricas() {
  const { casosFiltrados } = useData()
  const kpis = calcularKPIs(casosFiltrados)

  const marcaData = Object.entries(
    casosFiltrados.reduce((acc, c) => { acc[c.marca] = (acc[c.marca] || 0) + 1; return acc }, {})
  ).map(([marca, cantidad]) => ({
    marca, cantidad,
    pct: casosFiltrados.length ? Math.round(cantidad / casosFiltrados.length * 100) : 0,
  })).sort((a, b) => b.cantidad - a.cantidad)

  const tipoPieData = Object.entries(kpis.porTipo).map(([name, value]) => ({ name, value }))

  const agingData = [
    { rango: '0–2 días', cantidad: kpis.aging['0-2'], fill: '#D4EDDA' },
    { rango: '3–5 días', cantidad: kpis.aging['3-5'], fill: '#FFF3CD' },
    { rango: '6–10 días', cantidad: kpis.aging['6-10'], fill: '#FAC775' },
    { rango: '+10 días', cantidad: kpis.aging['+10'].length, fill: '#F8D7DA' },
  ]

  return (
    <div style={{ padding: '24px 28px', maxWidth: '100%' }}>

      {/* Fila 1: KPIs de volumen */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
        <StatCard
          label="Casos ingresados"
          value={kpis.total}
          sub="En el período"
          tooltip="Total de casos recibidos en el período, independiente de su estado."
          accent="#A8D5C2"
        />
        <StatCard
          label="Casos cerrados"
          value={kpis.cerrados}
          sub={`${kpis.total ? Math.round(kpis.cerrados / kpis.total * 100) : 0}% del total`}
          tooltip="Casos con fecha de cierre en el período. Indica la capacidad de resolución."
          accent="#B5D4F4"
        />
        <StatCard
          label="Backlog activo"
          value={kpis.abiertos}
          sub="Sin fecha de cierre"
          tooltip="Casos aún abiertos. Un backlog alto puede indicar cuellos de botella."
          accent="#FAC775"
          alertHigh={kpis.abiertos > 20}
        />
        <StatCard
          label="Reapertura"
          value={kpis.cerrados === 0 ? '—' : `${kpis.tasaReapertura}%`}
          sub={kpis.cerrados === 0 ? 'Sin casos cerrados' : 'Sobre casos cerrados'}
          tooltip="% de casos cerrados que fueron reabiertos. Alta tasa indica resoluciones incompletas."
          accent="#CECBF6"
        />
      </div>

      {/* Fila 2: SLA + Escalamiento + Marca */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: 16, marginBottom: 16 }}>
        <SLACard
          label="ART — Tiempo de resolución"
          value={kpis.art}
          unit="días hábiles"
          semaforo={semaforoART(kpis.art)}
          slaLabel={kpis.art <= 5 ? 'Dentro del SLA' : kpis.art <= 8 ? 'En riesgo' : 'Fuera del SLA'}
          tooltip="Average Resolution Time: promedio de días hábiles entre ingreso y cierre. Meta: ≤ 5 días."
        />
        <SLACard
          label="FRT — Primera respuesta"
          value={kpis.frt !== null ? kpis.frt : '—'}
          unit={kpis.frt !== null ? 'horas' : ''}
          semaforo={kpis.frt !== null ? semaforoFRT(kpis.frt) : null}
          slaLabel={kpis.frt === null ? null : kpis.frt <= 24 ? 'Dentro del SLA' : kpis.frt <= 48 ? 'En riesgo' : 'Fuera del SLA'}
          tooltip="First Response Time: promedio de horas hasta la primera respuesta. Meta: ≤ 24 hrs."
          noData={kpis.frt === null}
        />
        <Card title="Distribución por marca">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
            {marcaData.map((m, i) => (
              <div key={m.marca} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, color: '#4A4A46', width: 70, flexShrink: 0 }}>{m.marca}</span>
                <div style={{ flex: 1, background: '#F0F0EE', borderRadius: 4, height: 7, overflow: 'hidden' }}>
                  <div style={{ width: `${m.pct}%`, height: '100%', borderRadius: 4, background: COLORES[i % COLORES.length], transition: 'width 0.4s ease' }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#1C1C1A', width: 32, textAlign: 'right' }}>{m.pct}%</span>
                <span style={{ fontSize: 11, color: '#9B9B96', width: 50, textAlign: 'right' }}>{m.cantidad} casos</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Fila 3: Calidad — escalamiento + tipo */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: 16, marginBottom: 16 }}>
        <Card title="Escalamiento" tooltip="Casos que requirieron escalar a un nivel superior. Meta: ≤ 15%.">
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, margin: '8px 0 6px' }}>
            <span style={{ fontSize: 36, fontWeight: 700, color: '#1C1C1A', lineHeight: 1 }}>{kpis.tasaEscalamiento}%</span>
            <span style={{ fontSize: 13, color: '#9B9B96', marginBottom: 4 }}>{kpis.escalados} casos</span>
          </div>
          <Badge {...semaforoEscalamiento(kpis.tasaEscalamiento)}>
            {kpis.tasaEscalamiento <= 15 ? 'Normal' : kpis.tasaEscalamiento <= 25 ? 'Elevado' : 'Crítico'}
          </Badge>
        </Card>

        <Card title="Tipos de reclamo">
          {tipoPieData.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4 }}>
              <ResponsiveContainer width={130} height={130}>
                <PieChart>
                  <Pie data={tipoPieData} cx={60} cy={60} innerRadius={35} outerRadius={58} dataKey="value" paddingAngle={2}>
                    {tipoPieData.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [`${v} casos`, n]} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                {tipoPieData.sort((a, b) => b.value - a.value).map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: COLORES[i % COLORES.length], flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#4A4A46', flex: 1, textTransform: 'capitalize' }}>{d.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#1C1C1A' }}>{d.value}</span>
                    <span style={{ fontSize: 11, color: '#9B9B96', width: 36, textAlign: 'right' }}>
                      {Math.round(d.value / kpis.total * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : <EmptyState />}
        </Card>
      </div>

      {/* Fila 4: Aging */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 16, marginBottom: 16 }}>
        <Card title="Aging — tiempo abiertos" tooltip="Cuántos días llevan abiertos los casos sin cierre. +10 días requiere intervención.">
          {agingData.every(d => d.cantidad === 0) ? <EmptyState text="Sin casos abiertos en el período" /> : (
            <ResponsiveContainer width="100%" height={155}>
              <BarChart data={agingData} layout="vertical" margin={{ left: 4, right: 20, top: 4, bottom: 0 }}>
                <CartesianGrid horizontal={false} stroke="#F0F0EE" strokeWidth={1} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#9B9B96' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="rango" tick={{ fontSize: 11, fill: '#4A4A46' }} axisLine={false} tickLine={false} width={65} />
                <Tooltip formatter={v => [`${v} casos`]} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #EBEBEB' }} />
                <Bar dataKey="cantidad" radius={[0, 4, 4, 0]}>
                  {agingData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card title={`Casos críticos — +10 días abiertos (${kpis.aging['+10'].length})`}>
          {kpis.aging['+10'].length === 0 ? (
            <EmptyState text="Sin casos críticos en el período" good />
          ) : (
            <div style={{ overflowY: 'auto', maxHeight: 180, marginTop: 8 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead style={{ position: 'sticky', top: 0 }}>
                  <tr style={{ background: '#F7F7F5' }}>
                    {['ID', 'Ingreso', 'Tipo', 'Ejecutiva', 'Días'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '6px 10px', fontWeight: 500, color: '#4A4A46', fontSize: 11 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {kpis.aging['+10'].sort((a, b) => b.dias - a.dias).map((c, i) => (
                    <tr key={c.id_caso} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#FAFAF9' }}>
                      <td style={{ padding: '5px 10px', color: '#1C1C1A', fontWeight: 500 }}>{c.id_caso}</td>
                      <td style={{ padding: '5px 10px', color: '#6B6B67' }}>{c.fecha_ingreso}</td>
                      <td style={{ padding: '5px 10px', color: '#6B6B67', textTransform: 'capitalize' }}>{c.tipo_reclamo}</td>
                      <td style={{ padding: '5px 10px', color: '#6B6B67' }}>{c.ejecutiva}</td>
                      <td style={{ padding: '5px 10px' }}>
                        <span style={{ background: '#F8D7DA', color: '#721C24', borderRadius: 20, padding: '2px 8px', fontWeight: 600, fontSize: 11 }}>{c.dias}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Fila 5: Performance equipo */}
      <Card title="Performance del equipo" subtitle="ART coloreado vs. promedio del equipo">
        <div style={{ overflowX: 'auto', marginTop: 8 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F7F7F5' }}>
                {['Ejecutiva', 'Asignados', 'Cerrados', 'ART (días háb.)', '% del total', 'Distribución'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 500, color: '#4A4A46', fontSize: 11, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {kpis.ejecutivas.sort((a, b) => b.asignados - a.asignados).map((e, i) => {
                const vsProm = kpis.artPromedio > 0 ? ((e.art - kpis.artPromedio) / kpis.artPromedio) * 100 : 0
                const artSem = vsProm > 20 ? { bg: '#F8D7DA', color: '#721C24' } : vsProm > 0 ? { bg: '#FFF3CD', color: '#856404' } : { bg: '#D4EDDA', color: '#155724' }
                return (
                  <tr key={e.nombre} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#FAFAF9', borderBottom: '1px solid #F5F5F3' }}>
                    <td style={{ padding: '9px 12px', color: '#1C1C1A', fontWeight: 500 }}>{e.nombre}</td>
                    <td style={{ padding: '9px 12px', color: '#1C1C1A', fontWeight: 600 }}>{e.asignados}</td>
                    <td style={{ padding: '9px 12px', color: '#6B6B67' }}>{e.cerrados}</td>
                    <td style={{ padding: '9px 12px' }}>
                      <span style={{ background: artSem.bg, color: artSem.color, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>
                        {e.art.toFixed(1)}
                      </span>
                    </td>
                    <td style={{ padding: '9px 12px', color: '#6B6B67' }}>{e.pct.toFixed(1)}%</td>
                    <td style={{ padding: '9px 12px', minWidth: 140 }}>
                      <div style={{ background: '#F0F0EE', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                        <div style={{ width: `${e.pct}%`, background: '#CECBF6', height: '100%', borderRadius: 4 }} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 11, color: '#9B9B96', marginTop: 10 }}>
          El ART individual puede variar según la complejidad de los casos asignados.
        </p>
      </Card>

    </div>
  )
}

/* ── Componentes base ── */

function Card({ title, subtitle, tooltip, children }) {
  const [show, setShow] = useState(false)
  return (
    <div style={{
      background: '#FFFFFF', borderRadius: 12,
      border: '1px solid #EBEBEB',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)',
      padding: '18px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 2 }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#1C1C1A', lineHeight: 1.3 }}>{title}</p>
          {subtitle && <p style={{ fontSize: 11, color: '#9B9B96', marginTop: 1 }}>{subtitle}</p>}
        </div>
        {tooltip && (
          <div style={{ position: 'relative', flexShrink: 0, marginLeft: 8 }}>
            <HelpCircle size={14} color="#C8C8C4" style={{ cursor: 'default' }}
              onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} />
            {show && (
              <div style={{
                position: 'absolute', right: 0, top: 20, zIndex: 50,
                background: '#1C1C1A', color: '#E8E8E4', fontSize: 11, lineHeight: 1.5,
                borderRadius: 8, padding: '8px 10px', width: 200,
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)', pointerEvents: 'none',
              }}>{tooltip}</div>
            )}
          </div>
        )}
      </div>
      {children}
    </div>
  )
}

function StatCard({ label, value, sub, tooltip, accent, alertHigh }) {
  const [show, setShow] = useState(false)
  return (
    <div style={{
      background: '#FFFFFF', borderRadius: 12,
      border: '1px solid #EBEBEB',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)',
      padding: '18px 20px',
      borderTop: `3px solid ${alertHigh ? '#F8D7DA' : accent}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 12, color: '#6B6B67', fontWeight: 400 }}>{label}</p>
        {tooltip && (
          <div style={{ position: 'relative' }}>
            <HelpCircle size={13} color="#D0D0CC" style={{ cursor: 'default' }}
              onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} />
            {show && (
              <div style={{
                position: 'absolute', right: 0, top: 18, zIndex: 50,
                background: '#1C1C1A', color: '#E8E8E4', fontSize: 11, lineHeight: 1.5,
                borderRadius: 8, padding: '8px 10px', width: 200,
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)', pointerEvents: 'none',
              }}>{tooltip}</div>
            )}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, margin: '10px 0 6px' }}>
        <span style={{ fontSize: 32, fontWeight: 700, color: alertHigh ? '#721C24' : '#1C1C1A', lineHeight: 1 }}>{value}</span>
      </div>
      <p style={{ fontSize: 11, color: '#9B9B96' }}>{sub}</p>
    </div>
  )
}

function SLACard({ label, value, unit, semaforo, slaLabel, tooltip, noData }) {
  const [show, setShow] = useState(false)
  return (
    <div style={{
      background: '#FFFFFF', borderRadius: 12,
      border: '1px solid #EBEBEB',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)',
      padding: '18px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 12, color: '#6B6B67' }}>{label}</p>
        {tooltip && (
          <div style={{ position: 'relative' }}>
            <HelpCircle size={13} color="#D0D0CC" style={{ cursor: 'default' }}
              onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} />
            {show && (
              <div style={{
                position: 'absolute', right: 0, top: 18, zIndex: 50,
                background: '#1C1C1A', color: '#E8E8E4', fontSize: 11, lineHeight: 1.5,
                borderRadius: 8, padding: '8px 10px', width: 200,
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)', pointerEvents: 'none',
              }}>{tooltip}</div>
            )}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, margin: '10px 0 8px' }}>
        <span style={{ fontSize: 32, fontWeight: 700, color: noData ? '#C8C8C4' : '#1C1C1A', lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ fontSize: 13, color: '#9B9B96', marginBottom: 3 }}>{unit}</span>}
      </div>
      {semaforo && slaLabel && <Badge bg={semaforo.bg} color={semaforo.color}>{slaLabel}</Badge>}
      {noData && <p style={{ fontSize: 11, color: '#9B9B96' }}>Sin registros de primera respuesta</p>}
    </div>
  )
}

function Badge({ bg, color, children }) {
  return (
    <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 600, background: bg, color, borderRadius: 20, padding: '3px 10px' }}>
      {children}
    </span>
  )
}

function EmptyState({ text = 'Sin datos', good }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 0' }}>
      <span style={{ fontSize: 13, color: good ? '#155724' : '#9B9B96' }}>{text}</span>
    </div>
  )
}
