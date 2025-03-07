import axios from 'axios'
import https from 'https'

export const API_URL = 'https://93.127.203.121';

// Configurar Axios para aceptar certificados autofirmados
axios.defaults.httpsAgent = new https.Agent({  
  rejectUnauthorized: false
});

// URLs para imágenes
export const getImageUrl = (path) => {
  if (path && path.startsWith('http')) {
    return path;
  }
  return `${API_URL}${path}`;
}; 