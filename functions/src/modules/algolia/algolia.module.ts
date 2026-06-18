import { Module, Global } from '@nestjs/common';
import { algoliasearch } from 'algoliasearch';

export const ALGOLIA = 'ALGOLIA';

@Global()
@Module({
  providers: [
    {
      provide: ALGOLIA,
      useFactory: () => {
        const appId = process.env.ALGOLIA_APP_ID;
        const apiKey = process.env.ALGOLIA_API_KEY;

        if (!appId || !apiKey) {
          throw new Error(
            'Algolia credentials are not set in environment variables',
          );
        }

        return algoliasearch(appId, apiKey);
      },
    },
  ],
  exports: [ALGOLIA],
})
export class AlgoliaModule {}
