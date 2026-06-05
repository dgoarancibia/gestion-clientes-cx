import { useState } from 'react'

export default function KPICard({ titulo, valor, unidad, semaforo, subtitulo, tooltip }) {
  const [show, setShow] = useState(false)

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 12,
      border: '0.5px solid #E8E6E0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      padding: '20px 24px',
      position: 'relative',
    }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
        <p style={{ fontSize: 12, color: '#73726C' }}>{titulo}</p>
        {tooltip && (
          <div style={{ position: 'relative' }}>
            <button
              onMouseEnter={() => setShow(true)}
              onMouseLeave={() => setShow(false)}
              style={{
                width: 16, height: 16, borderRadius: '50%',
                background: '#F3F2EE', border: '0.5px solid #E8E6E0',
                fontSize: 10, color: '#73726C', cursor: 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 500, lineHeight: 1,
              }}
            >?</button>
            {show && (
              <div style={{
                position: 'absolute', right: 0, top: 22, zIndex: 50,
                background: '#2C2C2A', color: '#fff',
                fontSize: 11, lineHeight: 1.5,
                borderRadius: 8, padding: '8px 10px',
                width: 200, boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                pointerEvents: 'none',
              }}>
                {tooltip}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-end gap-2">
        <span style={{ fontSize: 28, fontWeight: 500, color: '#2C2C2A', lineHeight: 1 }}>{valor}</span>
        {unidad && <span style={{ fontSize: 13, color: '#73726C', marginBottom: 2 }}>{unidad}</span>}
      </div>

      {semaforo && (
        <span style={{
          display: 'inline-block', marginTop: 8, fontSize: 12, fontWeight: 500,
          background: semaforo.bg, color: semaforo.color,
          borderRadius: 20, padding: '2px 10px',
        }}>
          {semaforo.label}
        </span>
      )}
      {subtitulo && !semaforo && (
        <p style={{ fontSize: 12, color: '#73726C', marginTop: 6 }}>{subtitulo}</p>
      )}
    </div>
  )
}
