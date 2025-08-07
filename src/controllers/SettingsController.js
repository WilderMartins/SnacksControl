const fs =require('fs').promises;
const path = require('path');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const settingsFilePath = path.resolve(__dirname, '..', 'config', 'settings.json');

class SettingsController {
  async show(req, res) {
    try {
      const settings = await fs.readFile(settingsFilePath, 'utf-8');
      return res.json(JSON.parse(settings));
    } catch (error) {
      if (error.code === 'ENOENT') {
        return res.json({});
      }
      return res.status(500).json({ error: 'Failed to read settings' });
    }
  }

  async store(req, res) {
    const { aws_access_key_id, aws_secret_access_key, aws_region, mail_from, sidebar_color, sidebar_font_color, ses_host, ses_port } = req.body;
    const logo = req.file;

    let settings = {};
    try {
      const currentSettings = await fs.readFile(settingsFilePath, 'utf-8');
      settings = JSON.parse(currentSettings);
    } catch (error) {
      if (error.code === 'ENOENT') {
        settings = {
          aws_access_key_id: '',
          aws_secret_access_key: '',
          aws_region: '',
          mail_from: '',
          sidebar_color: '#f0f0f0',
          sidebar_font_color: '#000000',
          logo_path: '',
          ses_host: '',
          ses_port: '',
        };
      } else {
        return res.status(500).json({ error: 'Failed to read settings' });
      }
    }

    if (aws_access_key_id !== undefined) settings.aws_access_key_id = aws_access_key_id;
    if (aws_secret_access_key !== undefined) settings.aws_secret_access_key = aws_secret_access_key;
    if (aws_region !== undefined) settings.aws_region = aws_region;
    if (mail_from !== undefined) settings.mail_from = mail_from;
    if (sidebar_color !== undefined) settings.sidebar_color = sidebar_color;
    if (sidebar_font_color !== undefined) settings.sidebar_font_color = sidebar_font_color;
    if (ses_host !== undefined) settings.ses_host = ses_host;
    if (ses_port !== undefined) settings.ses_port = ses_port;
    if (req.body.ses_ignore_tls !== undefined) settings.ses_ignore_tls = req.body.ses_ignore_tls;
    if (req.body.login_method !== undefined) settings.login_method = req.body.login_method;

    if (logo) {
      console.log('Logo filename:', logo.filename);
      settings.logo_path = `/uploads/${logo.filename}`;
      console.log('Settings logo_path:', settings.logo_path);
    }

    try {
      await fs.writeFile(settingsFilePath, JSON.stringify(settings, null, 2));
      return res.status(200).send();
    } catch (error) {
      return res.status(500).json({ error: 'Failed to save settings' });
    }
  }

  async testSesConnection(req, res) {
    const { email } = req.body;

    try {
      const settings = await fs.readFile(settingsFilePath, 'utf-8');
      const { aws_access_key_id, aws_secret_access_key, aws_region, mail_from } = JSON.parse(settings);

      const sesClient = new SESClient({
        region: aws_region,
        credentials: {
          accessKeyId: aws_access_key_id,
          secretAccessKey: aws_secret_access_key,
        },
      });

      const params = {
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Body: {
            Text: {
              Charset: 'UTF-8',
              Data: 'Sua conexão com o AWS SES está funcionando corretamente!',
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: 'Teste de conexão AWS SES',
          },
        },
        Source: mail_from,
      };

      const command = new SendEmailCommand(params);
      await sesClient.send(command);

      return res.status(200).json({ message: 'E-mail de teste enviado com sucesso!' });
    } catch (error) {
      return res.status(500).json({ error: 'Falha ao enviar e-mail de teste.', details: error.message });
    }
  }

  async getCss(req, res) {
    try {
      const settings = await fs.readFile(settingsFilePath, 'utf-8');
      const { sidebar_color, sidebar_font_color, logo_path } = JSON.parse(settings);

      const css = `
        .sidebar {
          background-color: ${sidebar_color || '#f0f0f0'} !important;
        }
        .sidebar a {
          color: ${sidebar_font_color || '#000000'} !important;
        }
        .logo-container img {
          content: url(${logo_path || '/logo.png'});
        }
      `;

      res.setHeader('Content-Type', 'text/css');
      res.send(css);
    } catch (error) {
      if (error.code === 'ENOENT') {
        res.setHeader('Content-Type', 'text/css');
        res.send('');
      } else {
        res.status(500).send('Failed to generate CSS');
      }
    }
  }
}

module.exports = new SettingsController();
