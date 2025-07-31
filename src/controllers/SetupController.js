const fs = require('fs').promises;
const path = require('path');
const User = require('../models/User');
const { Sequelize } = require('sequelize');

const envPath = path.resolve(__dirname, '..', '..', '.env');
const setupLockPath = path.resolve(__dirname, '..', 'config', 'setup.lock');

class SetupController {
  async status(req, res) {
    try {
      await fs.access(setupLockPath);
      return res.json({ isSetupComplete: true });
    } catch (error) {
      return res.json({ isSetupComplete: false });
    }
  }

  async setupDatabase(req, res) {
    console.log('-> Entrou em SetupController.setupDatabase');
    try {
      console.log('Iniciando setup do banco de dados...');
      const { db_host, db_port, db_user, db_password, db_name } = req.body;
      console.log('Dados recebidos:', { db_host, db_port, db_user, db_password, db_name });

      // 1. Testa a conexão com o banco de dados
      console.log('Testando conexão com o banco de dados...');
      const sequelize = new Sequelize(db_name, db_user, db_password, {
        host: db_host,
        port: db_port,
        dialect: 'postgres',
        logging: false,
      });

      await sequelize.authenticate();
      console.log('Conexão com o banco de dados bem-sucedida.');

      // 2. Salva as configurações no .env
      console.log('Salvando configurações no arquivo .env...');
      const envContent = `
DB_HOST=${db_host}
DB_PORT=${db_port}
DB_USER=${db_user}
DB_PASSWORD=${db_password}
DB_NAME=${db_name}
APP_SECRET=${require('crypto').randomBytes(16).toString('hex')}
`;
      await fs.writeFile(envPath, envContent);
      console.log('Arquivo .env salvo com sucesso.');

      // Força o reinício do processo para carregar o novo .env
      // Em um ambiente real, um gerenciador de processo como o PM2 faria isso.
      // Aqui, vamos apenas responder e o frontend irá para o próximo passo.
      console.log('Setup do banco de dados concluído.');
      return res.status(200).send();
    } catch (error) {
      console.error('Erro durante o setup do banco de dados:', error);
      return res.status(500).json({ error: 'Falha no setup do banco de dados.', details: error.message });
    }
  }

  async setupAdmin(req, res) {
    console.log('-> Entrou em SetupController.setupAdmin');
    console.log('Attempting to create admin...');
    const { name, email, password } = req.body;
    console.log('Admin data:', { name, email, password: '***' });
    try {
      const newUser = await User.create({ name, email, password, role: 'admin', is_active: true });
      console.log('Admin created successfully:', newUser.toJSON());
      return res.status(201).send();
    } catch (error) {
      console.error('Error creating admin:', error);
      return res.status(500).json({ error: 'Falha ao criar o administrador.' });
    }
  }

  async finishSetup(req, res) {
    try {
      await fs.writeFile(setupLockPath, new Date().toISOString());
      return res.status(200).send();
    } catch (error) {
      return res.status(500).json({ error: 'Falha ao finalizar a instalação.' });
    }
  }
}

module.exports = new SetupController();
