import * as github from '@actions/github';
import { createGitHubClient } from './github-client';

/**
 * Type representing the status of a self-hosted runner.
 * It can be either 'online' or 'offline'.
 */
export type RunnerStatus = 'online' | 'offline' | string;

/**
 * Type representing the labels associated with a self-hosted runner.
 */
export type Labels = {
  id?: number;
  name: string;
  type?: 'read-only' | 'custom';
};

/**
 * Interface representing a self-hosted runner in GitHub Actions.
 */
export interface Runner {
  id: number;
  name: string;
  os: string;
  status: RunnerStatus;
  busy: boolean;
  labels: Labels[];
  runner_group_id?: number;
  ephemeral?: boolean;
}

/**
 * Retrieves a self-hosted runner from GitHub Actions for the current repository.

 * @param githubToken The GitHub token used for authentication.
 * @param label Self-hosted runner label to search for.
 * @throws Will throw an error if the runner cannot be found.
 * @returns The runner object if found.
 */
export async function getRunner(githubToken: string, label: string): Promise<Runner | undefined> {
  // Create client.
  const client = createGitHubClient(githubToken);

  // Destructure the owner and repo from the GitHub context.
  const { owner, repo } = github.context.repo;

  // List self-hosted runners for the repository.
  const { data } = await client.rest.actions.listSelfHostedRunnersForRepo({ owner, repo });

  // Check if the runner with the specified label exists.
  return data.runners.find((runner) => runner.labels.some((l) => l.name === label));
}
