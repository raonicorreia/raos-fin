# Gerenciador Financeiro Pessoal

Aplicação full-stack de gerenciamento financeiro pessoal desenvolvida com Java 21 + Spring Boot (backend) e Angular 21 + PrimeNG (frontend).

## Arquitetura

Este projeto utiliza uma estrutura de monorepo:

```
raos-invest/
├── backend/          # API REST Java 21 + Spring Boot
├── frontend/         # SPA Angular 21 + PrimeNG
└── README.md         # Documentação do projeto
```

## Como Rodar o Projeto

### Pré-requisitos
- Java 21+
- Node.js 21+
- Maven 3.8+
- Angular CLI 21+

### Backend
```bash
cd backend
mvn spring-boot:run
```

A API estará disponível em: http://localhost:8080

### Frontend
```bash
cd frontend
npm install
ng serve
```

A aplicação estará disponível em: http://localhost:4200

## Estrutura de Pastas

### Backend
- `src/main/java/com/raos/invest/`
  - `controller/` - Endpoints REST
  - `service/` - Lógica de negócio
  - `repository/` - Acesso a dados
  - `domain/model/` - Entidades JPA
  - `dto/` - Data Transfer Objects
  - `mapper/` - Conversores de DTO
  - `config/` - Configurações
  - `enums/` - Enumerações

### Frontend
- `src/app/`
  - `components/` - Componentes reutilizáveis
  - `modules/` - Módulos da aplicação
  - `services/` - Serviços HTTP
  - `models/` - Models e interfaces

## Funcionalidades

- Cadastro de usuários
- Cadastro de contas bancárias
- Cadastro de tipos de transações (créditos e débitos)
- Geração automática de movimentações financeiras mensais
- Controle de pagamentos
