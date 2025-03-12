import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/LoginPage.css';

/**
 * Página de login da aplicação
 */
const LoginPage = () => {
  // Estados do formulário
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Obter contexto de autenticação e navegação
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  /**
   * Manipulador de envio do formulário
   * @param {Event} e - Evento de formulário
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Limpar erro anterior
    setError('');
    setLoading(true);

    try {
      // Tentar login
      const result = await login(username, password);
      
      if (!result.success) {
        // Mostrar erro
        setError(result.message);
      }
      // Se for bem-sucedido, o useEffect cuidará do redirecionamento
    } catch (err) {
      setError('Ocorreu um erro durante o login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Sistema Bancário</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin"
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="login-button" 
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <div className="login-help">
          <p>Use as credenciais: admin / admin</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;