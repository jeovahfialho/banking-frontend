import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import TransactionForm from '../components/TransactionForm';
import TransactionHistory from '../components/TransactionHistory';
import '../styles/DashboardPage.css';

/**
 * Página principal do dashboard
 */
const DashboardPage = () => {
  // Obter contexto de autenticação e navegação
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estados da página
  const [activeAccount, setActiveAccount] = useState('100');
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [transactions, setTransactions] = useState([]);

  // Carregar saldo inicial
  useEffect(() => {
    fetchBalance();
  }, [activeAccount]);

  /**
   * Buscar saldo da conta atual
   */
  const fetchBalance = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.get(`/balance?account_id=${activeAccount}`);
      setBalance(response.data.balance);
    } catch (err) {
      console.error('Erro ao buscar saldo:', err);
      
      // Se a conta não existir, definir saldo como 0
      if (err.response && err.response.status === 404) {
        setBalance(0);
      } else {
        setError('Erro ao buscar o saldo. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Manipulador de alteração de conta
   */
  const handleAccountChange = (e) => {
    setActiveAccount(e.target.value);
  };

  /**
   * Manipulador de logout
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /**
   * Manipulador de transações
   * @param {string} type - Tipo de transação (deposit, withdraw, transfer)
   * @param {string} amount - Valor da transação
   * @param {string} destination - Conta de destino (para transferências)
   */
  const handleTransaction = async (type, amount, destination = null) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Preparar payload com base no tipo de transação
      let payload = {
        type,
        amount: parseFloat(amount)
      };

      switch (type) {
        case 'deposit':
          payload.destination = activeAccount;
          break;
        case 'withdraw':
          payload.origin = activeAccount;
          break;
        case 'transfer':
          payload.origin = activeAccount;
          payload.destination = destination;
          break;
        default:
          throw new Error('Tipo de transação inválido');
      }

      // Enviar requisição
      const response = await api.post('/event', payload);
      
      // Atualizar saldo após a transação
      if (type === 'deposit') {
        setBalance(response.data.destination.balance);
        setSuccess(`Depósito de R$${amount} realizado com sucesso!`);
      } else if (type === 'withdraw') {
        setBalance(response.data.origin.balance);
        setSuccess(`Saque de R$${amount} realizado com sucesso!`);
      } else if (type === 'transfer') {
        setBalance(response.data.origin.balance);
        setSuccess(`Transferência de R$${amount} para a conta ${destination} realizada com sucesso!`);
      }
      
      // Adicionar transação ao histórico
      const newTransaction = {
        id: Date.now(),
        type,
        amount: parseFloat(amount),
        origin: type === 'deposit' ? null : activeAccount,
        destination: type === 'withdraw' ? null : type === 'deposit' ? activeAccount : destination,
        timestamp: new Date().toISOString()
      };
      
      setTransactions([newTransaction, ...transactions]);
      
    } catch (err) {
      console.error('Erro na transação:', err);
      
      // Extrair mensagem de erro da resposta
      if (err.response && err.response.data) {
        setError(err.response.data.error || 'Erro ao processar a transação');
      } else {
        setError('Erro na operação. Verifique sua conexão.');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Manipulador de reset do sistema
   */
  const handleReset = async () => {
    // Confirmação antes de resetar
    if (!window.confirm('Tem certeza que deseja resetar o sistema? Todas as contas serão excluídas.')) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      await api.post('/reset');
      setBalance(0);
      setTransactions([]);
      setSuccess('Sistema reiniciado com sucesso!');
    } catch (err) {
      console.error('Erro ao resetar sistema:', err);
      setError('Erro ao resetar o sistema');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Sistema Bancário</h1>
        <button onClick={handleLogout} className="logout-button">
          Sair
        </button>
      </header>

      <div className="dashboard-content">
        <div className="account-section">
          <div className="account-selector">
            <label htmlFor="account-id">Número da Conta:</label>
            <input
              id="account-id"
              type="text"
              value={activeAccount}
              onChange={handleAccountChange}
            />
            <button 
              onClick={fetchBalance}
              disabled={loading}
              className="refresh-button"
            >
              Atualizar
            </button>
          </div>

          <div className="balance-display">
            <h3>Saldo da Conta</h3>
            <div className="balance-amount">
              {loading ? 'Carregando...' : `R$ ${balance}`}
            </div>
          </div>
        </div>

        <div className="transaction-section">
          <h3>Realizar Operação</h3>
          <TransactionForm 
            onSubmit={handleTransaction}
            isLoading={loading}
          />
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
        </div>

        <div className="admin-section">
          <h3>Administração</h3>
          <button 
            onClick={handleReset} 
            className="reset-button"
            disabled={loading}
          >
            Resetar Sistema
          </button>
        </div>

        <div className="history-section">
          <h3>Histórico de Transações</h3>
          <TransactionHistory 
            transactions={transactions}
            accountId={activeAccount}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;