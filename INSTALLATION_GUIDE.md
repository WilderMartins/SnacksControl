# Guia de Instalação Detalhado

Este guia detalha cada passo necessário para configurar e rodar o sistema de gestão de snacks e bebidas.

## 1. Pré-requisitos

Antes de começar, garanta que você tem os seguintes softwares instalados:

- **Node.js**: Versão 14 ou superior.
- **npm**: Geralmente vem com o Node.js.

**Nota sobre o Banco de Dados**: O ambiente de desenvolvimento foi configurado para usar **SQLite**, que é um banco de dados baseado em arquivo e não requer instalação adicional. O ambiente de produção, no entanto, é projetado para rodar com **PostgreSQL**.

## 2. Clonando o Repositório

Primeiro, clone o repositório do projeto para a sua máquina local.

```bash
git clone <url-do-repositorio>
cd <nome-do-repositorio>
```

## 3. Instalação e Configuração

O novo processo de instalação é simplificado e automatizado.

### 3.1. Instalar Dependências e Construir o Frontend

Na raiz do projeto, execute o comando `npm install`. Este comando fará três coisas:
1.  Instalará as dependências do backend.
2.  Navegará até a pasta `admin-web`, instalará as dependências do frontend.
3.  Executará o script de `build` do frontend, gerando os arquivos estáticos para produção.

```bash
npm install
```

### 3.2. Configurar Variáveis de Ambiente

Para o ambiente de desenvolvimento com SQLite, as variáveis de banco de dados não são necessárias. No entanto, você ainda precisa de um segredo para a aplicação. Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

O arquivo `.env` pode ser usado como está para desenvolvimento. Para produção, você precisará preenchê-lo com as credenciais do seu banco de dados PostgreSQL e outras configurações.

## 4. Rodando o Sistema (Desenvolvimento)

Para iniciar a aplicação em modo de desenvolvimento, basta executar um único comando na raiz do projeto:

```bash
npm start
```

Este comando irá:
1.  Executar as migrações do banco de dados para criar o arquivo `database.sqlite` e suas tabelas.
2.  Iniciar o servidor backend na porta `3333`.

O servidor backend também servirá os arquivos do frontend. Você pode acessar o painel de administração em `http://localhost:3333`.

**Nota**: Como o servidor backend está servindo a versão de *build* do frontend, se você fizer alterações no código do `admin-web`, precisará executar `npm run build` dentro da pasta `admin-web` para que as alterações sejam refletidas.

## 5. Configuração para Produção

Para um ambiente de produção, a configuração é diferente e requer um banco de dados PostgreSQL.

1.  **Banco de Dados**: Provisione um servidor PostgreSQL.
2.  **Variáveis de Ambiente**: Preencha o arquivo `.env` com as credenciais corretas do seu banco de dados de produção (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).
3.  **Executar a Aplicação**: Inicie a aplicação usando um gerenciador de processos como o `pm2`.
    ```bash
    npm start
    ```
    O script `start` irá rodar as migrações no seu banco de dados de produção e depois iniciar o servidor.

## 6. Acessando o Sistema

Após a instalação, acesse `http://localhost:3333` (ou o endereço do seu servidor de produção). O sistema não possui mais um assistente de instalação. Você precisará criar o usuário administrador manualmente.

### Criando o Usuário Administrador

Execute o seguinte comando na raiz do projeto para criar o usuário administrador padrão (`admin@example.com` com a senha `password`):

```bash
npm run create:admin-user
```
---

## Solução de Problemas Comuns

### Erros de `npm install`

Se a instalação de dependências falhar, tente os seguintes passos:

1.  Apague as pastas `node_modules` do projeto raiz e do `admin-web`.
2.  Limpe o cache do npm com `npm cache clean --force`.
3.  Tente instalar as dependências novamente.
