#!/bin/bash
#
# This utility script configures the git-secrets pre-commit hook to
# the repository in which it is run at the root of the repository 
# directory tree.
#
# To run, first install AWS git-secret utility in your PATH so it can
# be run at the command line:
# https://github.com/awslabs/git-secrets#installing-git-secrets
#
# Once you have git-secrets installed locally, run this script in the
# root directory of your cloned fecfile-online repo to install the
# pre-commit hook.
#
# See git-secrets README for more features:
# https://github.com/awslabs/git-secrets#readme
#
# NOTE: Later on, if the hook flags a line in a file to be committed that is
# okay, you can add an "allowed" option to let it pass based on the file name
# and line number output by the rule that flagged the possible secret.
# e.g. git secrets --add --allowed --literal '.circleci/config.yml:82'

# Install the git hooks for the repostory
git secrets --install
git secrets --register-aws

# Add general custom rules
git secrets --add '(dbpasswd|dbuser|dbname|dbhost|api_key|apikey|key|api|password|user|guid|hostname|pw|auth)\s*[=:]\s*['"'"'0-9a-zA-Z_\/+!{}=-]{4,120}'
git secrets --add '(DBPASSWD|DBUSER|DBNAME|DBHOST|API_KEY|APIKEY|KEY|API|PASSWORD|USER|GUID|HOSTNAME|PW|AUTH)\s*[=:]\s*['"'"'0-9a-zA-Z_\/+!{}=-]{4,120}'
git secrets --add '(aws_access_key_id|aws_secret_access_key)\s*[=:]\s*['"'"'0-9a-zA-Z\/+]{20,42}'
git secrets --add '(AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY)\s*[=:]\s*['"'"'0-9a-zA-Z\/+]{20,42}'

# Add rules targeting docker files
git secrets --add --literal 'POSTGRES_PASSWORD'
git secrets --add --allowed --literal 'POSTGRES_PASSWORD: postgres'

# Add rules targeting django-backend/fecfiler/settings.py
git secrets --add --literal 'OTP_DEFAULT_PASSCODE'
git secrets --add --allowed --literal 'OTP_DEFAULT_PASSCODE = "111111"'
git secrets --add --literal 'API_LOGIN'
git secrets --add --allowed --literal 'API_LOGIN = os.environ.get('"'"'API_LOGIN'"'"', None)'
git secrets --add --literal 'API_PASSWORD'
git secrets --add --allowed --literal 'API_PASSWORD = os.environ.get('"'"'API_PASSWORD'"'"', None)'
git secrets --add --literal 'SECRET_KEY'
git secrets --add --allowed --literal 'SECRET_KEY = '"'"'!0)(sp6(&$=_70&+_(zogh24=)@5&smwtuwq@t*v88tn-#m=)z'"'"''
git secrets --add --literal ''"'"'USER'"'"''
git secrets --add --allowed --literal ''"'"'USER'"'"': os.environ.get('"'"'FECFILE_DB_USER'"'"', '"'"'postgres'"'"')'
git secrets --add --literal ''"'"'PASSWORD'"'"''
git secrets --add --allowed --literal ''"'"'PASSWORD'"'"': os.environ.get('"'"'FECFILE_DB_PASSWORD'"'"', '"'"'postgres'"'"')'
git secrets --add --literal 'AWS_SECRET_ACCESS_KEY'
git secrets --add --allowed --literal 'AWS_SECRET_ACCESS_KEY = os.environ.get('"'"'SECRET_KEY'"'"', None)'

# Add rules to allow specific safe files that don't pass the above rule screens.
git secrets --add --allowed --literal 'install-git-secrets-hook.sh:'
