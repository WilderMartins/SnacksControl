const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const fs = require('fs').promises;
const path = require('path');

const settingsFilePath = path.resolve(__dirname, '..', 'config', 'settings.json');

class MailService {
  constructor() {
    this.sesClient = null;
    this.mailFrom = null;
    this._isInitialized = false;
    this._initializePromise = this.initialize();
  }

  async initialize() {
    try {
      const settings = await fs.readFile(settingsFilePath, 'utf-8');
      const { aws_access_key_id, aws_secret_access_key, aws_region, mail_from } = JSON.parse(settings);

      this.sesClient = new SESClient({
        region: aws_region,
        credentials: {
          accessKeyId: aws_access_key_id,
          secretAccessKey: aws_secret_access_key,
        },
      });
      this.mailFrom = mail_from;
      this._isInitialized = true;
    } catch (error) {
      console.error('Failed to load mail settings, OTP will not be sent.', error);
      this._isInitialized = false;
    }
  }

  async ensureInitialized() {
    if (!this._initializePromise) {
      this._initializePromise = this.initialize();
    }
    await this._initializePromise;
  }

  async sendOtp(to, otp) {
    await this.ensureInitialized();
    if (!this._isInitialized) {
      throw new Error('Mail service not initialized.');
    }

    const params = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Text: {
            Charset: 'UTF-8',
            Data: `Seu código de acesso é: ${otp}`,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Seu código de acesso para o Quiosque',
        },
      },
      Source: this.mailFrom,
    };

    const command = new SendEmailCommand(params);
    return this.sesClient.send(command);
  }
}

module.exports = new MailService();
