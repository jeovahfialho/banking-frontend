import React, { useState } from 'react';
import '../styles/TransactionForm.css';

/**
 * Formulário para realizar transações bancárias
 * @param {Object} props 
 * @param {Function} props.onSubmit - Função para submeter a transação
 * @param {boolean} props.isLoading - Indica se está processando
 */
const TransactionForm = ({ onSubmit, isLoading }) => {
  // Estados do formulário
  const [type, setType] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');

  /**
   * Manipulador de submissão do formulário
   * @param {Event} e - Evento de formulário
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar valor
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      alert('Por favor, insira um valor válido');
      return;
    }
    
    // Validar conta de destino para transferências
    if (type === 'transfer' && !destination) {
      alert('Por favor, insira a conta de destino');
      return;
    }
    
    // Submeter transação
    onSubmit(type, amount, destination);
    
    // Resetar campos
    setAmount('');
    if (type === 'transfer') {
      setDestination('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <div className="form-group">
        <label htmlFor="transaction-type">Tipo de Operação</label>
        <select
          id="transaction-type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          disabled={isLoading}
        >
          <option value="deposit">Depósito</option>
          <option value="withdraw">Saque</option>
          <option value="transfer">Transferência</option>
        </select>
      </div>

      {type === 'transfer' && (
        <div className="form-group">
          <label htmlFor="destination">Conta de Destino</label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Número da conta de destino"
            disabled={isLoading}
            required
          />
        </div>
      )}

      <div className="form-group">
        <label htmlFor="amount">Valor</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          step="0.01"
          min="0.01"
          disabled={isLoading}
          required
        />
      </div>

      <button 
        type="submit" 
        className="submit-button"
        disabled={isLoading}
      >
        {isLoading ? 'Processando...' : 'Confirmar'}
      </button>
    </form>
  );
};

export default TransactionForm;