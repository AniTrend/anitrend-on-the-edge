import { AnimeResource, MangaResource } from '../remote/types.ts';
import { JikanAnime, JikanManga } from '../types.ts';
import { Transform } from '../../../../common/transformer/types.ts';

export const animeTransform: Transform<AnimeResource, JikanAnime> = (
  sourceData,
): JikanAnime => ({
  ...sourceData,
});

export const mangaTransform: Transform<MangaResource, JikanManga> = (
  sourceData,
): JikanManga => ({
  ...sourceData,
});
