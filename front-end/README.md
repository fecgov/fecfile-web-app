# FECfile+

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Running locally

The simplest way to run a local development server is to run `ng serve` or `npx -p @angular/cli ng serve`. You can then navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Alternatively, to run the frontend through nginx using a production-like static build and CSP behavior, you can use `docker compose`:

- `docker compose [--profile watch] [up|down]`

If you would like the docker container to be automatically `downed` and tmp files cleaned up on quitting, you can run the same commands with a wrapper via npm:

- `npm run local:up`
- `npm run local:watch:up`
- `npm run local:down`

For this setup:

- In both cases the frontend is served on `localhost:4200`.
- In watch mode, nginx still serves the app and proxies BrowserSync endpoints internally for live reload support.
- The compose services run helper scripts in `scripts/` to build the frontend, render local nginx config, and (in watch mode) trigger reload after successful rebuilds.

This setup builds the Angular app, renders a local nginx config from `../deploy-config/front-end-nginx-config/nginx.conf`, and starts nginx with built files mounted at `/usr/share/nginx/html/fecfile-web`.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Instructions for the starting the End-to-End Tests can be found [Here](cypress/README.md).

## Running the linter

Run `./node_modules/.bin/eslint "src/**/*.ts" --max-warnings=0` to execute the linter for your local build.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Mock API

If you need a mock API to begin front end development, you can use the Node server setup within the server directory.
To start the server you run the command `npm run json-server`.

- If on Ubuntu and Angular CLI stops watching changes suddenly, then increase the notify watches limit on Linux.
  - `sudo sysctl fs.inotify.max_user_watches=524288`
  - `sudo sysctl -p --system`
  - From: https://github.com/angular/angular-cli/issues/2356
