import {
  TELEGRAM_NAME_ABSOLUTE_ORIGIN_ADDRESS,
  TELEGRAM_NAME_ABSOLUTE_ORIGIN_ADDRESS_REGEX,
  TELEGRAM_NAME_RELATIVE_ORIGIN_ADDRESS,
  TELEGRAM_NAME_RELATIVE_ORIGIN_ADDRESS_REGEX,
} from '../constants/common';

export const mapEnteredLinkToChannelName = (link: string) => {
  let channelName = '';

  if (link.startsWith(TELEGRAM_NAME_ABSOLUTE_ORIGIN_ADDRESS)) {
    const match = link.match(TELEGRAM_NAME_ABSOLUTE_ORIGIN_ADDRESS_REGEX);

    if (match) {
      channelName = match[1];
    }
  } else if (link.startsWith(TELEGRAM_NAME_RELATIVE_ORIGIN_ADDRESS)) {
    const match = link.match(TELEGRAM_NAME_RELATIVE_ORIGIN_ADDRESS_REGEX);

    if (match) {
      channelName = match[1];
    }
  }

  return channelName;
};
