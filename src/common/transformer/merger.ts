import { Transforms } from './types.ts';

export const mergeTransformers = <S, T>(
  ...transformers: Transforms<S, T>[]
): Transforms<S, T> => {
  return (sourceData) =>
    transformers.reduce<T[]>(
      (acc, transformer) => acc.concat(transformer(sourceData)),
      [],
    );
};
