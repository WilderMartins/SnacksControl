# Sistema de Gestão de Snacks e Bebidas

Este é um sistema completo para gerenciar o consumo de snacks e bebidas por colaboradores de uma empresa. O sistema possui um painel de administração web e uma interface de quiosque otimizada para tablets.

## Funcionalidades

- **Autenticação Segura**:
  - Login com senha para administradores.
  - Login com senha ou OTP (One-Time Password) para usuários, configurável por usuário.
  - Fluxo de "Esqueci minha senha" para administradores.
- **Painel de Administração Web**:
    - Gestão de usuários (colaboradores), com criação, edição, exclusão e **habilitação de OTP por usuário**.
    - Gestão de produtos, com criação, edição, exclusão e importação via CSV.
    - Gestão de categorias de produtos.
    - Configuração de layout (cores, logo) e serviços de e-mail (AWS SES).
    - Dashboard com gráficos de consumo.
    - Relatórios de consumo detalhados.
- **RBAC (Controle de Acesso Baseado em Função)**:
    - Suporte para as funções de `Admin`, `Manager` e `User`.
- **Interface de Quiosque**:
    - Otimizada para tablets e responsiva para dispositivos móveis.
    - Escaneamento de código de barras de produtos usando a câmera do dispositivo.
    - Registro de consumo com feedback visual e controle de limite de créditos.
- **Backend Robusto**:
    - API RESTful segura para comunicação entre o frontend e o banco de dados.

## Tecnologias Utilizadas

- **Backend**: Node.js, Express, Sequelize
- **Frontend**: React, CSS puro
- **Banco de Dados**:
  - **Desenvolvimento**: SQLite
  - **Produção**: PostgreSQL
- **Envio de E-mail**: AWS SES

## Instalação

Para instruções detalhadas de instalação, consulte o [Guia de Instalação](INSTALLATION_GUIDE.md).

### Resumo da Instalação (Desenvolvimento)

1. **Clone o repositório.**
2. **Instale as dependências e construa o frontend:**
   ```bash
   npm install
   ```
3. **Configure as variáveis de ambiente (opcional para dev):**
   ```bash
   cp .env.example .env
   ```
4. **Inicie o servidor e rode as migrações:**
   ```bash
   npm start
   ```
5. **Acesse `http://localhost:3333` no seu navegador.**

## Testes

Para executar os testes do backend, use o seguinte comando:

```bash
npm test
```

## Documentação da API

Para detalhes sobre os endpoints da API, consulte a [Documentação da API](API_DOCUMENTATION.md).
