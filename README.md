# Documentação do Frontend do Sistema Bancário

## Visão Geral

Esta é a interface de usuário para o Sistema Bancário, desenvolvida com React. Ela permite aos usuários realizar operações bancárias como login, consulta de saldo, depósitos, saques e transferências através de uma interface amigável e intuitiva.

## Funcionalidades

- **Autenticação**: Login seguro com token JWT
- **Dashboard**: Visualização de saldo e histórico de transações
- **Operações Bancárias**: Interface para depósito, saque e transferência
- **Segurança**: Rotas protegidas que exigem autenticação

## Requisitos

- Node.js v14 ou superior
- npm ou yarn
- API Backend rodando (por padrão em http://localhost:3000)

## Instalação e Execução Local

### 1. Clone o repositório

```bash
git clone <repositório> banking-frontend
cd banking-frontend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure a URL da API

Crie um arquivo `.env` na raiz do projeto:

```
REACT_APP_API_URL=http://localhost:3000
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm start
```

O aplicativo será executado em http://localhost:3001 (ou na próxima porta disponível se 3001 estiver ocupada).

## Execução com Docker

### 1. Construa a imagem Docker

```bash
docker build -t banking-frontend .
```

### 2. Execute o container

```bash
docker run -p 80:80 -e REACT_APP_API_URL=http://localhost:3000 banking-frontend
```

A aplicação estará disponível em http://localhost:80.

## Estrutura do Projeto

```
src/
├── components/                # Componentes React
│   ├── ProtectedRoute.js      # Proteção de rotas autenticadas
│   ├── TransactionForm.js     # Formulário para operações bancárias
│   └── TransactionHistory.js  # Exibição do histórico de transações
│
├── context/                   # Contextos para gerenciamento de estado global
│   └── AuthContext.js         # Gerenciamento de autenticação
│
├── pages/                     # Páginas da aplicação
│   ├── DashboardPage.js       # Página principal após login
│   └── LoginPage.js           # Página de login
│
├── services/                  # Serviços da aplicação
│   └── api.js                 # Cliente Axios para comunicação com a API
│
├── styles/                    # Arquivos CSS
│   ├── App.css
│   ├── DashboardPage.css
│   ├── LoginPage.css
│   ├── TransactionForm.css
│   ├── TransactionHistory.css
│   └── index.css
│
├── App.js                     # Componente principal
└── index.js                   # Ponto de entrada da aplicação
```

## Arquivos Principais

### index.js

Ponto de entrada da aplicação que renderiza o componente `App` no elemento DOM com id "root":

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### App.js

Componente principal que define as rotas da aplicação:

```javascript
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

## Solução de Problemas Comuns

### "Failed to fetch" durante login ou operações bancárias

Indica problemas de comunicação com a API backend:

**Solução**: 
1. Verifique se o backend está rodando
2. Confirme se a URL da API está correta (variável de ambiente `REACT_APP_API_URL`)
3. Verifique possíveis problemas de CORS no backend

### Problemas com autenticação

Se o usuário for redirecionado para login logo após fazer login com sucesso:

**Solução**:
1. Verifique se o token JWT está sendo armazenado corretamente no localStorage
2. Confirme que o token não está expirando muito rapidamente
3. Verifique se o formato do token enviado nos headers está correto

## Credenciais de Acesso

Para acessar o sistema, use:
- **Usuário**: admin
- **Senha**: admin

## Personalização

### Mudar Cores e Estilos

Modifique os arquivos CSS na pasta `src/styles/` para alterar a aparência da aplicação.

### Adicionar Novas Páginas

1. Crie um novo componente em `src/pages/`
2. Adicione uma nova rota em `App.js`

### Conectar a um Backend Diferente

Modifique a variável de ambiente `REACT_APP_API_URL` para apontar para o novo backend.

---

## Detalhes de Implementação

### Componentes Principais

#### TransactionForm.js

Este componente permite aos usuários selecionar o tipo de transação (depósito, saque ou transferência) e inserir os valores necessários.

```javascript
import React, { useState } from 'react';
import '../styles/TransactionForm.css';

const TransactionForm = ({ onSubmit, isLoading }) => {
  const [type, setType] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(type, amount, destination);
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
```

#### TransactionHistory.js

Este componente exibe o histórico de transações para a conta atual, com detalhes sobre cada operação.

```javascript
import React from 'react';
import '../styles/TransactionHistory.css';

const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleString();
};

const TransactionHistory = ({ transactions = [], accountId }) => {
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
            let details = '';
            let amountClass = '';
            let amountDisplay = '';

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
```

### Serviços

#### api.js

Este serviço configura e gerencia as requisições HTTP para a API backend.

```javascript
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response || error.message);
    
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

