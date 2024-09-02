import { Markup, Telegraf } from 'telegraf';
import { Command } from './command';
import { IBotContext } from '../types/context';
import { ACTION_COMMAND, DEFAULT_VOICE_OPTIONS, NEW_LINE_SYMBOL } from '../constants/common';
import { mapEnteredLinkToChannelName } from '../helpers/common';
import * as PlayHT from 'playht';

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
      context.reply(
        'Введите ссылку на сообщество для добавления его в отслеживаемые',
      );

      context.session.isAddLinkInputActive = true;
      context.session.isRemoveLinkInputActive = false;
    });

    this.bot.action('handle_remove_button', (context) => {
      const addedChannels = context.session.addedChannels;

      if (!addedChannels.length) {
        context.reply('У вас нет добавленных сообществ');

        return;
      }

      context.reply(
        'Введите ссылку на сообщество для удаления его из отслеживаемых',
      );

      context.session.isRemoveLinkInputActive = true;
      context.session.isAddLinkInputActive = false;
    });

    this.bot.action('handle_show_links_button', (context) => {
      const addedChannels = context.session.addedChannels || [];
      const transformedChannels = addedChannels.map((channel) => `@${channel}`);
      const stringifiedLinks = transformedChannels.join(NEW_LINE_SYMBOL);

      if (!stringifiedLinks.length) {
        context.reply('У вас нет добавленных сообществ');

        return;
      }

      context.reply(stringifiedLinks);
    });

    this.bot.on('text', async (context) => {
      const resetSessionState = () => {
        context.session.isAddLinkInputActive = false;
        context.session.isRemoveLinkInputActive = false;
      };

      const addedChannels = context.session.addedChannels;
      const enteredText = context.text.trim();

      if (!context.session.isAddLinkInputActive && !context.session.isRemoveLinkInputActive) {
        try {
          const { audioUrl } = await PlayHT.generate(enteredText, DEFAULT_VOICE_OPTIONS as PlayHT.SpeechOptions);

          context.replyWithAudio(audioUrl, { caption: enteredText });
        } catch (error) {
          console.log('An error occured while converting text to audio', error);
        }

        return;
      }

      const channelName = mapEnteredLinkToChannelName(enteredText);

      if (!channelName) {
        context.reply('Введите корректное название канала');

        return;
      }

      if (context.session.isAddLinkInputActive) {
        if (addedChannels) {
          if (addedChannels.includes(channelName)) {
            context.reply(
              'Сообщество уже добавлено в отслеживаемые. Введите ссылку на сообщество для добавления его в отслеживаемые',
            );
          } else {
            context.session.addedChannels.push(channelName);
            context.reply('Сообщество было успешно добавлено в отслеживаемые');

            resetSessionState();
          }
        } else {
          context.session.addedChannels = [channelName];
          context.reply('Сообщество было успешно добавлено в отслеживаемые');

          resetSessionState();
        }

        return;
      }

      if (context.session.isRemoveLinkInputActive) {
        if (addedChannels) {
          if (!addedChannels.includes(channelName)) {
            context.reply(
              'Введенное сообщество не находится в отслеживаемых. Введите ссылку на сообщество для удаления его из отслеживаемых',
            );
          } else {
            context.session.addedChannels = addedChannels.filter(
              (channel) => channel !== channelName,
            );
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
