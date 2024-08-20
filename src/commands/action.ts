import { Markup, Telegraf } from 'telegraf';
import { Command } from './command';
import { IBotContext } from '../types/context';

export class ActionCommand extends Command {
  links: string[] = ['test1', 'test2'];

  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }

  handleCommand(): void {
    this.bot.command('action', (context) => {
        context.reply(
            'Выберите действие',
            Markup.inlineKeyboard([
              [
                Markup.button.callback('Добавить сообщество', 'handle_add_button'),
                Markup.button.callback(
                  'Удалить сообщество',
                  'handle_remove_button',
                ),
              ],
              [
                Markup.button.callback(
                  'Показать сообщества',
                  'handle_show_links_button',
                ),
              ],
            ]),
          );
    });

    this.bot.action('handle_add_button', (context) => {
      context.reply('Введите ссылку на сообщество для добавления');
    });

    this.bot.action('handle_remove_button', (context) => {
      context.reply('Введите ссылку на сообщество для удаления');
    });

    this.bot.action('handle_show_links_button', (context) => {
      const stringifiedLinks = this.links.join('\n');

      context.reply(stringifiedLinks);
    });
  }
}
