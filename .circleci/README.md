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
circleci config process .circleci/config.yml >/tmp/circleci.processed.yml
```

## Run the CircleCI Job locally
You can run a CircleCI job locally and avoid the change/commit/wait loop you need to 
do if you want to actually run the changes on Circle. 
This can save a lot of time when trying to debug an issue in CI.
```
circleci local execute JOB_NAME
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

The current E2E jobs are `e2e-smoke` and `e2e-extended`. They pin the browser
runner to
`cypress/browsers:node-24.14.0-chrome-146.0.7680.80-1-ff-148.0.2-edge-146.0.3856.62-1`,
attach that container to the API proxy network, and run the npm headless E2E
entrypoints from `front-end`.

You may need to add `sudo` in front of local Docker-backed CircleCI commands if
your machine requires it.

```
sudo circleci local execute -e CIRCLE_BRANCH=${CIRCLE_BRANCH} e2e-smoke
sudo circleci local execute -e CIRCLE_BRANCH=${CIRCLE_BRANCH} e2e-extended
```
