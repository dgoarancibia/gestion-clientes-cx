export default function KPICard({ titulo, valor, unidad, semaforo, subtitulo }) {
  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 12,
      border: '0.5px solid #E8E6E0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      padding: '20px 24px',
    }}>
      <p style={{ fontSize: 12, color: '#73726C', marginBottom: 8 }}>{titulo}</p>
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
