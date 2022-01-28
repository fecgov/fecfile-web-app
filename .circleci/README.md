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
* branch __prod__ -> cloud.gov prod space

Authentication must be configured in a set of evironment variables:
* $FEC_CF_USERNAME_DEV
* $FEC_CF_PASSWORD_DEV
* $FEC_CF_USERNAME_STAGE
* $FEC_CF_PASSWORD_STAGE
* $FEC_CF_USERNAME_PROD
* $FEC_CF_PASSWORD_RROD
  
