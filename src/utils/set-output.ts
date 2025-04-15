import * as core from '@actions/core';

/**
 * Sets the outputs of the GitHub Action.
 *
 * @param ec2InstanceId - The ID of the launched EC2 instance.
 * @param label - The label assigned to the GitHub Actions runner.
 */
export function setOutput(ec2InstanceId: string, label: string): void {
  core.setOutput('label', label);
  core.setOutput('ec2-instance-id', ec2InstanceId);
}
