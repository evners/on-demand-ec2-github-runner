import { Config } from '../config';
import { logger } from '../utils/logger';
import { EC2Client, TerminateInstancesCommand } from '@aws-sdk/client-ec2';

/**
 * Stops an EC2 instance using the specified instance ID.
 *
 * @param config - The action configuration.
 * @returns A promise that resolves when the instance is terminated.
 */
export async function terminateEc2Instance(config: Config): Promise<void> {
  // Destructure the config object to get the instanceId.
  const { instanceId } = config;
  // Create an EC2 client.
  const ec2Client: EC2Client = new EC2Client();

  // Create a new command to terminate the instance.
  const command = new TerminateInstancesCommand({
    InstanceIds: [instanceId!],
  });

  // Send the command to terminate the instance.
  // This will stop the instance and release any associated resources.
  await ec2Client.send(command);

  // Log the successful termination of the instance.
  logger.success(`AwsEC2: Instance '${instanceId}' terminated`);
}
