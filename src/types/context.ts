import { Context } from 'telegraf';

export interface ISessionData {
  isAddLinkInputActive: boolean;
  isRemoveLinkInputActive: boolean;
  addedChannels: string[];
}

export interface IBotContext extends Context {
  session: ISessionData;
}
