#!/usr/bin/env bash

GIT_DIR=$(git rev-parse --git-dir)

set -e

break_installation() {
    echo "
    Developers need to have git secrets installed and configured properly.
    See the README for more information.

    Preventing installation...
    "
    rm -r node_modules
    exit 1
}

# If the environment variable is present, then exit with a success
if [[ $IGNORE_GIT_SECRETS_CHECK ]]; then exit 0; fi

# If the git secrets command doesn't result in a man page, it isn't installed
if ! git secrets | grep -q "usage"
then
    echo "Git secrets is not installed";
    break_installation;
fi

# If the --list flag doesn't include any patterns, our pattern install script hasn't been run
if ! git secrets --list | grep -q "patterns"
then
    echo "Git secrets has no installed patterns.  Have you run the API repo's install script?";
    break_installation;
fi

exit 0;