import { Telegraf } from 'telegraf';
import { Command } from './command';
import { IBotContext } from '../types/context';

export class StartCommand extends Command {
  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }

  handleCommand(): void {
    this.bot.command('start', (context) => {
        context.reply(
            'Для взаимодействия с ботом используйте команду "/action". Она выводит дополнительные опции, с помощью которых вы сможете добавлять и удалять сообщества, а также выводить список добавленных на данный момент сообществ.',
        );
    });
  }
}
