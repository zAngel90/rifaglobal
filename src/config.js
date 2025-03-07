import axios from 'axios'

export const API_URL = 'https://93.127.203.121'

// Crear instancia de Axios con configuración personalizada
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para manejar errores SSL
api.interceptors.request.use((config) => {
  // Ignorar errores de certificado en desarrollo
  if (process.env.NODE_ENV === 'development') {
    config.validateStatus = () => true
  }
  return config
})

// URLs para imágenes
export const getImageUrl = (path) => {
  if (path && path.startsWith('http')) {
    return path
  }
  return `${API_URL}${path}`
} 