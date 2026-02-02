-- Criar tabelas do sistema financeiro

-- Tabela de usuários
CREATE TABLE users (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    active BOOLEAN DEFAULT TRUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Tabela de tipos de transações
CREATE TABLE transaction_types (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    active BOOLEAN DEFAULT TRUE,
    user_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    transaction_value DECIMAL(10,2) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('CREDIT', 'DEBIT')),
    installments INTEGER DEFAULT 1,
    due_date INTEGER NOT NULL CHECK (due_date BETWEEN 1 AND 31),
    monthly_movement BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabela de contas bancárias
CREATE TABLE account (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    active BOOLEAN DEFAULT TRUE,
    name VARCHAR(100) NOT NULL,
    balance DECIMAL(10,2) DEFAULT 0.00,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabela de movimentações financeiras
CREATE TABLE financial_transactions (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    account_id INTEGER NOT NULL,
    transaction_types_id INTEGER NOT NULL,
    status VARCHAR(10) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID')),
    due_date DATE NOT NULL,
    payment_date DATE,
    transaction_value DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (account_id) REFERENCES account(id),
    FOREIGN KEY (transaction_types_id) REFERENCES transaction_types(id)
);

-- Inserir dados de exemplo
INSERT INTO users (name, email, password) VALUES 
('João Silva', 'joao@email.com', 'password123'),
('Maria Souza', 'maria@email.com', 'password456');

INSERT INTO account (name, balance, user_id) VALUES 
('Conta Corrente', 5000.00, 1),
('Poupança', 10000.00, 1),
('Conta Salário', 3000.00, 2);

INSERT INTO transaction_types (user_id, name, transaction_value, type, installments, due_date, monthly_movement) VALUES 
(1, 'Aluguel', 1500.00, 'DEBIT', 1, 5, TRUE),
(1, 'Salário', 8000.00, 'CREDIT', 1, 1, TRUE),
(1, 'Internet', 150.00, 'DEBIT', 1, 10, TRUE),
(2, 'Financiamento Carro', 1200.00, 'DEBIT', 48, 15, TRUE),
(2, 'Salário', 6000.00, 'CREDIT', 1, 1, TRUE);
