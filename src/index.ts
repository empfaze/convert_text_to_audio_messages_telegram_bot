import { BotService } from './services/bot';
import { ConfigService } from './services/config';

const initBot = () => {
  const bot = new BotService(new ConfigService());

  bot.init();
};

initBot();
