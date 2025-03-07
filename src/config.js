export const API_URL = 'http://93.127.203.121:3000';

// URLs para imágenes
export const getImageUrl = (path) => {
  if (!path) return null;
  return `${API_URL}/${path}`;
}; 