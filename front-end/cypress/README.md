# Running end-to-end tests

Running the End-to-End tests requires a little pre-configuration for both the back-end and the front-end prior to launching the tests.

## Starting the Back-End

First, the back-end needs to be set up. The back-end must be instructed to use the test db, and you do so with an environment variable:

```
export DB_DOCKERFILE="Dockerfile-e2e"
```

Then start the back-end normally with `docker-compose up` and run migrations as usual

You will want to use the test e2e database and the e2e test login, because the testing process will purge data from the database as needed
to reinitialize tests.

To add the test login account, log into the fecfile-api docker container and run:
docker exec -it fecfile-api /bin/bash
python manage.py loaddata fixtures/e2e-test-data.json

## Preparing the Front-End

Before you can run the end-to-end tests, you must first set the following environment variables: (the values will depend on your local database)

```
export CYPRESS_EMAIL=''
export CYPRESS_COMMITTEE_ID=''
export CYPRESS_PASSWORD=''
export CYPRESS_PIN=''
export CELERY_WORKER_STORAGE="local"
```

## Running the E2E tests

With the environment variables set, run `ng e2e` to execute the end-to-end tests via [Cypress](https://www.cypress.io/).

To run in headless mode, run the command: ng e2e --headless

## E2E tests in CircleCI

A new job was added to the CircleCI fecfile-web-app configuration to run the E2E test suite nightly. This job uses CircleCI's [Docker executor](https://circleci.com/docs/building-docker-images/#run-docker-commands-using-the-docker-executor) to spin up an instance of the fecfile-web-api using Docker Compose in an isolated remote docker instance.

For security reasons, CircleCI's remote docker [does not allow mounting volumes](https://circleci.com/docs/building-docker-images/#mounting-folders), and thus our compose `volumes` commands fail. To get around this, we had to create two new E2E Dockerfiles for the API/Worker to add these filesystem resources to the images directly.

Once the CircleCI E2E job spins up fecfile-web-api in the remote docker, it then creates a new ephemeral container (networked to interact with fecfile-api [per CircleCI instructions](https://circleci.com/docs/building-docker-images/#accessing-services)) to run the E2E tests and finally executes them.

There are a number of environment variables that are required by the CircleCI E2E job. These are currently set within the CircleCI fecfile-web-app project and include:

CIRCLE_BRANCH (fecfile-web-api and fecfile-web-app branch to checkout for the E2E test execution)
E2E_DJANGO_SECRET_KEY (The Django secret key used to spin up the api)
E2E_DATABASE_URL (The database url for the api)
CYPRESS_EMAIL (email of the e2e account for login)
CYPRESS_COMMITTEE_ID (committee id of the e2e account for login)
CYPRESS_PASSWORD (password of the e2e account for login)

Finally, a CircleCI Trigger was added to [schedule a nightly job](https://circleci.com/docs/set-a-nightly-scheduled-pipeline/) to kick off the E2E tests (and any other nightly jobs we might want in the future).

To run locally (you may need to add e2e-test to all workflow jobs in app circleci config.yml first, or circleci will complain about not being able to find it. Also, you also may need to add 'sudo' in front of the docker commands (otherwise it will complain about not being able to find Docker Daemon listening):

```
export CIRCLE_BRANCH=''
export E2E_DJANGO_SECRET_KEY=''
export E2E_DATABASE_URL=''
export CYPRESS_EMAIL=''
export CYPRESS_COMMITTEE_ID=''
export CYPRESS_PASSWORD=''
sudo circleci local execute -e CIRCLE_BRANCH=${CIRCLE_BRANCH} -e E2E_DJANGO_SECRET_KEY=${E2E_DJANGO_SECRET_KEY} -e E2E_DATABASE_URL=${E2E_DATABASE_URL} -e CYPRESS_EMAIL=${CYPRESS_EMAIL} -e CYPRESS_COMMITTEE_ID=${CYPRESS_COMMITTEE_ID} -e CYPRESS_PASSWORD=${CYPRESS_PASSWORD} --job e2e-test
```

## Tips for Writing E2E Tests
- Assertions made immediately after a page load will sometimes check the previous page before the new page loads.  Add checks to ensure that the new page has loaded where possible.
- The `.contains()` Cypress method cannot find the value of a text input field.  For assertions, you can instead use the `.should('have.value', VALUE)` method.
