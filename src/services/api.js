import axios from 'axios';

// URL base da API - ajustar conforme ambiente
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

/**
 * Instância do Axios configurada para a API bancária
 */
const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

/**
 * Interceptor para adicionar token JWT a todas as requisições
 */
api.interceptors.request.use(
  config => {
    // Obter token do localStorage
    const token = localStorage.getItem('token');
    
    // Adicionar token ao header Authorization se existir
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor para tratamento de erros de resposta
 */
api.interceptors.response.use(
  response => response,
  error => {
    // Log do erro
    console.error('API Error:', error.response || error.message);
    
    // Tratar erro de autenticação
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Se for erro de autenticação, limpar o token e redirecionar para login
      localStorage.removeItem('token');
      
      // Redirecionar para o login somente se não estiver já na página de login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;