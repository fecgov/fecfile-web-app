## About this project

The Federal Election Commission (FEC) is the independent regulatory agency
charged with administering and enforcing the federal campaign finance law.
The FEC has jurisdiction over the financing of campaigns for the U.S. House,
Senate, Presidency and the Vice Presidency.

This project will provide a web application for filling out FEC campaign
finance information. The project code is distributed across these repositories:

- [fecfile-web-app](https://github.com/fecgov/fecfile-web-app): this is the browser-based front-end developed in Angular
- [fecfile-web-api](https://github.com/fecgov/fecfile-web-api): RESTful API supporting the front-end developed in Django
- [fecfile-validate](https://github.com/fecgov/fecfile-validate): data validation rules and engine

The project is hosted on the [cloud.gov](https://cloud.gov/docs/) platform and uses [login.gov](https://www.login.gov/what-is-login/) for authentication.

---

## Set up

### Prerequisites

Software necessary to run the application locally:
- node
- npx

### Running the Front-End locally

From within the front-end directory, install packages with:

```
npm install
```

and run the application with the command:

```
npx -p @angular/cli ng serve
```

to start a local server for the application. The front-end can then be accessed through [your browser at port 4200](http://localhost:4200/).

### Running end-to-end (E2E) tests

Cypress is used for end-to-end (E2E) tests. [E2E instructions...](https://github.com/fecgov/fecfile-web-app/tree/develop/front-end/cypress#readme)

# Deployment (FEC team only)

[Deployment instructions](https://github.com/fecgov/fecfile-web-api/wiki/Deployment)

See also: [Technical Design](https://github.com/fecgov/fecfile-web-api/wiki/Technical-Design)

## Additional developer notes

- When making CSP changes, make sure to keep nginx and localhost in sync.
  - [NGINX](https://github.com/fecgov/fecfile-web-app/blob/develop/deploy-config/front-end-nginx-config/nginx.conf)
  - [local](https://github.com/fecgov/fecfile-web-app/blob/develop/front-end/angular.json)

See [Additional Developer Notes](https://github.com/fecgov/fecfile-web-api/wiki/Additional-Developer-Notes).


This project is tested with [BrowserStack](https://browserstack.com).
