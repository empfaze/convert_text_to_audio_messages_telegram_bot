import { Telegraf, session } from 'telegraf';
import { IConfigService } from '../types/config';
import { TOKEN } from '../constants/common';
import { IBotContext } from '../types/context';
import { Command } from '../commands/command';
import { StartCommand } from '../commands/start';
import { ActionCommand } from '../commands/action';

export class BotService {
  private bot: Telegraf<IBotContext>;
  public commands: Command[] = [];

  constructor(private readonly configService: IConfigService) {
    this.bot = new Telegraf<IBotContext>(this.configService.get(TOKEN));
    this.bot.use(session());
  }

  init() {
    this.commands = [new StartCommand(this.bot), new ActionCommand(this.bot)];

    this.commands.forEach((command) => command.handleCommand());

    this.bot.launch();
  }
}
