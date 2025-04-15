import { Octokit } from '@octokit/rest';

/**
 * Creates a GitHub client using the provided configuration.
 * This client is used to interact with the GitHub API.
 *
 * @param githubToken The GitHub token used for authentication.
 * @returns An authenticated GitHub client.
 * @throws Will throw an error if the GitHub token is not provided.
 */
export function createGitHubClient(githubToken: string): Octokit {
  // Check if the GitHub token is provided.
  if (!githubToken) {
    throw new Error('GitHub token is required to interact with GitHub API.');
  }

  // Create and return an authenticated GitHub client.
  return new Octokit({ auth: githubToken });
}
