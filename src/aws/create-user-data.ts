import * as github from '@actions/github';

/**
 * Generates the userData script to bootstrap the EC2 runner instance.
 *
 * @param label - The label assigned to the GitHub Actions runner.
 * @param token - The GitHub runner registration token.
 * @returns A base64-encoded userData string.
 */
export function createUserData(label: string, token: string): string {
  // Build the userData script.
  const script: string[] = [
    '#!/bin/bash',
    'set -e',
    'exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1',

    '# Create runner directory',
    'mkdir actions-runner && cd actions-runner',

    '# Detect architecture (arm64 or x64)',
    'case $(uname -m) in aarch64) ARCH="arm64" ;; amd64|x86_64) ARCH="x64" ;; esac && export RUNNER_ARCH=${ARCH}',

    '# Set runner version',
    'export RUNNER_VERSION=2.313.0',

    '# Download GitHub Actions runner',
    'curl -O -L https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-${RUNNER_ARCH}-${RUNNER_VERSION}.tar.gz',
    'tar xzf ./actions-runner-linux-${RUNNER_ARCH}-${RUNNER_VERSION}.tar.gz',

    '# Set runner permissions',
    'export RUNNER_ALLOW_RUNASROOT=1',

    '# Configure the runner',
    `./config.sh --url https://github.com/${github.context.repo.owner}/${github.context.repo.repo} --token ${token} --labels ${label}`,

    '# Install runner as a service',
    'sudo ./svc.sh install',

    '# Start the runner service',
    'sudo ./svc.sh start',
  ];

  // Encode to Base64.
  return Buffer.from(script.join('\n')).toString('base64');
}
