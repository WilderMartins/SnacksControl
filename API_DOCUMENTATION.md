# Documentação da API

Esta documentação descreve os endpoints da API RESTful do sistema de gestão de snacks e bebidas.

**URL Base**: `http://localhost:3333/api`

---

## Autenticação e Sessão

### 1. Login

- **Endpoint**: `POST /sessions`
- **Descrição**: Autentica um usuário. O método de login depende do tipo de usuário e de sua configuração.
  - **Administradores**: Podem logar com `email` e `password`, ou com `email` e `otp`.
  - **Usuários Comuns**:
    - Se `otp_enabled` for `true`, devem usar `email` e `otp`.
    - Se `otp_enabled` for `false`, devem usar `email` e `password`.
- **Corpo da Requisição (Exemplo com Senha)**:
  ```json
  {
    "email": "usuario@exemplo.com",
    "password": "sua_senha"
  }
  ```
- **Corpo da Requisição (Exemplo com OTP)**:
  ```json
  {
    "email": "usuario@exemplo.com",
    "otp": "123456"
  }
  ```
- **Resposta de Sucesso (200 OK)**:
  ```json
  {
    "user": { "id": 1, "name": "Nome", "email": "...", "role": "..." },
    "token": "jwt.token.aqui"
  }
  ```
- **Respostas de Erro**:
  - `401 Unauthorized`: Credenciais inválidas.

### 2. Solicitar OTP

- **Endpoint**: `POST /sessions/otp`
- **Descrição**: Solicita o envio de um One-Time Password (OTP) para o e-mail do usuário.
- **Corpo da Requisição**: `{"email": "usuario@exemplo.com"}`

### 3. Solicitar Redefinição de Senha (Admin)

- **Endpoint**: `POST /sessions/forgot-password`
- **Descrição**: Inicia o fluxo de redefinição de senha para um administrador. Envia um e-mail com um link contendo um token.
- **Corpo da Requisição**: `{"email": "admin@exemplo.com"}`
- **Nota**: Por segurança, a resposta é sempre `200 OK` com uma mensagem genérica, não revelando se o e-mail existe ou não.

### 4. Redefinir Senha (Admin)

- **Endpoint**: `POST /sessions/reset-password`
- **Descrição**: Define uma nova senha para o administrador usando o token recebido por e-mail.
- **Corpo da Requisição**:
  ```json
  {
    "token": "token_recebido_no_email",
    "password": "nova_senha_forte"
  }
  ```
- **Resposta de Sucesso (200 OK)**: `{"message": "Password has been reset successfully."}`
- **Respostas de Erro**:
  - `400 Bad Request`: Token inválido, expirado, ou a senha não atende aos requisitos.

---

## Usuários (Admin)

*Autenticação necessária (Bearer Token) e permissão de Admin.*

### 1. Listar Usuários

- **Endpoint**: `GET /users`

### 2. Criar Usuário

- **Endpoint**: `POST /users`

### 3. Atualizar Usuário

- **Endpoint**: `PUT /users/:id`

### 4. Deletar Usuário

- **Endpoint**: `DELETE /users/:id`

### 5. Ativar/Desativar Login com OTP

- **Endpoint**: `PUT /users/:id/toggle-otp`
- **Descrição**: Ativa ou desativa a obrigatoriedade de login com OTP para um usuário específico. Não aplicável a administradores.
- **Resposta de Sucesso (200 OK)**: Retorna o objeto do usuário atualizado.
- **Respostas de Erro**:
  - `403 Forbidden`: Tentativa de alterar um usuário admin.
  - `404 Not Found`: Usuário não encontrado.

---

## Produtos (Admin)
*Autenticação necessária (Bearer Token)*

... (seções de Produtos, Consumo e Configurações permanecem as mesmas)
