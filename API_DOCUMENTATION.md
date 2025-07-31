# Documentação da API

Esta documentação descreve os endpoints da API RESTful do sistema de gestão de snacks e bebidas.

**URL Base**: `http://localhost:3333`

---

## Autenticação

### 1. Solicitar OTP

- **Endpoint**: `POST /sessions/otp`
- **Descrição**: Solicita o envio de um One-Time Password (OTP) para o e-mail do usuário.
- **Corpo da Requisição**:
  ```json
  {
    "email": "usuario@exemplo.com"
  }
  ```
- **Resposta de Sucesso (200 OK)**: N/A
- **Respostas de Erro**:
  - `401 Unauthorized`: Usuário não encontrado.
  - `500 Internal Server Error`: Falha no envio do e-mail.

### 2. Login com OTP

- **Endpoint**: `POST /sessions`
- **Descrição**: Autentica o usuário utilizando o e-mail e o OTP recebido.
- **Corpo da Requisição**:
  ```json
  {
    "email": "usuario@exemplo.com",
    "otp": "123456"
  }
  ```
- **Resposta de Sucesso (200 OK)**:
  ```json
  {
    "user": {
      "id": 1,
      "name": "Nome do Usuário",
      "email": "usuario@exemplo.com",
      "role": "user"
    },
    "token": "jwt.token.aqui"
  }
  ```
- **Respostas de Erro**:
  - `401 Unauthorized`: Usuário não encontrado ou OTP inválido/expirado.

---

## Usuários (Admin)

*Autenticação necessária (Bearer Token)*

### 1. Listar Usuários

- **Endpoint**: `GET /users`
- **Descrição**: Retorna uma lista de todos os usuários.

### 2. Criar Usuário

- **Endpoint**: `POST /users`
- **Descrição**: Cria um novo usuário.
- **Corpo da Requisição**:
  ```json
  {
    "name": "Novo Usuário",
    "email": "novo@exemplo.com",
    "daily_credits": 4,
    "role": "user"
  }
  ```

### 3. Atualizar Usuário

- **Endpoint**: `PUT /users/:id`
- **Descrição**: Atualiza os dados de um usuário existente.

### 4. Deletar Usuário

- **Endpoint**: `DELETE /users/:id`
- **Descrição**: Remove um usuário.

---

## Produtos (Admin)

*Autenticação necessária (Bearer Token)*

### 1. Listar Produtos

- **Endpoint**: `GET /products`
- **Descrição**: Retorna uma lista de todos os produtos.

### 2. Criar Produto

- **Endpoint**: `POST /products`
- **Descrição**: Cria um novo produto.

---

## Consumo

*Autenticação necessária (Bearer Token)*

### 1. Registrar Consumo

- **Endpoint**: `POST /consumptions`
- **Descrição**: Registra um novo consumo para o usuário autenticado.
- **Corpo da Requisição**:
  ```json
  {
    "barcode": "1234567890123"
  }
  ```
- **Respostas de Erro**:
  - `400 Bad Request`: Produto não encontrado.
  - `403 Forbidden`: Limite de créditos diários atingido.

### 2. Listar Consumos (Relatório)

- **Endpoint**: `GET /consumptions`
- **Descrição**: Retorna uma lista de consumos, com opção de filtros.
- **Query Params**:
  - `user_id` (opcional): Filtra por ID do usuário.
  - `start_date` (opcional): Data de início (formato `YYYY-MM-DD`).
  - `end_date` (opcional): Data de fim (formato `YYYY-MM-DD`).

---

## Configurações (Admin)

*Autenticação necessária (Bearer Token)*

### 1. Obter Configurações

- **Endpoint**: `GET /settings`
- **Descrição**: Retorna as configurações atuais do sistema (ex: AWS SES).

### 2. Salvar Configurações

- **Endpoint**: `POST /settings`
- **Descrição**: Salva as novas configurações do sistema.
- **Corpo da Requisição**:
  ```json
  {
    "aws_access_key_id": "...",
    "aws_secret_access_key": "...",
    "aws_region": "...",
    "mail_from": "..."
  }
  ```
