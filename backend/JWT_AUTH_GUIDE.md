# Guia de Autenticação JWT

## Visão Geral

Este documento explica como testar o sistema de autenticação JWT implementado na aplicação Spring Boot 3.2.0 com Spring Security 6.2.

## Configuração

A aplicação utiliza as seguintes configurações padrão:
- **Secret Key**: `mySecretKey123456789012345678901234567890` (configurável via `jwt.secret`)
- **Token Expiration**: 24 horas (86400000ms) (configurável via `jwt.expiration`)

## Endpoints de Autenticação

### 1. Registrar Novo Usuário
**POST** `/auth/register`

**Request Body:**
```json
{
    "name": "João Silva",
    "email": "joao.silva@example.com",
    "password": "senha123"
}
```

**Response (201 Created):**
```json
{
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJqb2FvLnNpbHZhQGV4YW1wbGUuY29tIiwibmFtZSI6Ikpvw6NvIFNpbHZhIiwiYWN0aXZlIjp0cnVlLCJpYXQiOjE2NzY4MDAwMDAsImV4cCI6MTY3Njg4NjQwMH0.signature",
    "userId": 1,
    "email": "joao.silva@example.com",
    "name": "João Silva",
    "active": true
}
```

### 2. Login
**POST** `/auth/login`

**Request Body:**
```json
{
    "email": "joao.silva@example.com",
    "password": "senha123"
}
```

**Response (200 OK):**
```json
{
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJqb2FvLnNpbHZhQGV4YW1wbGUuY29tIiwibmFtZSI6Ikpvw6NvIFNpbHZhIiwiYWN0aXZlIjp0cnVlLCJpYXQiOjE2NzY4MDAwMDAsImV4cCI6MTY3Njg4NjQwMH0.signature",
    "userId": 1,
    "email": "joao.silva@example.com",
    "name": "João Silva",
    "active": true
}
```

## Como Testar com Postman/Insomnia

### 1. Registrar um Novo Usuário

1. **Método**: POST
2. **URL**: `http://localhost:8080/auth/register`
3. **Headers**: 
   - `Content-Type: application/json`
4. **Body** (raw, JSON):
   ```json
   {
       "name": "Test User",
       "email": "test@example.com",
       "password": "password123"
   }
   ```
5. **Enviar**: Você receberá o token JWT na resposta

### 2. Fazer Login

1. **Método**: POST
2. **URL**: `http://localhost:8080/auth/login`
3. **Headers**: 
   - `Content-Type: application/json`
4. **Body** (raw, JSON):
   ```json
   {
       "email": "test@example.com",
       "password": "password123"
   }
   ```
5. **Enviar**: Você receberá o token JWT na resposta

### 3. Acessar Endpoints Protegidos

1. **Método**: GET (ou qualquer outro)
2. **URL**: `http://localhost:8080/sua-rota-protegida`
3. **Headers**: 
   - `Content-Type: application/json`
   - `Authorization: Bearer <seu-token-aqui>`
4. **Enviar**: Você terá acesso se o token for válido

## Exemplos de Teste com cURL

### Registrar Usuário
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Fazer Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Acessar Endpoint Protegido
```bash
curl -X GET http://localhost:8080/sua-rota-protegida \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwibmFtZSI6IlRlc3QgVXNlciIsImFjdGl2ZSI6dHJ1ZSwiaWF0IjoxNjc2ODAwMDAwLCJleHAiOjE2NzY4ODY0MDB9.signature"
```

## Validações e Regras

- **Email**: Deve ser válido e único no sistema
- **Password**: Mínimo 6 caracteres
- **Name**: Entre 3 e 100 caracteres
- **Usuários inativos**: Não conseguem fazer login
- **Token expirado**: Retorna 401 Unauthorized
- **Token inválido**: Retorna 401 Unauthorized

## Estrutura do Token JWT

O token gerado contém as seguintes claims:
- `sub`: ID do usuário
- `email`: Email do usuário
- `name`: Nome do usuário
- `active`: Status do usuário (true/false)
- `iat`: Data de emissão
- `exp`: Data de expiração

## Configurações Personalizadas

Você pode personalizar as configurações JWT no `application.properties`:

```properties
jwt.secret=sua-chave-secreta-aqui
jwt.expiration=86400000
```

## Segurança

- Senhas são armazenadas usando BCrypt
- Tokens são assinados com HMAC-SHA256
- Autenticação stateless (sem sessões no servidor)
- Todos os endpoints (exceto `/auth/**`) são protegidos
