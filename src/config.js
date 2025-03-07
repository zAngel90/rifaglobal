export const API_URL = 'https://93.127.203.121';

// URLs para imágenes
export const getImageUrl = (path) => {
  if (path && path.startsWith('http')) {
    return path;
  }
  return `${API_URL}${path}`;
}; 