import { logger } from '../utils/logger';
import { getRunner } from './get-runner';
import * as github from '@actions/github';

/**
 * Removes a self-hosted runner from the GitHub repository if it exists.
 *
 * @param githubToken The GitHub token used for authentication.
 * @param label The label of the self-hosted runner to be removed.
 */
export async function unregisterGitHubRunner(githubToken: string, label: string): Promise<void> {
  // Destructure the GitHub context to get the owner and repo.
  const { owner, repo } = github.context.repo;

  // Create an Octokit instance with the provided GitHub token.
  const octokit = github.getOctokit(githubToken);

  // Retrieve the runner by label
  const runner = await getRunner(githubToken, label);

  // Check if the runner exists.
  if (!runner) {
    logger.info(`GitHub: Runner '${label}' not found`);
    return;
  }

  try {
    // Remove the self-hosted runner from the repository.
    await octokit.rest.actions.deleteSelfHostedRunnerFromRepo({
      owner,
      repo,
      runner_id: runner.id,
    });

    // Log the successful removal of the runner.
    logger.success(`GitHub: Self-hosted runner '${label}' has been removed`);
  } catch (error) {
    // Log the error message and throw an error.
    logger.error('GitHub: Failed to remove self-hosted runner');
    throw error;
  }
}
