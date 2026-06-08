import { collection, addDoc, query, orderBy, limit, getDocs, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

// Guarda un registro de carga en Firestore: /cargas/{auto-id}
// Documento liviano (metadata, no los datos completos) — evita límites de tamaño.
export async function registrarCargaFirestore({ uid, email, tipo, cantidad, detalle }) {
  try {
    await addDoc(collection(db, 'cargas'), {
      uid, email, tipo, cantidad, detalle,
      fecha: serverTimestamp(),
    })
  } catch (e) {
    console.error('Error guardando log en Firestore:', e)
  }
}

// Trae las últimas N cargas registradas (de cualquier usuario autorizado, para visión compartida del equipo)
export async function obtenerHistorialFirestore(max = 30) {
  try {
    const q = query(collection(db, 'cargas'), orderBy('fecha', 'desc'), limit(max))
    const snap = await getDocs(q)
    return snap.docs.map(d => {
      const data = d.data()
      return {
        id: d.id,
        ...data,
        fecha: data.fecha?.toDate ? data.fecha.toDate().toISOString() : new Date().toISOString(),
      }
    })
  } catch (e) {
    console.error('Error leyendo historial de Firestore:', e)
    return []
  }
}
