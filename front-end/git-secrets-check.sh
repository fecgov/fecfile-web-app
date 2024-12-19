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

if ! git secrets | grep -q "usage"
then
    echo "Git secrets is not installed";
    break_installation;
fi

if ! git secrets --list | grep -q "patterns"
then
    echo "Git secrets has no installed patterns.  Have you run the API repo's install script?";
    break_installation;
fi

exit 0;