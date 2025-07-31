# Guia de Instalação Detalhado

Este guia detalha cada passo necessário para configurar e rodar o sistema de gestão de snacks e bebidas.

## 1. Pré-requisitos

Antes de começar, garanta que você tem os seguintes softwares instalados:

- **Node.js**: Versão 14 ou superior.
- **npm**: Geralmente vem com o Node.js.
- **Docker e Docker Compose**: Para rodar o banco de dados PostgreSQL em um contêiner.

## 2. Clonando o Repositório

Primeiro, clone o repositório do projeto para a sua máquina local.

```bash
git clone <url-do-repositorio>
cd <nome-do-repositorio>
```

## 3. Instalação das Dependências

O projeto é dividido em duas partes: o **backend** (servidor) e o **frontend** (painel de administração). Você precisa instalar as dependências para ambas as partes.

### 3.1. Dependências do Backend

Na raiz do projeto, instale as dependências do servidor.

```bash
npm install
```

### 3.2. Dependências do Frontend

Após a instalação do backend, entre no diretório `admin-web` e instale as dependências do painel.

```bash
cd admin-web
npm install
cd ..
```

## 4. Configuração do Banco de Dados

### 4.1. Iniciando o Contêiner do Banco de Dados

O sistema utiliza um banco de dados PostgreSQL, que pode ser facilmente iniciado com Docker. Na raiz do projeto, execute:

```bash
npm run db:start
```

Este comando irá baixar a imagem do PostgreSQL (se ainda não estiver presente) e iniciar um contêiner com um banco de dados pronto para uso.

### 4.2. Configurando as Variáveis de Ambiente

As credenciais do banco de dados e outras configurações do servidor são gerenciadas através de um arquivo `.env`. Copie o arquivo de exemplo para criar o seu.

```bash
cp .env.example .env
```

Abra o arquivo `.env` e verifique se as credenciais correspondem às do banco de dados que você iniciou. O padrão é:

```
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=docker
DB_NAME=snacks
```

### 4.3. Rodando as Migrações

Com o banco de dados rodando e as variáveis de ambiente configuradas, aplique as migrações para criar as tabelas necessárias.

```bash
npx sequelize-cli db:migrate
```

**Importante**: Sempre que você baixar uma nova versão do sistema, rode este comando para garantir que seu banco de dados está atualizado.

## 5. Iniciando os Servidores

Agora, você precisa iniciar os servidores do backend e do frontend. Isso deve ser feito em dois terminais separados.

### 5.1. Servidor Backend

No primeiro terminal, na raiz do projeto, inicie o servidor Node.js.

```bash
npm run dev
```

Você deverá ver a mensagem `🚀 Server started on port 3333!`.

### 5.2. Servidor Frontend

No segundo terminal, entre no diretório `admin-web` e inicie o servidor de desenvolvimento do React.

```bash
cd admin-web
npm start
```

Isso abrirá automaticamente uma aba no seu navegador com o painel de administração.

## 6. Configuração Inicial

### 6.1. Usando o Assistente de Instalação (Recomendado)

Ao acessar o sistema pela primeira vez (`http://localhost:3000`), você será guiado por um assistente de instalação.

- **Passo 1: Boas-vindas**: Apenas uma tela de introdução.
- **Passo 2: Banco de Dados**: O assistente irá pedir as credenciais do banco de dados novamente. Isso é para garantir que o sistema pode se conectar corretamente. Preencha os campos e clique em "Testar e Salvar".
- **Passo 3: Conta de Administrador**: Crie a conta principal do sistema, que terá acesso a todas as funcionalidades.
- **Passo 4: Conclusão**: Após finalizar, você será redirecionado para a tela de login.

### 6.2. Criando o Usuário Administrador Manualmente

Se preferir, ou se encontrar problemas com o assistente de instalação, você pode criar o usuário administrador padrão (`admin@example.com` com a senha `password`) executando o seguinte comando na raiz do projeto:

```bash
npm run create:admin-user
```

**Nota**: Este comando só funcionará se o usuário `admin@example.com` ainda não existir no banco de dados.

## 7. Acessando o Sistema

Após a instalação, você pode acessar o sistema com o usuário administrador que você criou. Você pode optar por fazer login com sua senha ou solicitar um código OTP (One-Time Password) por e-mail.

---

## Solução de Problemas Comuns

### Erros de `npm install`

Se a instalação de dependências falhar, tente os seguintes passos:

1.  Apague as pastas `node_modules` do projeto raiz e do `admin-web`.
2.  Limpe o cache do npm com `npm cache clean --force`.
3.  Tente instalar as dependências novamente.

### Erros de Migração

Se você receber um erro ao rodar `npx sequelize-cli db:migrate`, verifique se:
- O contêiner do Docker com o PostgreSQL está rodando.
- As credenciais no seu arquivo `.env` estão corretas.
