import { DotenvParseOutput, config } from 'dotenv';
import { IConfigService } from '../types/config';

export class ConfigService implements IConfigService {
  private config: DotenvParseOutput;

  constructor() {
    const { error, parsed } = config();

    if (error) {
      throw new Error('No env file was found!');
    }

    if (!parsed) {
      throw new Error('Empty env file!');
    }

    this.config = parsed;
  }

  get(key: string): string {
    const value = this.config[key];

    if (!value) {
      throw new Error('No such key was found');
    }

    return value;
  }
}
