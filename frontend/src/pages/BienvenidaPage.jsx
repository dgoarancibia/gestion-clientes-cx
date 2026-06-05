import { useState } from 'react'
import { Download } from 'lucide-react'
import { useData } from '../context/DataContext'
import { parsearArchivoCasos, parsearArchivoVentas, generarPlantillaCasos, generarPlantillaVentas } from '../utils/fileParser'
import UploadZone from '../components/UploadZone'

export default function BienvenidaPage() {
  const { setCasos, setVentas } = useData()
  const [statusCasos, setStatusCasos] = useState(null)
  const [statusVentas, setStatusVentas] = useState(null)
  const [errorCasos, setErrorCasos] = useState(null)
  const [errorVentas, setErrorVentas] = useState(null)
  const [countCasos, setCountCasos] = useState(0)
  const [countVentas, setCountVentas] = useState(0)

  const handleCasos = async (file) => {
    setErrorCasos(null)
    setStatusCasos('loading')
    try {
      const data = await parsearArchivoCasos(file)
      setCasos(data)
      setCountCasos(data.length)
      setStatusCasos('ok')
    } catch (e) {
      setStatusCasos(null)
      setErrorCasos(e.message)
    }
  }

  const handleVentas = async (file) => {
    setErrorVentas(null)
    setStatusVentas('loading')
    try {
      const data = await parsearArchivoVentas(file)
      setVentas(data)
      setCountVentas(data.length)
      setStatusVentas('ok')
    } catch (e) {
      setStatusVentas(null)
      setErrorVentas(e.message)
    }
  }

  const descargar = (contenido, nombre) => {
    const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = nombre; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-full py-12 px-6" style={{ paddingTop: 80 }}>
      <div style={{ maxWidth: 640, width: '100%' }}>

        <div className="mb-8">
          <h2 style={{ fontSize: 20, fontWeight: 500, color: '#2C2C2A', marginBottom: 4 }}>
            Bienvenida al Dashboard CX
          </h2>
          <p style={{ fontSize: 14, color: '#73726C' }}>
            Carga los archivos exportados desde Dynamics 365 para comenzar el análisis.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <UploadZone
            label="Archivo de casos (reclamos)"
            descripcion="Export de casos desde Dynamics 365"
            onFile={handleCasos}
            status={statusCasos}
            count={countCasos}
            error={errorCasos}
          />
          <UploadZone
            label="Archivo de ventas (opcional)"
            descripcion="Unidades vendidas por marca y período — habilita el módulo IRV"
            onFile={handleVentas}
            status={statusVentas}
            count={countVentas}
            error={errorVentas}
          />
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => descargar(generarPlantillaCasos(), 'plantilla_casos.csv')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors cursor-pointer"
            style={{ fontSize: 13, border: '0.5px solid #2C2C2A', background: 'transparent', color: '#2C2C2A' }}
            onMouseOver={e => e.currentTarget.style.background = '#F3F2EE'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
          >
            <Download size={14} />
            Plantilla casos
          </button>
          <button
            onClick={() => descargar(generarPlantillaVentas(), 'plantilla_ventas.csv')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors cursor-pointer"
            style={{ fontSize: 13, border: '0.5px solid #2C2C2A', background: 'transparent', color: '#2C2C2A' }}
            onMouseOver={e => e.currentTarget.style.background = '#F3F2EE'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
          >
            <Download size={14} />
            Plantilla ventas
          </button>
        </div>

        <p style={{ fontSize: 12, color: '#73726C', marginTop: 16 }}>
          Los archivos se procesan localmente — ningún dato se envía a internet.
        </p>
      </div>
    </div>
  )
}
