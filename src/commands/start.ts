import { Telegraf } from 'telegraf';
import { Command } from './command';
import { IBotContext } from '../types/context';
import { START_COMMAND } from '../constants/common';

export class StartCommand extends Command {
  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }

  handleCommand(): void {
    this.bot.command(START_COMMAND, (context) => {
        const userName = context.update.message.from.first_name;

        context.reply(
            `Добрый день, ${userName}. Для взаимодействия с ботом используйте команду "/action". Она выводит дополнительные опции, с помощью которых вы сможете добавлять и удалять сообщества, а также выводить список добавленных на данный момент сообществ`,
        );
    });
  }
}
