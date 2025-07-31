# Sistema de Gestão de Snacks e Bebidas

Este é um sistema completo para gerenciar o consumo de snacks e bebidas por colaboradores de uma empresa. O sistema possui um painel de administração web e uma interface de quiosque otimizada para tablets.

## Funcionalidades

- **Autenticação Segura**: Login com senha ou sem senha utilizando OTP (One-Time Password) enviado por e-mail.
- **Painel de Administração Web**:
    - Gestão de usuários (colaboradores), com opção de criação, edição e exclusão manual.
    - Gestão de produtos (snacks, bebidas, etc.), com opção de criação, edição e exclusão manual e importação via CSV.
    - Gestão de categorias de produtos.
    - Configuração de layout (cor da barra lateral) e serviços externos (AWS SES para envio de e-mails).
    - Dashboard com gráficos de consumo diário e por categoria.
    - Relatórios de consumo detalhados com opção de exportação para CSV.
- **RBAC (Controle de Acesso Baseado em Função)**:
    - Criação de usuários com as funções de `Admin`, `Manager` e `User`.
- **Interface de Quiosque**:
    - Otimizada para tablets e uso de baixa fricção e responsiva para dispositivos móveis.
    - Escaneamento de código de barras de produtos usando a câmera do dispositivo.
    - Registro de consumo automático com feedback visual instantâneo e tratamento de erros amigável.
    - Exibição em tempo real do saldo de créditos diários e do histórico de consumo.
- **Backend Robusto**:
    - API RESTful segura para comunicação entre o frontend e o banco de dados.
    - Lógica de negócio para controle de limite de consumo diário.

## Tecnologias Utilizadas

- **Backend**: Node.js, Express, Sequelize, PostgreSQL
- **Frontend**: React, Material-UI (conceitualmente), CSS puro
- **Banco de Dados**: PostgreSQL (com suporte para Docker)
- **Envio de E-mail**: AWS SES

## Instalação

Para instruções detalhadas de instalação, consulte o [Guia de Instalação](INSTALLATION_GUIDE.md).

### Resumo da Instalação

1. **Clone o repositório.**
2. **Instale as dependências:**
   ```bash
   npm install
   cd admin-web
   npm install
   ```
3. **Inicie o banco de dados:**
   ```bash
   npm run db:start
   ```
4. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```
5. **Inicie os servidores:**
   ```bash
   # Em um terminal
   npm run dev

   # Em outro terminal, no diretório admin-web
   npm start
   ```

## Testes

Para executar os testes, use o seguinte comando:

```bash
npm test
```

**Nota:** Os testes são executados sequencialmente para evitar problemas de condição de corrida.

## Documentação da API

Para detalhes sobre os endpoints da API, consulte a [Documentação da API](API_DOCUMENTATION.md).

## Próximos Passos

- [ ] Implementar o reset diário de créditos no backend.
- [ ] Adicionar gráficos e mais filtros aos relatórios.
- [ ] Desenvolver um aplicativo nativo para Android/iOS.
