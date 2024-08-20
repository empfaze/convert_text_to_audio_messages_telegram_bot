import { Telegraf } from 'telegraf';
import { IBotContext } from '../types/context';

export abstract class Command {
  constructor(public bot: Telegraf<IBotContext>) {}

  abstract handleCommand(): void;
}
