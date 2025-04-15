import * as core from '@actions/core';
import { _InstanceType, TagSpecification } from '@aws-sdk/client-ec2';

/**
 * Configuration class for the GitHub Action.
 * Reads and validates the input parameters.
 */
export class Config {
  // Global.
  readonly mode: string;

  // AWS - EC2.
  readonly amiId?: string;
  readonly minCount: number;
  readonly maxCount: number;
  readonly maxWaitTime: number; // In seconds
  readonly instanceType: _InstanceType;
  readonly tags: TagSpecification[] = [];

  // GitHub - Runner.
  readonly githubToken: string;

  /**
   * Constructor for the Config class.
   * @throws Will throw an error if the input parameters are invalid.
   */
  constructor() {
    // Global.
    this.mode = core.getInput('mode', { required: true }) as 'start' | 'stop';
    this.minCount = parseInt(core.getInput('ec2-min-count')) || 1;
    this.maxCount = parseInt(core.getInput('ec2-max-count')) || 1;

    // AWS - EC2.
    this.amiId = core.getInput('ec2-ami-id') || undefined;
    this.maxWaitTime = parseInt(core.getInput('ec2-max-wait-time') || '300', 10);
    this.instanceType = (core.getInput('ec2-instance-type') || 't2.micro') as _InstanceType;

    // GitHub - Runner.
    this.githubToken = core.getInput('github-token');

    // Validate inputs.
    this.validate();
  }

  /**
   * Validates required fields depending on the mode.
   */
  private validate(): void {
    // Validate the mode.
    if (!['start', 'stop'].includes(this.mode)) {
      throw new Error('Input "mode" must be either "start" or "stop".');
    }

    // Validate the AMI ID.
    if (this.mode === 'start' && !this.amiId) {
      throw new Error('Input "ec2-ami-id" is required when mode is "start".');
    }

    // Validate github token.
    if (!this.githubToken) {
      throw new Error('Input "github-token" is required.');
    }
  }
}
