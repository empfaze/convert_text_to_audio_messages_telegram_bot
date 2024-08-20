import { Context } from 'telegraf';

export interface ISessionData {}

export interface IBotContext extends Context {
  session: ISessionData;
}
