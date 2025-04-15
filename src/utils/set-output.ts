import * as core from '@actions/core';

/**
 * Sets the outputs of the GitHub Action.
 *
 * @param label - The label assigned to the GitHub Actions runner.
 * @param ec2InstanceId - The ID of the launched EC2 instance.
 */
export function setOutput(label: string, ec2InstanceId: string): void {
  core.setOutput('label', label);
  core.setOutput('ec2-instance-id', ec2InstanceId);
}
