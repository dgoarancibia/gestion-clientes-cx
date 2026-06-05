import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useData } from '../context/DataContext'
import { calcularKPIs, semaforoART, semaforoFRT, semaforoEscalamiento } from '../utils/kpis'
import { useState } from 'react'
import { HelpCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react'

const COLORES = ['#A8D5C2', '#B5D4F4', '#CECBF6', '#FAC775', '#F4C5C5', '#C5E4F4']

function delta(actual, anterior) {
  if (!anterior || anterior === 0) return null
  return Math.round(((actual - anterior) / anterior) * 100)
}

// Cambia a false para ver variante C
const VARIANTE_A = true

export default function DashboardMetricas() {
  const { casosFiltrados, casosAnteriorFiltrados } = useData()
  const kpis = calcularKPIs(casosFiltrados)
  const kpisAnt = casosAnteriorFiltrados?.length ? calcularKPIs(casosAnteriorFiltrados) : null

  const marcaData = Object.entries(
    casosFiltrados.reduce((acc, c) => { acc[c.marca] = (acc[c.marca] || 0) + 1; return acc }, {})
  ).map(([marca, cantidad]) => ({
    marca, cantidad,
    pct: casosFiltrados.length ? Math.round(cantidad / casosFiltrados.length * 100) : 0,
  })).sort((a, b) => b.cantidad - a.cantidad)

  const tipoPieData = Object.entries(kpis.porTipo)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  const agingData = [
    { rango: '0–2 días', cantidad: kpis.aging['0-2'], fill: '#D4EDDA' },
    { rango: '3–5 días', cantidad: kpis.aging['3-5'], fill: '#FFF3CD' },
    { rango: '6–10 días', cantidad: kpis.aging['6-10'], fill: '#FAC775' },
    { rango: '+10 días', cantidad: kpis.aging['+10'].length, fill: '#F8D7DA' },
  ]

  const KPI = VARIANTE_A ? KPICardA : KPICardC

  const kpisData = [
    { label: 'Casos ingresados', value: kpis.total, sub: 'En el período', d: delta(kpis.total, kpisAnt?.total), inv: false, max: 200,
      tooltip: 'Total de casos recibidos. Un alza puede indicar mayor actividad o problemas de calidad.' },
    { label: 'Casos cerrados', value: kpis.cerrados, sub: `${kpis.total ? Math.round(kpis.cerrados/kpis.total*100) : 0}% del total`, d: delta(kpis.cerrados, kpisAnt?.cerrados), inv: false, max: 200,
      tooltip: 'Casos con fecha de cierre. Alza es positiva.' },
    { label: 'Backlog activo', value: kpis.abiertos, sub: 'Sin fecha de cierre', d: delta(kpis.abiertos, kpisAnt?.abiertos), inv: true, max: 50, alert: kpis.abiertos > 20,
      tooltip: 'Casos aún abiertos. Baja es positiva.' },
    { label: 'Reapertura', value: kpis.cerrados === 0 ? '—' : `${kpis.tasaReapertura}%`, sub: 'Sobre cerrados', d: kpisAnt ? delta(kpis.tasaReapertura, kpisAnt.tasaReapertura) : null, inv: true, max: 20,
      tooltip: '% de casos reabiertos tras cierre. Baja es positiva.' },
    { label: 'ART', value: kpis.art, sub: 'días hábiles', d: kpisAnt ? delta(kpis.art, kpisAnt.art) : null, inv: true, max: 10,
      badge: { ...semaforoART(kpis.art), label: kpis.art <= 5 ? 'En SLA' : kpis.art <= 8 ? 'En riesgo' : 'Fuera SLA' },
      tooltip: 'Promedio días hábiles entre ingreso y cierre. Meta: ≤ 5 días.' },
    { label: 'FRT', value: kpis.frt ?? '—', sub: kpis.frt ? 'horas' : 'Sin datos', d: kpisAnt?.frt && kpis.frt ? delta(kpis.frt, kpisAnt.frt) : null, inv: true, max: 48,
      badge: kpis.frt ? { ...semaforoFRT(kpis.frt), label: kpis.frt <= 24 ? 'En SLA' : kpis.frt <= 48 ? 'En riesgo' : 'Fuera SLA' } : null,
      tooltip: 'Promedio horas hasta primera respuesta. Meta: ≤ 24 hrs.' },
    { label: 'Escalamiento', value: `${kpis.tasaEscalamiento}%`, sub: `${kpis.escalados} casos`, d: kpisAnt ? delta(kpis.tasaEscalamiento, kpisAnt.tasaEscalamiento) : null, inv: true, max: 30,
      badge: { ...semaforoEscalamiento(kpis.tasaEscalamiento), label: kpis.tasaEscalamiento <= 15 ? 'Normal' : kpis.tasaEscalamiento <= 25 ? 'Elevado' : 'Crítico' },
      tooltip: 'Casos escalados a nivel superior. Meta: ≤ 15%.' },
    { label: 'Tipos de reclamo', value: tipoPieData[0]?.name ?? '—', sub: `Líder: ${tipoPieData[0]?.value ?? 0} casos`, d: null, inv: false, max: null,
      tooltip: 'Tipo de reclamo más frecuente en el período.' },
  ]

  return (
    <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Preview de variante activa */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: -4 }}>
        <span style={{ fontSize: 11, color: '#9B9B96', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Variante {VARIANTE_A ? 'A — Minimalista' : 'C — Con barra de progreso'}
        </span>
      </div>

      {/* Fila 1 — 8 KPIs incluyendo escalamiento y tipo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, minmax(0, 160px))', gap: 10 }}>
        {kpisData.map((k, i) => (
          <KPI key={i} {...k} delta={k.d} deltaInvert={k.inv} />
        ))}
      </div>

      {/* Fila 2 — Marca + Tipos dona */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 12 }}>
        <Card title="Distribución por marca">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
            {marcaData.map((m, i) => (
              <div key={m.marca} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, color: '#4A4A46', width: 68, flexShrink: 0 }}>{m.marca}</span>
                <div style={{ flex: 1, background: '#F0F0EE', borderRadius: 4, height: 7, overflow: 'hidden' }}>
                  <div style={{ width: `${m.pct}%`, height: '100%', borderRadius: 4, background: COLORES[i % COLORES.length], transition: 'width 0.4s ease' }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#1C1C1A', width: 32, textAlign: 'right' }}>{m.pct}%</span>
                <span style={{ fontSize: 11, color: '#9B9B96', width: 48, textAlign: 'right' }}>{m.cantidad} casos</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Tipos de reclamo">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
            <ResponsiveContainer width={100} height={100}>
              <PieChart>
                <Pie data={tipoPieData} cx={46} cy={46} innerRadius={28} outerRadius={46} dataKey="value" paddingAngle={2}>
                  {tipoPieData.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v} casos`, n]} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
              {tipoPieData.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 7, height: 7, borderRadius: 2, background: COLORES[i % COLORES.length], flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: '#4A4A46', flex: 1, textTransform: 'capitalize' }}>{d.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#1C1C1A' }}>{d.value}</span>
                  <span style={{ fontSize: 10, color: '#9B9B96', width: 28, textAlign: 'right' }}>{Math.round(d.value / kpis.total * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Fila 3 — Aging */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 12 }}>
        <Card title="Aging — casos abiertos" tooltip="+10 días sin cierre requiere atención inmediata.">
          {agingData.every(d => d.cantidad === 0)
            ? <Empty text="Sin casos abiertos" good />
            : <ResponsiveContainer width="100%" height={148}>
                <BarChart data={agingData} layout="vertical" margin={{ left: 4, right: 24, top: 8, bottom: 0 }}>
                  <CartesianGrid horizontal={false} stroke="#F0F0EE" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#9B9B96' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="rango" tick={{ fontSize: 11, fill: '#4A4A46' }} axisLine={false} tickLine={false} width={64} />
                  <Tooltip formatter={v => [`${v} casos`]} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #EBEBEB' }} />
                  <Bar dataKey="cantidad" radius={[0, 4, 4, 0]}>
                    {agingData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
          }
        </Card>

        <Card title={`Casos críticos — +10 días (${kpis.aging['+10'].length})`}>
          {kpis.aging['+10'].length === 0
            ? <Empty text="Sin casos críticos en el período" good />
            : <div style={{ overflowY: 'auto', maxHeight: 168, marginTop: 8 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead style={{ position: 'sticky', top: 0 }}>
                    <tr style={{ background: '#F7F7F5' }}>
                      {['ID', 'Ingreso', 'Tipo', 'Ejecutiva', 'Días'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '5px 10px', fontWeight: 500, color: '#6B6B67', fontSize: 11 }}>{h}</th>
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
          }
        </Card>
      </div>

      {/* Fila 4 — Performance equipo */}
      <Card title="Performance del equipo" subtitle="ART coloreado vs. promedio del equipo">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginTop: 8 }}>
          <thead>
            <tr style={{ background: '#F7F7F5' }}>
              {['Ejecutiva', 'Asignados', 'Cerrados', 'ART (días háb.)', '% del total', 'Distribución'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '7px 12px', fontWeight: 500, color: '#6B6B67', fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {kpis.ejecutivas.sort((a, b) => b.asignados - a.asignados).map((e, i) => {
              const vsProm = kpis.artPromedio > 0 ? ((e.art - kpis.artPromedio) / kpis.artPromedio) * 100 : 0
              const artSem = vsProm > 20 ? { bg: '#F8D7DA', color: '#721C24' } : vsProm > 0 ? { bg: '#FFF3CD', color: '#856404' } : { bg: '#D4EDDA', color: '#155724' }
              return (
                <tr key={e.nombre} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#FAFAF9', borderBottom: '1px solid #F5F5F3' }}>
                  <td style={{ padding: '8px 12px', color: '#1C1C1A', fontWeight: 500 }}>{e.nombre}</td>
                  <td style={{ padding: '8px 12px', fontWeight: 600, color: '#1C1C1A' }}>{e.asignados}</td>
                  <td style={{ padding: '8px 12px', color: '#6B6B67' }}>{e.cerrados}</td>
                  <td style={{ padding: '8px 12px' }}>
                    <span style={{ background: artSem.bg, color: artSem.color, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>{e.art.toFixed(1)}</span>
                  </td>
                  <td style={{ padding: '8px 12px', color: '#6B6B67' }}>{e.pct.toFixed(1)}%</td>
                  <td style={{ padding: '8px 12px', minWidth: 120 }}>
                    <div style={{ background: '#F0F0EE', borderRadius: 4, height: 6 }}>
                      <div style={{ width: `${e.pct}%`, background: '#CECBF6', height: '100%', borderRadius: 4 }} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p style={{ fontSize: 11, color: '#9B9B96', marginTop: 8 }}>El ART individual puede variar según la complejidad de los casos asignados.</p>
      </Card>
    </div>
  )
}

/* ── Variante A: Minimalista ── */
function KPICardA({ label, value, sub, tooltip, badge, alert, delta: d, deltaInvert }) {
  const [show, setShow] = useState(false)
  return (
    <div style={{
      background: '#FFFFFF', borderRadius: 10,
      border: '1px solid #EBEBEB',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      padding: '12px 13px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: '#B0B0AA', fontWeight: 500 }}>{label}</span>
        {tooltip && (
          <div style={{ position: 'relative' }}>
            <HelpCircle size={11} color="#D8D8D4" style={{ cursor: 'default' }}
              onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} />
            {show && <Tip>{tooltip}</Tip>}
          </div>
        )}
      </div>
      <p style={{ fontSize: 26, fontWeight: 700, color: alert ? '#721C24' : '#1C1C1A', lineHeight: 1, margin: '6px 0 8px' }}>{value}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {badge
          ? <Badge bg={badge.bg} color={badge.color}>{badge.label}</Badge>
          : <span style={{ fontSize: 10, color: '#9B9B96' }}>{sub}</span>
        }
        {d != null && <DeltaBadge value={d} invert={deltaInvert} />}
      </div>
    </div>
  )
}

/* ── Variante C: Con barra de progreso ── */
function KPICardC({ label, value, sub, tooltip, badge, alert, delta: d, deltaInvert, max }) {
  const [show, setShow] = useState(false)
  const numVal = parseFloat(String(value).replace('%', ''))
  const pct = max && !isNaN(numVal) ? Math.min((numVal / max) * 100, 100) : null
  const barColor = alert ? '#F8D7DA' : badge ? badge.bg : '#B5D4F4'
  return (
    <div style={{
      background: '#FFFFFF', borderRadius: 10,
      border: '1px solid #EBEBEB',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      padding: '12px 13px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: '#B0B0AA', fontWeight: 500 }}>{label}</span>
        {tooltip && (
          <div style={{ position: 'relative' }}>
            <HelpCircle size={11} color="#D8D8D4" style={{ cursor: 'default' }}
              onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} />
            {show && <Tip>{tooltip}</Tip>}
          </div>
        )}
      </div>
      <p style={{ fontSize: 26, fontWeight: 700, color: alert ? '#721C24' : '#1C1C1A', lineHeight: 1, margin: '6px 0 6px' }}>{value}</p>
      {pct !== null && (
        <div style={{ background: '#F0F0EE', borderRadius: 4, height: 4, marginBottom: 8, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', borderRadius: 4, background: barColor, transition: 'width 0.4s ease' }} />
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {badge
          ? <Badge bg={badge.bg} color={badge.color}>{badge.label}</Badge>
          : <span style={{ fontSize: 10, color: '#9B9B96' }}>{sub}</span>
        }
        {d != null && <DeltaBadge value={d} invert={deltaInvert} />}
      </div>
    </div>
  )
}

/* ── Componentes compartidos ── */
function Card({ title, subtitle, tooltip, children }) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ background: '#FFFFFF', borderRadius: 10, border: '1px solid #EBEBEB', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', padding: '16px 18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#1C1C1A' }}>{title}</p>
          {subtitle && <p style={{ fontSize: 10, color: '#9B9B96', marginTop: 1 }}>{subtitle}</p>}
        </div>
        {tooltip && (
          <div style={{ position: 'relative', flexShrink: 0, marginLeft: 8 }}>
            <HelpCircle size={13} color="#D0D0CC" style={{ cursor: 'default' }}
              onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} />
            {show && <Tip>{tooltip}</Tip>}
          </div>
        )}
      </div>
      {children}
    </div>
  )
}

function DeltaBadge({ value, invert }) {
  if (value == null) return null
  const positive = invert ? value < 0 : value > 0
  const neutral = value === 0
  const color = neutral ? '#9B9B96' : positive ? '#155724' : '#721C24'
  const bg = neutral ? '#F0F0EE' : positive ? '#D4EDDA' : '#F8D7DA'
  const Icon = neutral ? Minus : positive ? TrendingDown : TrendingUp
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, fontWeight: 600, background: bg, color, borderRadius: 20, padding: '2px 7px', flexShrink: 0 }}>
      <Icon size={10} />{Math.abs(value)}%
    </span>
  )
}

function Badge({ bg, color, children }) {
  return <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 600, background: bg, color, borderRadius: 20, padding: '2px 8px' }}>{children}</span>
}

function Tip({ children }) {
  return (
    <div style={{ position: 'absolute', right: 0, top: 18, zIndex: 50, background: '#1C1C1A', color: '#E8E8E4', fontSize: 11, lineHeight: 1.5, borderRadius: 8, padding: '8px 10px', width: 190, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', pointerEvents: 'none' }}>
      {children}
    </div>
  )
}

function Empty({ text, good }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}>
      <span style={{ fontSize: 12, color: good ? '#155724' : '#9B9B96' }}>{text}</span>
    </div>
  )
}
