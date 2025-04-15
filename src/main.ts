import { Config } from './config';
import * as core from '@actions/core';
import { setOutput } from './utils/set-output';
import { startEc2Instance } from './aws/start-ec2-instance';
import { waitEc2InstanceRunning } from './aws/wait-ec2-instance-running';
import { getGitHubRegistrationToken } from './github/get-registration-token';

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    // Read inputs and validate configuration.
    const config = new Config();

    // Decider for the action mode.
    if (config.mode === 'start') {
      // Create github registration token and
      const token = await getGitHubRegistrationToken(config);

      // Start the EC2 instance.
      const { instanceId, label } = await startEc2Instance(config, token);

      // Set the output of the action.
      setOutput(instanceId, label);

      // Wait for the EC2 instance to be in running state.
      await Promise.all([waitEc2InstanceRunning(config, instanceId)]);
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('Unknown error');
    }
  }
}
