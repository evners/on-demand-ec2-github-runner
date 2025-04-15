import { Config } from './config';
import * as core from '@actions/core';
import { setOutput } from './utils/set-output';
import { startEc2Instance } from './aws/start-ec2-instance';

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
      // Start the EC2 instance.
      const { instanceId, label } = await startEc2Instance(config);

      // Set the output of the action.
      setOutput(instanceId, label);
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('Unknown error');
    }
  }
}
