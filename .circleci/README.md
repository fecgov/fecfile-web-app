# CircleCI Configuration

# Using CircleCI local CLI 

## Install circleci local
Install on Linux or Mac with:
```
curl -fLSs https://raw.githubusercontent.com/CircleCI-Public/circleci-cli/master/install.sh | bash
```

Details and instructions for other platforms in the [CircleCI Docs](https://circleci.com/docs/2.0/local-cli/)

## Validate the config.yml
Run this from the top level of the repo:
```
circleci config validate
```

## Run the CircleCI Job locally
You can run a CircleCI job locally and avoid the change/commit/wait loop you need to 
do if you want to actually run the changes on Circle. 
This can save a lot of time when trying to debug an issue in CI.
```
circleci local execute --job JOB_NAME
```

## CircleCI configuration
To get CircleCI to run tests, you have to configure the
project in the Circle web applicaiton https://app.circleci.com/

CircleCI will attempt to deploy commits made to specific branches:
* branch __develop__ -> cloud.gov dev space
* branch __release__* (any branch starting with release) -> cloud.gov staging space
* branch __main__ -> cloud.gov test space
* branch __main__ -> cloud.gov prod space

Authentication must be configured in a set of evironment variables:
* $FEC_CF_USERNAME_DEV
* $FEC_CF_PASSWORD_DEV
* $FEC_CF_USERNAME_STAGE
* $FEC_CF_PASSWORD_STAGE
* $FEC_CF_USERNAME_TEST
* $FEC_CF_PASSWORD_TEST
* $FEC_CF_USERNAME_PROD
* $FEC_CF_PASSWORD_PROD

## CircleCI E2E tests

An E2E test job was added to the fecfile-web-app CircleCI configuration file and a corresponding technical details section added to the Cypress README.md.  This job can be kicked off using the following command (You will need to ensure you pass additional required environment variables to the job as needed and documented in the Cypress README.md.  Also, you may need to temporarily add 'e2e-test' to each workflow defined under the CircleCI config's 'workflows' section so that the command line can find it.  You also may need to add 'sudo' in front of the docker commands (otherwise it will complain about not being able to find Docker Daemon listening)). 

```
sudo circleci local execute -e CIRCLE_BRANCH=${CIRCLE_BRANCH} --job e2e-test
```