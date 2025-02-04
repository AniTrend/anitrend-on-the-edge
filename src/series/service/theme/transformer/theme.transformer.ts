import { env } from '../../../../common/core/env.ts';
import { Transform } from '../../../../common/transformer/types.ts';
import { ThemeMetaModel, ThemeModel } from '../remote/types.ts';
import { Theme, ThemeType } from './types.ts';

const themeMetaData = (theme: ThemeMetaModel) => {
  const parts = theme.themeType.match(/(OP|ED)(\d+)?( V(\d+))?/);
  const number = parts?.at(2);
  const version = parts?.at(4);
  return {
    type: parts?.at(1) as ThemeType,
    number: number ? parseInt(number, 10) : 1,
    version: version ? parseInt(version, 10) : 1,
  };
};

export const transform: Transform<ThemeModel[], Theme[]> = (
  sourceData,
) => {
  const id = sourceData.at(0)?.malID;
  const url = `${env('THEMES')}/themes/${id}`;
  return sourceData.flatMap((item) => item.themes)
    .sort((prev, next) => prev.mirror.priority - next.mirror.priority)
    .map((item) => (
      {
        id: item.themeType,
        name: item.themeName,
        video: item.mirror.mirrorURL,
        audio: `${url}/${item.themeType}/audio`,
        meta: themeMetaData(item),
      }
    ));
};
