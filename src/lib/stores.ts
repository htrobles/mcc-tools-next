import { Store } from '@prisma/client';

export const STORES: Record<
  Store,
  {
    name: string;
    url: string;
  }
> = {
  LM: {
    name: 'Long and McQuade',
    url: 'https://www.longandmcquade.com',
  },
  REDONE: {
    name: 'RedOne',
    url: 'https://www.redone.com',
  },
  ACCLAIM: {
    name: 'Accclaim',
    url: 'https://www.acclaim-music.com/',
  },
  //   AMAZON: {
  //     name: 'Amazon',
  //     url: 'https://www.amazon.com',
  //   },
};
