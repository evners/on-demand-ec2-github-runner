import { Config } from '../config';
import { createUserData } from './create-user-data';
import { generateLabel } from '../utils/generate-label';
import { EC2Client, RunInstancesCommand, TagSpecification } from '@aws-sdk/client-ec2';

/**
 * Represents the data returned after starting an EC2 instance.
 *
 * @property {string} instanceId - The ID of the launched EC2 instance.
 * @property {string} label - The label assigned to the GitHub Actions runner.
 */
export type Ec2InstanceData = {
  instanceId: string;
  label: string;
};

/**
 * Starts an EC2 instance based on the provided configuration.
 *
 * @param config - The action configuration.
 * @param token - The GitHub registration token.
 * @returns Object containing the instance ID and runner label.
 */
export async function startEc2Instance(config: Config, token: string): Promise<Ec2InstanceData> {
  // Create a label, user data, and EC2 client.
  const label: string = generateLabel();
  const userData: string = createUserData(label, token);
  const ec2Client: EC2Client = new EC2Client();

  // Create the tag specifications for the instance.
  // If tags are provided in the config, use them; otherwise, create a default tag with the label.
  const tagSpecifications: TagSpecification[] =
    config.tags?.length > 0
      ? config.tags
      : [
          // Specify the tags for the instance.
          {
            ResourceType: 'instance',
            Tags: [{ Key: 'Name', Value: `github-runner-${label}` }],
          },
          // Specify the tags for the volume.
          {
            ResourceType: 'volume',
            Tags: [{ Key: 'Name', Value: `github-runner-${label}` }],
          },
        ];

  // Create a new command to run the instance.
  const runInstancesCommand: RunInstancesCommand = new RunInstancesCommand({
    ImageId: config.amiId,
    InstanceType: config.instanceType,
    MinCount: config.minCount,
    MaxCount: config.maxCount,
    UserData: userData,
    TagSpecifications: tagSpecifications,
    SecurityGroupIds: config.securityGroupId ? [config.securityGroupId] : undefined,
  });

  // Extract the instance ID from the response.
  const { Instances } = await ec2Client.send(runInstancesCommand);
  const instanceId = Instances?.[0]?.InstanceId;

  // Verify that the instance ID was returned.
  if (!instanceId) {
    throw new Error('Failed to launch EC2 instance');
  }

  // Return the instance ID and label.
  return { instanceId, label };
}
