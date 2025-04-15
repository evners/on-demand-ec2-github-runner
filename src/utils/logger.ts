import * as core from '@actions/core';

/**
 * Logger utility for GitHub Actions.
 * Provides methods to log messages with different severity levels.
 */
export const logger = {
  info: (message: string) => core.info(`➜ ${message}`),
  error: (message: string) => core.error(`✘ ${message}`),
  success: (message: string) => core.info(`✔ ${message}`),
};
