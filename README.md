# On-Demand EC2 GitHub Runner

[![Release](https://img.shields.io/github/v/release/evners/on-demand-ec2-github-runner)](https://github.com/evners/on-demand-ec2-github-runner/releases)
[![Build Status](https://github.com/evners/on-demand-ec2-github-runner/actions/workflows/release.yml/badge.svg)](https://github.com/evners/on-demand-ec2-github-runner/actions)
[![License](https://img.shields.io/github/license/evners/on-demand-ec2-github-runner)](LICENSE)
[![Marketplace](https://img.shields.io/badge/marketplace-on--demand--ec2--runner-blue)](https://github.com/marketplace/actions/on-demand-ec2-github-runner)

This action makes it easy for **GitHub Actions** users to dynamically **start**, **stop**, and manage **EC2 instances** as **self-hosted runners**, ensuring faster, more flexible, and cost-efficient workflows.

### ✅ Features

- Launch an EC2 instance with a GitHub self-hosted runner
- Automatically register and unregister the runner
- Optional configuration for instance type, volume size, and timeout
- Stop and terminate the runner instance after use

### 📥 Inputs

| Name                     | Description                                                               | Required        | Default    |
| ------------------------ | ------------------------------------------------------------------------- | --------------- | ---------- |
| `mode`                   | Action mode: `"start"` to launch an instance, `"stop"` to terminate one   | No              | `start`    |
| `label`                  | Label assigned to the GitHub runner. Required in `stop` mode.             | On `stop` mode  | -          |
| `ec2-ami-id`             | AMI ID to use for the EC2 instance                                        | On `start` mode | -          |
| `ec2-instance-type`      | EC2 instance type (e.g., `t3.micro`, `t3a.small`, etc.)                   | No              | `t2.micro` |
| `ec2-min-count`          | Minimum number of EC2 instances to launch                                 | No              | `1`        |
| `ec2-max-count`          | Maximum number of EC2 instances to launch                                 | No              | `1`        |
| `ec2-max-wait-time`      | Max seconds to wait for the EC2 instance to be in "running" state         | No              | `300`      |
| `ec2-instance-id`        | Instance ID to terminate (required in `stop` mode)                        | On `stop` mode  | -          |
| `github-token`           | GitHub token with `repo` scope (used for runner registration and removal) | Yes             | -          |
| `runner-timeout-minutes` | Max minutes to wait for the GitHub runner to register                     | No              | `5`        |
| `runner-retry-seconds`   | Interval (in seconds) to poll the runner registration status              | No              | `5`        |
| `runner-quiet-seconds`   | Initial wait (in seconds) before checking if the runner is registered     | No              | `30`       |

### 📤 Outputs

| Name              | Description                             |
| ----------------- | --------------------------------------- |
| `label`           | GitHub runner label (used in `runs-on`) |
| `ec2-instance-id` | Instance ID of the launched EC2 runner  |

### 🚀 Usage

This action can be used in two modes: `start` and `stop`.

#### 🟢 Start Mode

In `start` mode, it launches an EC2 instance, registers it as a GitHub Actions runner, and returns the `label` and `instance ID` as outputs. Use this step at the beginning of your workflow to start an EC2 runner on demand.

```yaml
setup-runner:
  runs-on: ubuntu-latest
  # These outputs (the EC2 instance ID and the GitHub runner label) will be used by other jobs later
  # in the workflow to run steps on the runner and clean up the resources when finished.
  outputs:
    label: ${{ steps.start-runner.outputs.label }}
    ec2-instance-id: ${{ steps.start-runner.outputs.ec2-instance-id }}

  steps:
    # Use 'aws-actions/configure-aws-credentials@v4' to authenticate with AWS.
    # It securely loads credentials from GitHub Secrets so the workflow can manage EC2 instances.
    - name: AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-region: ${{ secrets.AWS_REGION }}
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

    # Launch a new EC2 instance using the specified AMI. It will install the GitHub Actions runner,
    # register it to your repository and make it available to run jobs dynamically.
    - name: Start Runner
      id: start-runner
      uses: evners/on-demand-ec2-github-runner@v1
      with:
        ec2-ami-id: ${{ secrets.EC2_AMI_ID }}
        github-token: ${{ secrets.GITHUB_TOKEN }}
```

You can then use the runner in a following job using the `label` output:

```yaml
your-job:
  needs: setup-runner
  runs-on: ${{ needs.setup-runner.outputs.label }} # Pass the label to use the runner.
  steps:
    - name: Run your job
      run: |
        echo "Running on EC2 self-hosted runner!"
```

#### 🔴 Stop Mode

In `stop` mode, it terminates the EC2 instance and removes the runner from GitHub.

```yaml
stop-runner:
  if: always() # Ensures this job runs even if earlier jobs fail.
  needs: [setup-runner, your-job]
  runs-on: ubuntu-latest
  steps:
    # Use 'aws-actions/configure-aws-credentials@v4' to authenticate with AWS.
    # It securely loads credentials from GitHub Secrets so the workflow can terminate the EC2 instance.
    - name: AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-region: ${{ secrets.AWS_REGION }}
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

    # Use the 'evners/on-demand-ec2-runner@v1' action in 'stop' mode to terminate the EC2 instance
    # and automatically remove the self-hosted runner from GitHub.
    - name: Stop Runner
      uses: evners/on-demand-ec2-runner@v1
      with:
        mode: 'stop'
        label: ${{needs.setup-runner.outputs.label }}
        github-token: ${{ secrets.GITHUB_TOKEN }}
        ec2-instance-id: ${{ needs.setup-runner.outputs.ec2-instance-id }}
```

### 📝 License

The scripts and documentation in this project are released under the [MIT License](./LICENSE).

### 🤝 Contributions

Contributions are welcome and greatly appreciated! If you have ideas, improvements, or fixes, feel free to open an issue or submit a pull request.
