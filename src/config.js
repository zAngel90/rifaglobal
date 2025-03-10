import axios from 'axios'

export const API_URL = 'http://93.127.203.121'

// Crear instancia de Axios con configuración personalizada
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para manejar errores SSL y CORS
api.interceptors.request.use((config) => {
  // Configuración para ignorar errores SSL
  config.validateStatus = () => true
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ERR_CERT_AUTHORITY_INVALID') {
      const config = {
        ...error.config,
        validateStatus: () => true
      }
      return axios(config)
    }
    return Promise.reject(error)
  }
)

// URLs para imágenes
export const getImageUrl = (path) => {
  if (path && path.startsWith('http')) {
    return path
  }
  return `${API_URL}${path}`
} 