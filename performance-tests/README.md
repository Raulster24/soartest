# Performance Tests

This project uses [k6](https://k6.io/) to run load, stress, and BDD tests. The tests are integrated into a GitHub Actions workflow, which can be found at the root of the project.


## Running Tests in GitHub Actions

The GitHub Actions workflow is defined in the `k6-test.yml` file located at the root of the project. This pipeline can be triggered on demand and on every commit and push.

### Triggering the Pipeline

The pipeline can be triggered automatically on every commit and push. To trigger the pipeline manually, you can use the GitHub Actions interface from here - https://github.com/Raulster24/soartest/actions

### Configuring the Pipeline

You can configure the pipeline by modifying the `k6-test.yml` file. This file allows you to specify different triggers, environments, and other settings as per your requirements.

## Execution Reports

Execution reportsin html are attached in results directory with following names :

bddtest-report.html
login-stresstest-report.html
registration-loadtest-report.html


## Additional Resources

- [k6 Documentation](https://k6.io/docs/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

For any further assistance, please refer to the documentation or contact the me.