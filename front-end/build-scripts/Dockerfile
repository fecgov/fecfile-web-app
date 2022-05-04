# base image
FROM node:14 as builder
ARG SNYK_AUTH_TOKEN

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH


# install synk so we can run snyk protect on startup
RUN if [ -z ${SNYK_AUTH_TOKEN} ]; then echo; echo; echo You must set the SNYK_AUTH_TOKEN env variable to build this docker image.; echo; echo; exit 1; fi
RUN curl https://static.snyk.io/cli/latest/version > snyk.version
RUN curl -sO https://static.snyk.io/cli/v$(cat snyk.version)/snyk-linux
RUN curl -q -sO https://static.snyk.io/cli/v$(cat snyk.version)/snyk-linux.sha256
RUN sha256sum -c snyk-linux.sha256
RUN cp snyk-linux /usr/local/bin/snyk
RUN chmod a+x /usr/local/bin/snyk
RUN snyk auth $SNYK_AUTH_TOKEN

CMD ["npm", "run", "start-docker"]

