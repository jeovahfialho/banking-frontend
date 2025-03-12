import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

// Criação do contexto de autenticação
export const AuthContext = createContext();

/**
 * Provedor de contexto de autenticação
 * Gerencia estado de autenticação e token JWT
 */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar autenticação ao carregar o componente
  useEffect(() => {
    // Verificar se já existe um token salvo
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  /**
   * Função de login
   * @param {string} username - Nome de usuário
   * @param {string} password - Senha
   * @returns {Promise<object>} - Resultado da operação
   */
  const login = async (username, password) => {
    try {
      // Chamar API de login
      const response = await api.post('/login', { username, pass: password });
      const { token } = response.data;
      
      // Salvar o token no localStorage
      localStorage.setItem('token', token);
      
      // Atualizar estado
      setToken(token);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error('Erro de login:', error);
      
      // Formatar mensagem de erro
      let errorMessage = 'Ocorreu um erro durante o login';
      if (error.response) {
        errorMessage = error.response.data.error || errorMessage;
      }
      
      return { 
        success: false, 
        message: errorMessage
      };
    }
  };

  /**
   * Função de logout
   */
  const logout = () => {
    // Remover o token do localStorage
    localStorage.removeItem('token');
    
    // Atualizar estado
    setToken(null);
    setIsAuthenticated(false);
  };

  // Valores expostos pelo contexto
  const contextValue = {
    isAuthenticated,
    token,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};