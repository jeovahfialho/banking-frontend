// src/components/TransactionHistory.js
import React from 'react';
import '../styles/TransactionHistory.css';

/**
 * Formata uma data ISO para exibição localizada
 * @param {string} dateString - String de data ISO
 * @returns {string} - Data formatada
 */
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleString();
};

/**
 * Componente para exibir histórico de transações
 * @param {Object} props
 * @param {Array} props.transactions - Lista de transações
 * @param {string} props.accountId - ID da conta atual
 */
const TransactionHistory = ({ transactions = [], accountId }) => {
  // Se não houver transações, mostrar mensagem
  if (transactions.length === 0) {
    return <div className="no-transactions">Nenhuma transação realizada</div>;
  }

  return (
    <div className="transaction-history">
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Tipo</th>
            <th>Detalhes</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => {
            // Preparar dados para exibição
            let details = '';
            let amountClass = '';
            let amountDisplay = '';

            // Determinar tipo e formatação com base no tipo de transação
            switch (transaction.type) {
              case 'deposit':
                details = `Depósito na conta ${transaction.destination}`;
                amountClass = 'amount-positive';
                amountDisplay = `+R$ ${transaction.amount}`;
                break;
              
              case 'withdraw':
                details = `Saque da conta ${transaction.origin}`;
                amountClass = 'amount-negative';
                amountDisplay = `-R$ ${transaction.amount}`;
                break;
              
              case 'transfer':
                if (transaction.origin === accountId) {
                  details = `Transferência da conta ${transaction.origin} para conta ${transaction.destination}`;
                  amountClass = 'amount-negative';
                  amountDisplay = `-R$ ${transaction.amount}`;
                } else {
                  details = `Transferência recebida da conta ${transaction.origin} para conta ${transaction.destination}`;
                  amountClass = 'amount-positive';
                  amountDisplay = `+R$ ${transaction.amount}`;
                }
                break;
              
              default:
                details = 'Transação';
                amountDisplay = `R$ ${transaction.amount}`;
            }

            return (
              <tr key={transaction.id || index}>
                <td>{formatDate(transaction.timestamp)}</td>
                <td>{transaction.type}</td>
                <td>{details}</td>
                <td className={amountClass}>{amountDisplay}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;