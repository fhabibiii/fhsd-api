import axios from 'axios';

/**
 * Send notification to Telegram bot
 * @param message Message to send to Telegram
 * @returns Promise with the response
 */
export async function sendTelegramNotification(message: string): Promise<boolean> {
  try {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    
    // Check if Telegram configuration is available
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.warn('Telegram notification not sent: Missing configuration');
      return false;
    }
    
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    });
    
    return true;
  } catch (error) {
    return false;
  }
}
