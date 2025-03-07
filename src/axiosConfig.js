import axios from 'axios'

export const API_URL = 'http://93.127.203.121'

// Crear instancia de Axios con configuración personalizada
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para manejar errores SSL
api.interceptors.request.use((config) => {
  config.validateStatus = () => true
  return config
})

// Interceptor para manejar errores de certificado
api.interceptors.response.use(
  response => response,
  async error => {
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

export default api 