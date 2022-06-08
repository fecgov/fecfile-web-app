# Running end-to-end tests

Running the End-to-End tests requires a little pre-configuration for both the back-end and the front-end prior to launching the tests.  

## Starting the Back-End
  
First, the back-end needs to be set up.  The back-end must be instructed to use the test db, and you do so with an environment variable:  

```
export DOCKERFILE="Dockerfile-e2e"
```

Then start the back-end normally with `docker-compose up` and run migrations as usual

## Preparing the Front-End

Before you can run the end-to-end tests, you must first set the following environment variables: (the values will depend on your local database)  
  
```
export CYPRESS_EMAIL=''
export CYPRESS_COMMITTEE_ID=''
export CYPRESS_PASSWORD=''
export CYPRESS_PIN=''
```  
  
## Running the E2E tests

With the environment variables set, run `ng e2e` to execute the end-to-end tests via [Cypress](https://www.cypress.io/).

