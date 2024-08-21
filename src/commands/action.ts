import { Markup, Telegraf } from 'telegraf';
import { Command } from './command';
import { IBotContext } from '../types/context';
import { ACTION_COMMAND, NEW_LINE_SYMBOL } from '../constants/common';

export class ActionCommand extends Command {
  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }

  handleCommand(): void {
    this.bot.command(ACTION_COMMAND, (context) => {
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
      context.reply('Введите ссылку на сообщество для добавления его в отслеживаемые');

      context.session.isAddLinkInputActive = true;
      context.session.isRemoveLinkInputActive = false;
    });

    this.bot.action('handle_remove_button', (context) => {
      const addedLinks = context.session.addedLinks;

      if (!addedLinks.length) {
        context.reply('У вас нет добавленных сообществ');

        return;
      }

      context.reply('Введите ссылку на сообщество для удаления его из отслеживаемых');

      context.session.isRemoveLinkInputActive = true;
      context.session.isAddLinkInputActive = false;
    });

    this.bot.action('handle_show_links_button', (context) => {
      const addedLinks = context.session.addedLinks || [];
      const stringifiedLinks = addedLinks.join(NEW_LINE_SYMBOL);

      if (!stringifiedLinks.length) {
        context.reply('У вас нет добавленных сообществ');

        return;
      }

      context.reply(stringifiedLinks);
    });

    this.bot.on('text', (context) => {
        const addedLinks = context.session.addedLinks;
        const enteredLink = context.text;

        const resetSessionState = () => {
            context.session.isAddLinkInputActive = false;
            context.session.isRemoveLinkInputActive = false;
        };

        if (context.session.isAddLinkInputActive) {
            if (addedLinks) {
                if (addedLinks.includes(enteredLink)) {
                    context.reply('Сообщество уже добавлено в отслеживаемые. Введите ссылку на сообщество для добавления его в отслеживаемые');
                } else {
                    context.session.addedLinks.push(enteredLink);
                    context.reply('Сообщество было успешно добавлено в отслеживаемые');
    
                    resetSessionState();
                }
            } else {
                context.session.addedLinks = [enteredLink];
                context.reply('Сообщество было успешно добавлено в отслеживаемые');
    
                resetSessionState();
            }
            
            return;
        }
        
        if (context.session.isRemoveLinkInputActive) {
            if (addedLinks) {
                if (!addedLinks.includes(enteredLink)) {
                    context.reply('Введенное сообщество не находится в отслеживаемых. Введите ссылку на сообщество для удаления его из отслеживаемых');
                } else {
                    context.session.addedLinks = addedLinks.filter((link) => link !== enteredLink);
                    context.reply('Сообщество было успешно удалено из отслеживаемых');
    
                    resetSessionState();
                }
            } else {
                context.reply('У вас нет добавленных сообществ');
                resetSessionState();
            }
        }
    });
  }
}
