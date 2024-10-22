import { Markup, Telegraf } from 'telegraf';
import { Command } from './command';
import { IBotContext } from '../types/context';
import {
  ACTION_COMMAND,
  DEFAULT_VOICE_OPTIONS,
  NEW_LINE_SYMBOL,
} from '../constants/common';
import { mapEnteredLinkToChannelName } from '../helpers/common';
import * as PlayHT from 'playht';
import {
  ADD_COMMUNITY_MESSAGE,
  CHOOSE_ACTION_MESSAGE,
  COMMUNITY_IS_ADDED_MESSAGE,
  COMMUNITY_IS_ALREADY_ADDED_MESSAGE,
  COMMUNITY_IS_REMOVED_MESSAGE,
  DELETE_COMMUNITY_MESSAGE,
  ENTERED_COMMUNITY_IS_NOT_ADDED_MESSAGE,
  ENTER_CORRECT_COMMUNITY_NAME_MESSAGE,
  ENTER_LINK_TO_ADD_COMMUNITY_MESSAGE,
  ENTER_LINK_TO_REMOVE_COMMUNITY_MESSAGE,
  NO_ADDED_COMMUNITIES_MESSAGE,
  SHOW_COMMUNITIES_MESSAGE,
} from '../constants/messages';

export class ActionCommand extends Command {
  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }

  handleCommand(): void {
    this.bot.command(ACTION_COMMAND, (context) => {
      context.reply(
        CHOOSE_ACTION_MESSAGE,
        Markup.inlineKeyboard([
          [
            Markup.button.callback(ADD_COMMUNITY_MESSAGE, 'handle_add_button'),
            Markup.button.callback(
              DELETE_COMMUNITY_MESSAGE,
              'handle_remove_button',
            ),
          ],
          [
            Markup.button.callback(
              SHOW_COMMUNITIES_MESSAGE,
              'handle_show_links_button',
            ),
          ],
        ]),
      );
    });

    this.bot.action('handle_add_button', (context) => {
      context.reply(ENTER_LINK_TO_ADD_COMMUNITY_MESSAGE);

      context.session.isAddLinkInputActive = true;
      context.session.isRemoveLinkInputActive = false;
    });

    this.bot.action('handle_remove_button', (context) => {
      if (!context.session.addedChannels.length) {
        context.reply(NO_ADDED_COMMUNITIES_MESSAGE);

        return;
      }

      context.reply(ENTER_LINK_TO_REMOVE_COMMUNITY_MESSAGE);

      context.session.isRemoveLinkInputActive = true;
      context.session.isAddLinkInputActive = false;
    });

    this.bot.action('handle_show_links_button', (context) => {
      const addedChannels = context.session.addedChannels || [];
      const transformedChannels = addedChannels.map((channel) => `@${channel}`);
      const stringifiedLinks = transformedChannels.join(NEW_LINE_SYMBOL);

      if (!stringifiedLinks.length) {
        context.reply(NO_ADDED_COMMUNITIES_MESSAGE);

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

      if (
        !context.session.isAddLinkInputActive &&
        !context.session.isRemoveLinkInputActive
      ) {
        try {
          const { audioUrl } = await PlayHT.generate(
            enteredText,
            DEFAULT_VOICE_OPTIONS as PlayHT.SpeechOptions,
          );

          context.replyWithAudio(audioUrl, { caption: enteredText });
        } catch (error) {
          console.log('An error occured while converting text to audio', error);
        }

        return;
      }

      const channelName = mapEnteredLinkToChannelName(enteredText);

      if (!channelName) {
        context.reply(ENTER_CORRECT_COMMUNITY_NAME_MESSAGE);

        return;
      }

      if (context.session.isAddLinkInputActive) {
        if (addedChannels) {
          if (addedChannels.includes(channelName)) {
            context.reply(
              `${COMMUNITY_IS_ALREADY_ADDED_MESSAGE}. ${ENTER_LINK_TO_ADD_COMMUNITY_MESSAGE}`,
            );
          } else {
            context.session.addedChannels.push(channelName);
            context.reply(COMMUNITY_IS_ADDED_MESSAGE);

            resetSessionState();
          }
        } else {
          context.session.addedChannels = [channelName];
          context.reply(COMMUNITY_IS_ADDED_MESSAGE);

          resetSessionState();
        }

        return;
      }

      if (context.session.isRemoveLinkInputActive) {
        if (addedChannels) {
          if (!addedChannels.includes(channelName)) {
            context.reply(
              `${ENTERED_COMMUNITY_IS_NOT_ADDED_MESSAGE}. ${ENTER_LINK_TO_REMOVE_COMMUNITY_MESSAGE}`,
            );
          } else {
            context.session.addedChannels = addedChannels.filter(
              (channel) => channel !== channelName,
            );
            context.reply(COMMUNITY_IS_REMOVED_MESSAGE);

            resetSessionState();
          }
        } else {
          context.reply(NO_ADDED_COMMUNITIES_MESSAGE);
          resetSessionState();
        }
      }
    });
  }
}
