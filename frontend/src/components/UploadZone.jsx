import { useRef, useState } from 'react'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'

export default function UploadZone({ label, descripcion, onFile, status, count, error }) {
  const inputRef = useRef()
  const [dragging, setDragging] = useState(false)

  const handleFile = (file) => {
    if (!file) return
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['csv', 'xlsx', 'xls'].includes(ext)) return
    onFile(file)
  }

  return (
    <div
      onClick={() => inputRef.current.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
      className="flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors"
      style={{
        border: `1.5px dashed ${dragging ? '#A8D5C2' : status === 'ok' ? '#A8D5C2' : error ? '#F8D7DA' : '#E8E6E0'}`,
        borderRadius: 12,
        padding: '32px 24px',
        background: dragging ? '#F0FAF6' : '#FAFAF9',
        minHeight: 160,
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        style={{ display: 'none' }}
        onChange={e => handleFile(e.target.files[0])}
      />

      {status === 'ok' ? (
        <CheckCircle size={28} color="#085041" />
      ) : error ? (
        <AlertCircle size={28} color="#721C24" />
      ) : (
        <Upload size={28} color="#73726C" />
      )}

      <div className="text-center">
        <p style={{ fontSize: 14, fontWeight: 500, color: '#2C2C2A', marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 12, color: '#73726C' }}>{descripcion}</p>
      </div>

      {status === 'ok' && (
        <span style={{
          fontSize: 12, fontWeight: 500,
          background: '#D4EDDA', color: '#155724',
          borderRadius: 20, padding: '2px 10px'
        }}>
          {count} filas cargadas
        </span>
      )}

      {error && (
        <span style={{
          fontSize: 12,
          background: '#F8D7DA', color: '#721C24',
          borderRadius: 8, padding: '4px 10px',
          textAlign: 'center'
        }}>
          {error}
        </span>
      )}

      {!status && !error && (
        <span style={{ fontSize: 12, color: '#73726C' }}>
          CSV, Excel (.xlsx, .xls)
        </span>
      )}
    </div>
  )
}
