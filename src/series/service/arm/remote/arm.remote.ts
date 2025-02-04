import { env } from '../../../../common/core/env.ts';
import { request } from '../../../../common/core/request.ts';
import { Service } from '../../../../common/types/state.ts';
import { ArmModel } from './types.ts';

const getService = (): Service => ({
  url: env<string>('YUNA'),
  credential: {},
});

export const getByAnilist = async (
  anilist: number,
): Promise<ArmModel> => {
  const service = getService();
  const parms = new URLSearchParams({
    source: 'anilist',
    id: `${anilist}`,
  });
  return await request(
    `${service.url}/api/v2/ids?${parms}`,
  );
};

export const getByTvdb = async (
  tvdb: number,
): Promise<ArmModel[]> => {
  const service = getService();
  const parms = new URLSearchParams({
    id: `${tvdb}`,
  });
  return await request(
    `${service.url}/api/v2/thetvdb?${parms}`,
  );
};
