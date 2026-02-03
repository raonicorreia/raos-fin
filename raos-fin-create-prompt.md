Você é um engenheiro de software sênior atuando como arquiteto full-stack.

Seu objetivo é reconstruir do zero uma aplicação full-stack de gerenciamento financeiro pessoal chamada "raos-fin", seguindo rigorosamente a arquitetura, fluxos e padrões descritos abaixo.

Trabalhe de forma incremental, estruturada e com foco em código limpo, organização e facilidade de evolução.
Não avance para a próxima etapa sem concluir corretamente a anterior.

========================
VISÃO GERAL DO SISTEMA
========================
A aplicação é um gerenciador financeiro pessoal com:
- Backend em Java 21 + Spring Boot
- Frontend em Angular 21
- UI baseada em PrimeNG, com Bootstrap utilizado apenas para layout e grid
- Suporte a múltiplas contas por usuário
- Contexto de conta ativa no frontend
- Importação automática de movimentações mensais

========================
ESTRUTURA DO PROJETO
========================
Monorepo com a seguinte estrutura:

/backend
/frontend
README.md
package-lock.json (frontend)

========================
BACKEND
========================
Tecnologias:
- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Banco de dados relacional
- Maven

Diretrizes técnicas:
- Utilizar recursos modernos do Java:
  - Records para DTOs
  - var
  - Switch Expressions
- Organização por camadas:
  - controller
  - service
  - repository
  - domain/model
  - dto
  - mapper
  - enums
  - config
- API REST pública (sem autenticação por enquanto)
- Código limpo, sem lógica de negócio em controllers
- Mapeamento explícito entre Entity e DTO usando mappers

========================
MODELO DE DADOS
========================

Usuário (Users):
- id
- active
- name
- email
- password

Conta (Account):
- id
- active
- name
- balance
- user (FK)

Tipo de Transação (TransactionTypeEntity):
- id
- active
- name
- value
- type (enum: CREDIT, DEBIT)
- installments
- dueDate (dia do vencimento)
- monthlyMovement
- user (FK)

Movimentação Financeira (FinancialTransaction):
- id
- status (enum: PENDING, PAID)
- dueDate
- paymentDate
- value
- account (FK)
- transactionType (FK)
- user (FK)

========================
ENDPOINTS REST
========================

Usuários:
- CRUD completo

Contas:
- CRUD completo
- Listagem por usuário

Tipos de Transação:
- CRUD completo
- Listagem por usuário

Movimentações Financeiras:
- CRUD completo
- Listagem filtrada por conta ativa

Importação Mensal:
- Endpoint específico para importar movimentações
- Entrada: mês (1–12)
- Para cada tipo de transação com monthlyMovement = true:
  - Criar movimentação financeira
  - dueDate = (dia do tipo, mês informado, ano corrente)
  - status inicial = PENDING
  - value herdado do tipo de transação

========================
FRONTEND
========================
Tecnologias:
- Angular 21
- PrimeNG (componentes)
- Bootstrap (layout e grid)
- Reactive Forms

Diretrizes:
- PrimeNG é a biblioteca principal de componentes
- Bootstrap deve ser usado apenas para:
  - Grid
  - Layout
  - Espaçamento
- Não substituir componentes PrimeNG por Bootstrap

========================
FLUXO DE NAVEGAÇÃO
========================

1. Login
- Tela simples com email e senha
- Login pode ser mockado ou integrado a endpoint simples
- Em caso de sucesso, redirecionar para seleção de conta

2. Seleção de Conta
- Listar contas do usuário
- Permitir criar nova conta
- Ao selecionar uma conta:
  - Definir como conta ativa

3. Conta Ativa
- A conta ativa deve ser armazenada em sessionStorage
- Criar AccountService responsável por:
  - getActiveAccount()
  - setActiveAccount()
  - clearActiveAccount()

========================
GUARDS E ESTADO
========================
- AuthGuard:
  - Impede acesso sem login
- AccountGuard:
  - Impede acesso às telas financeiras sem conta ativa
- Nunca acessar sessionStorage diretamente fora do serviço

========================
TELAS FINANCEIRAS
========================
As telas abaixo devem sempre usar a conta ativa para filtrar dados:
- Tipos de Transação
- Movimentações Financeiras
- Importação Mensal

========================
UI / UX
========================
- Menu principal com indicação da conta ativa
- Opção para trocar de conta
- Tabelas com ações claras
- Feedback visual para ações (sucesso / erro)
- Layout consistente em todas as telas

========================
DOCUMENTAÇÃO
========================
- Criar README explicando:
  - Arquitetura
  - Estrutura de pastas
  - Como rodar backend e frontend
  - Fluxo da aplicação

========================
REGRAS FINAIS
========================
- Não implementar segurança real neste momento
- Não antecipar funcionalidades futuras
- Priorizar clareza, organização e evolução do código
