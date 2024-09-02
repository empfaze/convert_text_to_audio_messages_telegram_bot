import { Telegraf } from 'telegraf';
import { IConfigService } from '../types/config';
import { PLAYHT_API_KEY, PLAYHT_USER_ID, TOKEN } from '../constants/common';
import { IBotContext } from '../types/context';
import { Command } from '../commands/command';
import { StartCommand } from '../commands/start';
import { ActionCommand } from '../commands/action';
import LocalSession from 'telegraf-session-local';
import * as PlayHT from 'playht';

export class BotService {
  private bot: Telegraf<IBotContext>;
  public commands: Command[] = [];
  private playHTApiKey = '';
  private playHTUserId = '';

  constructor(private readonly configService: IConfigService) {
    this.bot = new Telegraf<IBotContext>(this.configService.get(TOKEN));
    this.bot.use(
      new LocalSession({ database: 'local_session.json' }).middleware(),
    );

    this.playHTApiKey = this.configService.get(PLAYHT_API_KEY);
    this.playHTUserId = this.configService.get(PLAYHT_USER_ID);
  }

  init() {
    this.commands = [new StartCommand(this.bot), new ActionCommand(this.bot)];

    this.commands.forEach((command) => command.handleCommand());

    this.bot.launch();

    PlayHT.init({
      apiKey:
        this.playHTApiKey ||
        (function () {
          throw new Error('PLAYHT_API_KEY not found in .env file');
        })(),
      userId:
        this.playHTUserId ||
        (function () {
          throw new Error('PLAYHT_USER_ID not found in .env file');
        })(),
    });
  }
}
