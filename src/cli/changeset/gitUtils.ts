// Adapted from https://github.com/changesets/action/blob/21240c3cd1d2efa2672d64e0235a03cf139b83e6/src/utils.ts

import git from 'isomorphic-git';

import { exec } from '../../utils/exec';
import {
  getHeadSha,
  gitBranch,
  gitDeleteBranch,
  gitPush,
} from '../../utils/git';

import { execWithOutput } from './utils';

// TODO probably try and make this configurable
const getBotName = () => 'skuba';

export const setupUser = async () => {
  await exec('git', 'config', '--global', 'user.name', getBotName());
  await exec(
    'git',
    'config',
    '--global',
    'user.email',
    `${getBotName()}@users.noreply.github.com`,
  );
};

export const pullBranch = async (branch: string) => {
  await exec('git', 'pull', 'origin', branch);
};

export const push = async (
  dir: string,
  branch: string,
  token: string,
  { force }: { force?: boolean } = {},
) => {
  await gitPush({
    dir,
    auth: { type: 'gitHubApp', token },
    branch,
    commitOid: await getHeadSha(dir),
    force,
  });
};

export const pushTags = async () => {
  await exec('git', 'push', 'origin', '--tags');
};

export const switchToMaybeExistingBranch = async (
  dir: string,
  branch: string,
) => {
  try {
    await gitBranch({ dir, ref: branch, checkout: true });
  } catch (error) {
    if (error instanceof git.Errors.AlreadyExistsError) {
      await gitDeleteBranch({ dir, ref: branch });
      await gitBranch({ dir, ref: branch, checkout: true });
      return;
    }

    throw error;
  }
};

export const reset = async (
  pathSpec: string,
  mode: 'hard' | 'soft' | 'mixed' = 'hard',
) => {
  await exec('git', 'reset', `--${mode}`, pathSpec);
};

export const commitAll = async (message: string) => {
  await exec('git', 'add', '.');
  await exec('git', 'commit', '-m', message);
};

export const checkIfClean = async (): Promise<boolean> => {
  const { stdout } = await execWithOutput('git', ['status', '--porcelain']);
  return !(stdout as Array<unknown>).length;
};
